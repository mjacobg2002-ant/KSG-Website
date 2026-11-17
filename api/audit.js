// Vercel Function: POST (or GET) /api/audit
//
// Dental Practice Website, Metadata & Leak Diagnostic Scanner for /audit.
// Input: { practiceName, city, websiteUrl, email? }  (GET uses the same names as query params)
//
// What it does, server-side:
//   1. Normalizes and safety-checks the URL (public hosts only, 8s fetch timeout,
//      manual redirect following, https → http fallback on SSL errors).
//   2. Parses the live HTML: title, meta description, H1, canonical / Open Graph,
//      JSON-LD schema, click-to-call, online booking, viewport, ad/analytics
//      trackers, and the CMS / site builder.
//   3. Asks Google PageSpeed Insights for mobile performance, LCP and SEO score.
//      If PSI is slow or rate-limited, falls back to a labeled estimate from
//      server response time and page weight.
//   4. Scores 1.0–10.0 by fixed deductions (see `score()`), returned line by line.
//   5. Logs the lead (practice, city, URL, email, score) by email/webhook. A
//      delivery failure never fails the scan.
//
// Optional env: PAGESPEED_API_KEY (Google API key with PageSpeed Insights enabled).
// Delivery env: see api/_lib/deliver.js.

import { lookup } from "node:dns/promises";
import net from "node:net";
import { EMAIL_RE, clean, clientIp, deliver, rateLimiter, readBody, sendEmail, sendWebhook } from "./_lib/deliver.js";

const FETCH_TIMEOUT_MS = 8000;
const PSI_TIMEOUT_MS = 22000;
const MAX_HTML_BYTES = 2_000_000;
const MAX_REDIRECTS = 5;
const UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const limited = rateLimiter(10, 10 * 60 * 1000);

/* ------------------------------------------------------------------ */
/* URL normalization and safety                                         */
/* ------------------------------------------------------------------ */
export function normalizeUrl(input) {
  let raw = clean(input).replace(/\s+/g, "");
  if (!raw) return { error: "Please enter your practice website." };
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw.replace(/^\/+/, "")}`;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return { error: "That doesn't look like a valid website address." };
  }
  const host = url.hostname.toLowerCase();
  if (!/^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(host)) {
    return { error: "That doesn't look like a valid website address." };
  }
  if (/\.(local|internal|localhost|test|invalid|example)$/.test(host)) return { error: "Please enter a public website address." };
  if (url.port && !["80", "443"].includes(url.port)) return { error: "Please enter a standard website address." };
  url.hash = "";
  url.username = "";
  url.password = "";
  return { url };
}

function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) || a >= 224;
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivateAddress(v.slice(7));
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("ff");
}

async function assertPublicHost(hostname) {
  const records = await lookup(hostname, { all: true });
  if (!records.length || records.some((r) => isPrivateAddress(r.address))) throw new Error("blocked-host");
}

async function fetchOnce(startUrl, deadline) {
  let current = startUrl;
  const started = Date.now();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const check = normalizeUrl(current.href);
    if (check.error) throw new Error("blocked-host");
    await assertPublicHost(current.hostname);
    const res = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(Math.max(1000, deadline - Date.now())),
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      await res.body?.cancel().catch(() => {});
      current = new URL(res.headers.get("location"), current);
      if (!/^https?:$/.test(current.protocol)) throw new Error("blocked-host");
      continue;
    }
    const ttfbMs = Date.now() - started;
    // Read at most MAX_HTML_BYTES so a huge page can't stall the scan.
    const reader = res.body?.getReader();
    const chunks = [];
    let bytes = 0;
    if (reader) {
      while (bytes < MAX_HTML_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        bytes += value.length;
      }
      await reader.cancel().catch(() => {});
    }
    const html = Buffer.concat(chunks).toString("utf8");
    return { status: res.status, finalUrl: current, html, bytes, ttfbMs, contentType: res.headers.get("content-type") || "", server: res.headers.get("server") || "", poweredBy: res.headers.get("x-powered-by") || "" };
  }
  throw new Error("too-many-redirects");
}

/** Tries https first, then http, so an expired certificate still gets a report. */
async function fetchSite(url) {
  const deadline = Date.now() + FETCH_TIMEOUT_MS;
  const httpsUrl = new URL(url.href);
  httpsUrl.protocol = "https:";
  try {
    const page = await fetchOnce(httpsUrl, deadline);
    return { ...page, httpsOk: page.finalUrl.protocol === "https:", sslError: false };
  } catch (err) {
    if (err.message === "blocked-host") throw err;
    const httpUrl = new URL(url.href);
    httpUrl.protocol = "http:";
    const page = await fetchOnce(httpUrl, Math.max(deadline, Date.now() + 4000));
    return { ...page, httpsOk: page.finalUrl.protocol === "https:", sslError: page.finalUrl.protocol !== "https:" };
  }
}

/* ------------------------------------------------------------------ */
/* HTML parsing (regex-based; no DOM dependency)                        */
/* ------------------------------------------------------------------ */
const decode = (s) =>
  s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&ndash;|&mdash;/gi, "-")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const text = (s) => decode(String(s || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag)) !== null) out[m[1].toLowerCase()] = decode(m[3] ?? m[4] ?? m[5] ?? "");
  return out;
}

const tags = (html, name) => (html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || []).map(attrs);

function schemaTypes(html) {
  const types = new Set();
  const nodes = [];
  let blocks = 0;
  let invalid = 0;
  const re = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  const walk = (node, depth = 0) => {
    if (!node || depth > 8) return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, depth + 1));
    if (typeof node !== "object") return;
    const t = node["@type"];
    const list = (Array.isArray(t) ? t : [t]).filter((x) => typeof x === "string").map((x) => x.replace(/^https?:\/\/schema\.org\//, ""));
    list.forEach((x) => types.add(x));
    if (list.length) nodes.push({ types: list, node });
    Object.values(node).forEach((v) => typeof v === "object" && walk(v, depth + 1));
  };
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks++;
    try {
      walk(JSON.parse(m[1].trim()));
    } catch {
      invalid++;
      // Fall back to a loose scan so one stray comma doesn't hide the types.
      (m[1].match(/"@type"\s*:\s*"([^"]+)"/g) || []).forEach((s) => types.add(s.replace(/.*"([^"]+)"$/, "$1")));
    }
  }
  return { types: [...types], nodes, blocks, invalid };
}

const CMS = [
  ["WordPress", /wp-content\/|wp-includes\/|<meta[^>]+generator[^>]+WordPress/i],
  ["Wix", /wixstatic\.com|static\.parastorage\.com|<meta[^>]+generator[^>]+Wix/i],
  ["Squarespace", /squarespace\.com|static1\.squarespace|squarespace-cdn/i],
  ["Weebly", /weebly\.com|editmysite\.com/i],
  ["GoDaddy Website Builder", /img1\.wsimg\.com|<meta[^>]+generator[^>]+(GoDaddy|Starfield)|websites\.godaddy/i],
  ["ProSites", /prosites\.com|prositehosting|prosites-/i],
  ["Officite", /officite\.com|officite/i],
  ["Dental Sesame (Sesame Communications)", /sesamecommunications|sesamehub|sesame24-7/i],
  ["PBHS", /pbhs\.com|pbhs-/i],
  ["Roadside Dental Marketing", /roadsidemultimedia|roadside dental/i],
  ["Great Dental Websites", /greatdentalwebsites/i],
  ["Smile Savvy", /smilesavvy/i],
  ["TNT Dental", /tntdental/i],
  ["Dental Qore", /dentalqore/i],
  ["Duda", /multiscreensite\.com|dudaone|cdn-website\.com|irp\.cdn-website/i],
  ["Webflow", /website-files\.com|<meta[^>]+generator[^>]+Webflow|data-wf-site/i],
  ["Shopify", /cdn\.shopify\.com/i],
  ["HubSpot CMS", /hs-scripts\.com|<meta[^>]+generator[^>]+HubSpot/i],
  ["Framer", /framerusercontent\.com/i],
  ["Next.js (custom build)", /\/_next\/static\//i],
];

function detectCms(html, page) {
  for (const [name, re] of CMS) if (re.test(html)) return name;
  const gen = tags(html, "meta").find((m) => m.name?.toLowerCase() === "generator")?.content;
  if (gen) return gen.slice(0, 60);
  if (/wordpress|wp engine/i.test(`${page.poweredBy} ${page.server}`)) return "WordPress";
  return "Custom / not identified";
}

const BOOKING_VENDORS = [
  ["NexHealth", /nexhealth\.com/i],
  ["LocalMed", /localmed\.com/i],
  ["Zocdoc", /zocdoc\.com/i],
  ["Open Dental", /opendental\.com|patientviewer\.com|opendentalsoft/i],
  ["Calendly", /calendly\.com/i],
  ["Weave", /getweave\.com|book\.getweave/i],
  ["Modento", /modento\.io/i],
  ["Flex Dental", /flex\.dental/i],
  ["YAPI", /yapiapp\.(com|io)/i],
  ["Doctible", /doctible\.com/i],
  ["Lighthouse 360", /lh360\.com|lighthouse360/i],
  ["Solutionreach", /solutionreach\.com/i],
  ["RevenueWell", /revenuewell\.com/i],
  ["CareStack", /carestack\.com/i],
  ["Dentrix Ascend", /dentrixascend\.com/i],
  ["Curve Dental", /curvehero\.com|curvegro/i],
  ["tab32", /tab32\.com/i],
  ["Acuity Scheduling", /acuityscheduling\.com/i],
  ["Square Appointments", /squareup\.com\/appointments|square\.site\/book/i],
  ["Google Reserve", /google\.com\/maps\/reserve/i],
  ["Dental Intelligence", /dentalintel\.(com|net)/i],
];

const TRACKERS = [
  ["meta", "Meta (Facebook) Pixel", /connect\.facebook\.net|fbq\s*\(|facebook\.com\/tr\?/i, true],
  ["doubleclick", "Google Ads / DoubleClick", /doubleclick\.net|googleadservices\.com|gtag\(\s*['"]config['"]\s*,\s*['"]AW-/i, true],
  ["tiktok", "TikTok Pixel", /analytics\.tiktok\.com|ttq\.(load|track|page)/i, true],
  ["gtm", "Google Tag Manager", /googletagmanager\.com\/gtm\.js|googletagmanager\.com\/ns\.html/i, false],
  ["ga", "Google Analytics", /google-analytics\.com|googletagmanager\.com\/gtag\/js|gtag\(\s*['"]config['"]\s*,\s*['"](G|UA)-/i, false],
];

const DENTAL_WORDS = /\b(dentist|dentists|dental|dentistry|dds|dmd|orthodont\w*|periodont\w*|endodont\w*|prosthodont\w*|oral surgery|oral surgeon|implants?|invisalign|smiles?)\b/i;

/* ------------------------------------------------------------------ */
/* Google PageSpeed Insights                                            */
/* ------------------------------------------------------------------ */
async function pageSpeed(targetUrl) {
  const q = new URLSearchParams({ url: targetUrl, strategy: "mobile" });
  q.append("category", "performance");
  q.append("category", "seo");
  if (process.env.PAGESPEED_API_KEY) q.set("key", process.env.PAGESPEED_API_KEY);
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`;
  let res = await fetch(endpoint, { signal: AbortSignal.timeout(PSI_TIMEOUT_MS) });
  if (res.status >= 500) res = await fetch(endpoint, { signal: AbortSignal.timeout(PSI_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`PSI ${res.status}${process.env.PAGESPEED_API_KEY ? "" : " (no PAGESPEED_API_KEY set; the shared keyless quota is usually exhausted)"}`);
  const json = await res.json();
  const lh = json.lighthouseResult;
  const perf = lh?.categories?.performance?.score;
  if (typeof perf !== "number") throw new Error("PSI no score");
  const lcp = lh.audits?.["largest-contentful-paint"];
  return {
    source: "psi",
    performance: Math.round(perf * 100),
    seo: typeof lh.categories?.seo?.score === "number" ? Math.round(lh.categories.seo.score * 100) : null,
    lcpSeconds: typeof lcp?.numericValue === "number" ? Math.round(lcp.numericValue / 100) / 10 : null,
  };
}

/*
 * Stand-in when PageSpeed Insights is unavailable. Deliberately conservative:
 * it can't see real load behaviour, so it never reports a passing score, and
 * drag-and-drop builders (which ship heavy runtime JS) start lower. Always
 * labeled as an estimate in the UI.
 */
const SLOW_BUILDERS = /^(Wix|Weebly|Squarespace|GoDaddy Website Builder|Duda|ProSites|Officite|Dental Sesame|PBHS|Shopify)/;
export function estimateSpeed(page, cms = "") {
  const html = page.html;
  const scripts = (html.match(/<script\b/gi) || []).length;
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [""])[0];
  const blockingCss = (head.match(/<link\b[^>]*rel\s*=\s*["']?stylesheet/gi) || []).length;
  const blockingJs = (head.match(/<script\b(?![^>]*\b(async|defer|type\s*=\s*["']?(module|application\/ld\+json)))[^>]*\bsrc=/gi) || []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const eagerImgs = imgs.filter((t) => !/loading\s*=\s*["']?lazy/i.test(t)).length;
  let s = 78;
  if (SLOW_BUILDERS.test(cms)) s -= 26;
  else if (cms === "WordPress") s -= 12;
  if (page.ttfbMs > 2500) s -= 30;
  else if (page.ttfbMs > 1200) s -= 18;
  else if (page.ttfbMs > 600) s -= 8;
  if (page.bytes > 800_000) s -= 14;
  else if (page.bytes > 300_000) s -= 7;
  if (scripts > 50) s -= 14;
  else if (scripts > 25) s -= 7;
  if (blockingCss + blockingJs > 6) s -= 8;
  else if (blockingCss + blockingJs > 3) s -= 4;
  if (eagerImgs > 12) s -= 6;
  return { source: "estimate", performance: Math.max(15, Math.min(70, s)), seo: null, lcpSeconds: null, scripts, blocking: blockingCss + blockingJs };
}

/* ------------------------------------------------------------------ */
/* Analysis                                                             */
/* ------------------------------------------------------------------ */
const GENERIC_WORDS = new Set(["dental", "dentistry", "dentist", "dentists", "the", "and", "of", "family", "studio", "care", "center", "centre", "group", "associates", "practice", "smile", "smiles", "office", "clinic", "pc", "llc", "dds", "dmd", "pllc", "&", "cosmetic", "general"]);

/** The distinctive words of the practice name ("Westpark Dental Studio" → ["westpark"]). */
function brandWords(practiceName) {
  return clean(practiceName).toLowerCase().replace(/[^a-z0-9\s'&-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));
}

export function analyze(page, city, practiceName = "") {
  const html = page.html;
  const lower = html.toLowerCase();
  const metas = tags(html, "meta");
  const links = tags(html, "link");
  const anchors = tags(html, "a");
  const meta = (key) => metas.find((m) => (m.name || m.property || "").toLowerCase() === key)?.content?.trim() || "";

  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const description = meta("description");
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1])).filter(Boolean);
  const canonical = links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "";
  const ogTitle = meta("og:title");
  const ogImage = meta("og:image");
  const viewport = meta("viewport");
  const schema = schemaTypes(html);

  const cityName = clean(city).split(",")[0].trim().toLowerCase();
  const hasCity = (s) => cityName.length > 1 && s.toLowerCase().includes(cityName);
  const brand = brandWords(practiceName);
  const hasBrand = (s) => brand.length > 0 && brand.some((w) => s.toLowerCase().includes(w));

  // Visible page text (scripts, styles and hidden templates removed).
  const bodyStart = Math.max(0, lower.indexOf("<body"));
  const visible = text(html.slice(bodyStart).replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, " "));
  const words = visible ? visible.split(/\s+/).length : 0;
  const phoneShown = /(\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b)/.test(visible);

  // Images without useful alt text.
  const imgs = tags(html, "img").filter((i) => !/^data:image\/(gif|svg)/i.test(i.src || "") && !/(pixel|spacer|tracking)/i.test(i.src || ""));
  const imgsNoAlt = imgs.filter((i) => !(i.alt || "").trim() || /^(image|img|photo|picture|untitled)[\s\d_-]*$/i.test(i.alt.trim())).length;

  // Local schema detail: the most specific type and whether it carries the facts Google looks for.
  const localNodes = schema.nodes.filter((n) => n.types.some((t) => LOCAL_TYPES.includes(t)));
  const dentistNode = localNodes.find((n) => n.types.some((t) => DENTAL_TYPES.includes(t)));
  const best = dentistNode || localNodes[0];
  const field = (k) => Boolean(best && best.node[k] && (typeof best.node[k] !== "string" || best.node[k].trim()));
  const schemaFacts = best ? {
    name: field("name"),
    address: field("address"),
    telephone: field("telephone"),
    hours: field("openingHours") || field("openingHoursSpecification"),
    url: field("url") || field("@id"),
  } : null;

  // Click-to-call: in the header/nav, or at least near the top of the page?
  const telCount = anchors.filter((a) => /^tel:/i.test(a.href || "")).length;
  const headerHtml = [...html.matchAll(/<(header|nav)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]).join(" ");
  const topSlice = html.slice(bodyStart, bodyStart + Math.max(6000, Math.round((html.length - bodyStart) * 0.3)));
  const telInHeader = /href\s*=\s*["']?tel:/i.test(headerHtml) || /href\s*=\s*["']?tel:/i.test(topSlice);

  // Online booking: a real scheduling widget vs. a link to a request form.
  const bookingVendor = BOOKING_VENDORS.find(([, re]) => re.test(html))?.[0] || "";
  const bookingLink = anchors.some((a) => /\/(book|booking|appointments?|schedule|scheduling|request-an?-appointment)\b/i.test(a.href || "")) ||
    /(book|schedule|request)\s+(an?\s+)?(appointment|online|now|a visit)/i.test(visible.slice(0, 60000));
  const hasForm = /<form\b/i.test(html);

  const trackers = TRACKERS.filter(([, , re]) => re.test(html)).map(([id, name, , ad]) => ({ id, name, ad }));
  const adTrackers = trackers.filter((t) => t.ad);
  const patientFacing = hasForm || Boolean(bookingVendor) || bookingLink;

  return {
    title, description, h1s, canonical, ogTitle, ogImage, viewport, schema, cityName, brand,
    titleHasDental: DENTAL_WORDS.test(title), titleHasCity: hasCity(title), titleHasBrand: hasBrand(title),
    descHasCity: hasCity(description), descHasDental: DENTAL_WORDS.test(description),
    h1HasCity: h1s.some(hasCity), h1HasDental: h1s.some((h) => DENTAL_WORDS.test(h)),
    bodyHasCity: hasCity(visible), cityMentions: cityName.length > 1 ? visible.toLowerCase().split(cityName).length - 1 : 0,
    words, phoneShown, imgs: imgs.length, imgsNoAlt,
    localTypes: localNodes.flatMap((n) => n.types.filter((t) => LOCAL_TYPES.includes(t))), hasDentistType: Boolean(dentistNode), schemaFacts,
    telCount, telInHeader, bookingVendor, bookingLink, hasForm, trackers, adTrackers, patientFacing,
    viewportOk: /width\s*=\s*device-width/i.test(viewport),
    cms: detectCms(html, page),
  };
}

const DENTAL_TYPES = ["Dentist", "DentalClinic"];
const LOCAL_TYPES = ["Dentist", "DentalClinic", "MedicalBusiness", "MedicalClinic", "LocalBusiness", "Physician", "MedicalOrganization", "ProfessionalService", "HealthAndBeautyBusiness"];
const GENERIC_TITLES = /^(home|homepage|welcome|index|untitled|home page|main)$/i;

/*
 * Scoring: start at 10.0 and subtract. Each area has a cap; the caps add up
 * to more than 10 so one strong area can't hide several weak ones. Floor 1.0.
 *   Mobile speed 2.5 · Title 1.5 · Meta description 1.0 · H1 0.5
 *   Local schema 1.5 · Local content & NAP 1.0 · Image alt text 0.5
 *   Canonical/Open Graph 0.5 · Click-to-call 1.0 · Online booking 1.0
 *   HTTPS/viewport 1.0 · Ad pixels near patient forms 1.0
 */
export function score(a, speed, page) {
  const deductions = [];
  const cut = (id, label, points, max) => deductions.push({ id, label, points: Math.round(Math.min(points, max) * 100) / 100, max });
  const checks = { local: [], speed: [], conversion: [], privacy: [] };
  const add = (group, id, label, status, detail) => checks[group].push({ id, label, status, detail });
  const statusFor = (points, max) => (points === 0 ? "pass" : points >= max * 0.6 ? "fail" : "warn");
  const cityLabel = a.cityName ? titleCase(a.cityName) : "your city";

  /* --- Mobile page speed: up to -2.5 --- */
  const p = speed.performance;
  const speedCut = p < 50 ? 2.5 : p < 75 ? 1.5 : p < 90 ? 0.5 : 0;
  cut("speed", `Mobile page speed (${p}/100${speed.source === "estimate" ? ", estimated" : ""})`, speedCut, 2.5);
  add("speed", "pagespeed", "Mobile performance score", statusFor(speedCut, 2.5),
    speed.source === "psi"
      ? `Google PageSpeed Insights scored the mobile site ${p}/100.${speed.seo !== null ? ` Google's SEO audit: ${speed.seo}/100.` : ""} Google treats 90+ as good.`
      : `Estimated ${p}/100. Google's own speed test didn't answer, so this is worked out from the page itself: ${a.cms.startsWith("Custom") ? "" : `built on ${a.cms}, `}server response ${page.ttfbMs} ms, ${Math.round(page.bytes / 1024)} KB of HTML, ${speed.scripts} scripts, ${speed.blocking} render-blocking files. An estimate never counts as a pass.`);
  if (speed.lcpSeconds !== null) {
    add("speed", "lcp", "Largest Contentful Paint (LCP)", speed.lcpSeconds <= 2.5 ? "pass" : speed.lcpSeconds <= 4 ? "warn" : "fail",
      `The main content takes ${speed.lcpSeconds}s to appear on a phone. Google's "good" threshold is 2.5s.`);
  }

  /* --- Title tag: up to -1.5 --- */
  let tCut = 0;
  const tNotes = [];
  const tLen = a.title.length;
  if (!a.title || GENERIC_TITLES.test(a.title)) {
    tCut = 1.5;
    tNotes.push(a.title ? `"${a.title}" tells Google nothing about who you are or where.` : "No <title> tag found. This is the headline Google shows in search results.");
  } else {
    if (!a.titleHasCity) (tCut += 0.75), tNotes.push(`doesn't name ${cityLabel}, so it can't match "dentist in ${cityLabel}" searches`);
    if (!a.titleHasDental) (tCut += 0.5), tNotes.push("has no dental keyword (dentist, dental)");
    if (a.brand.length && !a.titleHasBrand) (tCut += 0.25), tNotes.push("doesn't include the practice name");
    if (tLen < 30 || tLen > 65) (tCut += 0.25), tNotes.push(`is ${tLen} characters (30–65 is ideal so it isn't cut off)`);
  }
  cut("title", "Title tag local optimization", tCut, 1.5);
  add("local", "title", "Title tag", statusFor(Math.min(tCut, 1.5), 1.5),
    !a.title || GENERIC_TITLES.test(a.title) ? tNotes[0]
      : `"${a.title}". ${tNotes.length ? `It ${joinList(tNotes)}.` : "Names the city, a dental keyword and the practice at a good length."}`);

  /* --- Meta description: up to -1.0 --- */
  let dCut = 0;
  const dNotes = [];
  const dLen = a.description.length;
  if (!a.description) dCut = 1;
  else {
    if (!a.descHasCity) (dCut += 0.5), dNotes.push(`never mentions ${cityLabel}`);
    if (!a.descHasDental) (dCut += 0.25), dNotes.push("has no dental keyword");
    if (dLen < 70 || dLen > 160) (dCut += 0.25), dNotes.push(`is ${dLen} characters (70–160 is ideal)`);
  }
  cut("description", "Meta description", dCut, 1);
  add("local", "description", "Meta description", statusFor(dCut, 1),
    !a.description ? "No meta description. Google will pull a random line of page text into your search listing."
      : `"${a.description.slice(0, 170)}${dLen > 170 ? "…" : ""}" ${dNotes.length ? `It ${joinList(dNotes)}, so it reads as generic copy that could belong to any practice.` : "Local, specific and a good length."}`);

  /* --- H1: up to -0.5 --- */
  const h1Count = a.h1s.length;
  let hCut = 0;
  let hDetail;
  if (h1Count === 0) (hCut = 0.5), (hDetail = "No H1 heading with text. Google uses it to confirm what the page is about.");
  else if (h1Count > 3) (hCut = 0.5), (hDetail = `${h1Count} H1 headings on one page. One clear main heading reads better to Google.`);
  else {
    const notes = [];
    if (!a.h1HasCity) (hCut += 0.25), notes.push(`doesn't mention ${cityLabel}`);
    if (!a.h1HasDental) (hCut += 0.25), notes.push("has no dental keyword");
    if (h1Count > 1) notes.push(`and there are ${h1Count} H1s instead of one`);
    hDetail = `"${a.h1s[0].slice(0, 120)}"${notes.length ? `: it ${joinList(notes)}.` : ". Clear, local and on-topic."}`;
  }
  cut("h1", "Main heading (H1)", hCut, 0.5);
  add("local", "h1", "Main heading (H1)", statusFor(hCut, 0.5), hDetail);

  /* --- Local schema: up to -1.5 --- */
  let sCut = 0;
  let sDetail;
  if (!a.localTypes.length) {
    sCut = a.schema.types.includes("Organization") ? 1.25 : 1.5;
    sDetail = a.schema.types.includes("Organization")
      ? "Only generic Organization schema. Google gets no structured address, phone, hours or the fact that this is a dental practice."
      : "Missing Local Search Schema (Hurts Google Map Pack & AI Search Visibility). No Dentist or LocalBusiness markup found.";
  } else {
    const missing = Object.entries(a.schemaFacts || {}).filter(([, ok]) => !ok).map(([k]) => (k === "hours" ? "opening hours" : k));
    if (!a.hasDentistType) sCut += 0.75;
    sCut += Math.min(0.75, missing.length * 0.25);
    sDetail = `${a.hasDentistType ? "Dentist schema found" : `Found generic ${[...new Set(a.localTypes)].join(", ")} schema, not Dentist. Site builders add this automatically; it doesn't tell Google this is a dental practice`}.${missing.length ? ` Missing from it: ${missing.join(", ")}.` : " Name, address, phone and hours are all included."}`;
  }
  cut("schema", "Local dental schema (JSON-LD)", sCut, 1.5);
  add("local", "schema", "Local dental schema (JSON-LD)", statusFor(Math.min(sCut, 1.5), 1.5), sDetail);

  /* --- Local content & NAP: up to -1.0 --- */
  let cCut = 0;
  const cNotes = [];
  if (!a.bodyHasCity) (cCut += 0.5), cNotes.push(`${cityLabel} isn't mentioned anywhere in the page text`);
  else if (a.cityMentions < 2) (cCut += 0.25), cNotes.push(`${cityLabel} is mentioned only once`);
  if (!a.phoneShown) (cCut += 0.25), cNotes.push("no phone number appears in the page text");
  if (a.words < 300) (cCut += 0.25), cNotes.push(`only about ${a.words} words of text, thin for Google to rank`);
  cut("content", "Local content & phone on the page", cCut, 1);
  add("local", "content", "Local content & contact details", statusFor(cCut, 1),
    cNotes.length ? `${cNotes.join("; ").replace(/^./, (c) => c.toUpperCase())}. Google ranks pages that clearly say what you do and where.` : `About ${a.words} words, ${cityLabel} mentioned ${a.cityMentions} times, phone number shown.`);

  /* --- Image alt text: up to -0.5 --- */
  const altShare = a.imgs ? a.imgsNoAlt / a.imgs : 0;
  const altCut = a.imgs >= 3 && altShare > 0.5 ? 0.5 : a.imgs >= 3 && altShare > 0.2 ? 0.25 : 0;
  cut("alt", "Image alt text", altCut, 0.5);
  add("local", "alt", "Image descriptions (alt text)", statusFor(altCut, 0.5),
    !a.imgs ? "No images found in the page source." : `${a.imgsNoAlt} of ${a.imgs} images have no useful description. Alt text helps image search and screen readers.`);

  /* --- Canonical & Open Graph: up to -0.5 --- */
  const social = [a.canonical && "canonical", a.ogTitle && "og:title", a.ogImage && "og:image"].filter(Boolean);
  const socialCut = (a.canonical ? 0 : 0.25) + (a.ogTitle && a.ogImage ? 0 : 0.25);
  cut("social", "Canonical & Open Graph tags", socialCut, 0.5);
  add("local", "social", "Canonical & Open Graph tags", statusFor(socialCut, 0.5),
    social.length === 3 ? "Canonical URL, og:title and og:image are all set." : `Missing ${["canonical", "og:title", "og:image"].filter((x) => !social.includes(x)).join(", ")}. These control duplicate-page handling and how links look when shared.`);

  /* --- Conversion: up to -2.0 --- */
  const telCut = a.telInHeader ? 0 : 1;
  cut("tel", "Click-to-call in the header", telCut, 1);
  add("conversion", "tel", "Mobile click-to-call", a.telInHeader ? "pass" : a.telCount ? "warn" : "fail",
    a.telInHeader ? "A tap-to-call phone link is in the header or top of the page."
      : a.telCount ? "There is a tap-to-call link, but it's buried lower on the page. A patient in pain won't scroll for it."
        : "No tap-to-call phone link found. On a phone, patients have to copy the number by hand.");

  const bookCut = a.bookingVendor ? 0 : a.bookingLink ? 0.5 : 1;
  cut("booking", "Online booking flow", bookCut, 1);
  add("conversion", "booking", "Online booking", a.bookingVendor ? "pass" : a.bookingLink ? "warn" : "fail",
    a.bookingVendor ? `Real-time scheduling detected (${a.bookingVendor}).`
      : a.bookingLink ? "There's an appointment link, but no real-time scheduling widget was detected. It likely leads to a request form that someone has to answer by hand."
        : "No online booking path found. After hours, the only option is a voicemail or a contact form.");
  add("conversion", "missed-call", "Missed-call gap", "info",
    "A website scan can't see your phones. Any call that rings out after hours or during a busy front desk is a patient who usually dials the next practice. See how a text-back closes that gap at /demo-call.");

  /* --- SSL / viewport / pixels: up to -2.0 --- */
  const basicsCut = (page.httpsOk ? 0 : 0.5) + (a.viewportOk ? 0 : 0.5);
  cut("basics", "HTTPS and mobile viewport", basicsCut, 1);
  add("speed", "https", "HTTPS security", page.httpsOk ? "pass" : "fail",
    page.httpsOk ? "The site loads over a valid HTTPS connection." : page.sslError ? "The secure (https) version failed to load, so browsers show a \"Not secure\" warning." : "The site loads over plain http. Browsers show a \"Not secure\" warning.");
  add("speed", "viewport", "Mobile viewport", a.viewportOk ? "pass" : "fail",
    a.viewportOk ? "The page is set up to fit a phone screen." : "No mobile viewport tag. Phones will show a shrunken desktop page.");

  const pixelRisk = a.adTrackers.length > 0 && a.patientFacing;
  cut("pixels", "Ad pixels on patient-facing pages", pixelRisk ? 1 : 0, 1);
  const names = (list) => list.map((t) => t.name).join(", ");
  add("privacy", "pixels", "HIPAA & tracking pixels", pixelRisk ? "fail" : a.trackers.length ? "warn" : "pass",
    pixelRisk
      ? `Potential HIPAA Tracking Risk Detected: standard advertising pixels (${names(a.adTrackers)}) were found on a page with a patient ${a.hasForm ? "form" : "booking path"}. Ad pixels on booking and intake pages can pass a patient's IP address and appointment intent to ad platforms that won't sign a BAA. HHS/OCR has flagged this, and although a 2024 federal court ruling narrowed that guidance for public pages, it is still a privacy and lawsuit exposure worth a review with your compliance advisor.`
      : a.trackers.length
        ? `Found ${names(a.trackers)}. No advertising pixel was detected next to a patient form on this page. Tag managers can load other tags that a source scan can't see, so confirm what fires on your booking pages.`
        : "No advertising or analytics trackers were found in this page's source.");
  if (pixelRisk || a.trackers.length) add("privacy", "tracker-list", "Trackers found in the source", "info", names(a.trackers));

  const total = deductions.reduce((s, d) => s + d.points, 0);
  const value = Math.round(Math.max(1, Math.min(10, 10 - total)) * 10) / 10;
  const verdict =
    value < 4.5 ? { tone: "red", short: "High Patient Leak Risk", label: "Critical Leak Alert — Losing High-Intent Local Patients to Competitors" }
      : value < 7 ? { tone: "amber", short: "Underperforming", label: "Underperforming — Major Local SEO & Conversion Gaps Found" }
        : value < 8.5 ? { tone: "teal", short: "Solid Foundation", label: "Solid Foundation — Missing Speed-to-Lead & Schema Edge" }
          : { tone: "green", short: "Strong Baseline", label: "Strong Technical Baseline" };

  return {
    score: value,
    verdict,
    deductions,
    categories: [
      { id: "local", title: "Local Search & Metadata Health", checks: checks.local },
      { id: "speed", title: "Speed & Mobile Patient Experience", checks: checks.speed },
      { id: "conversion", title: "Conversion & Lead Capture Readiness", checks: checks.conversion },
      { id: "privacy", title: "HIPAA & Pixel Privacy Check", checks: checks.privacy },
    ],
  };
}

const joinList = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

const titleCase = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

function rankSummary(result, a) {
  const worst = [...result.deductions].filter((d) => d.points > 0).sort((x, y) => y.points - x.points).slice(0, 2).map((d) => d.label.replace(/\s*\(.*\)$/, "").toLowerCase());
  const lead = "Google's Map Pack favors practices whose sites load fast on a phone, state plainly who and where they are (title, description and Dentist schema), and make it easy to act.";
  if (!worst.length) return `${lead} This site clears every check in this scan, so the remaining ranking levers are off the page: reviews, Google Business Profile activity and local links.`;
  return `${lead} The biggest gaps here are ${worst.join(" and ")}. Each one makes it harder for Google to match this site to "dentist near me" searches${a.cityName ? ` in ${titleCase(a.cityName)}` : ""}, or for a patient who does find it to book.`;
}

/* ------------------------------------------------------------------ */
/* Handler                                                              */
/* ------------------------------------------------------------------ */
async function notify({ practiceName, city, websiteUrl, email, scoreText, cms, ip, error }) {
  const submittedAt = new Date().toISOString();
  const rows = [["Practice name", practiceName], ["City", city], ["Website", websiteUrl], ["Email", email], ["Score", scoreText], ["Platform", cms || ""]];
  if (error) rows.push(["Scan result", error]);
  const jobs = [
    sendEmail({ subject: `Website audit run: ${practiceName || websiteUrl} (${scoreText})`, heading: "Dental website audit run on /audit", rows, replyTo: email || undefined, footer: `Submitted: ${submittedAt}` }),
    sendWebhook({ source: "kindsupplydigital.com/audit", kind: "audit", submittedAt, practiceName, city, websiteUrl, email, score: scoreText, platform: cms || "" }),
  ];
  // Give delivery a few seconds at most; the scan result never waits on it longer.
  await Promise.race([deliver("audit", jobs), new Promise((r) => setTimeout(r, 4000))]).catch(() => {});
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const input = req.method === "GET" ? req.query || {} : readBody(req);
  if (!input) return res.status(400).json({ error: "Invalid request." });
  if (clean(input.company_site)) return res.status(200).json({ ok: false, error: "Scan unavailable." });

  const ip = clientIp(req);
  if (limited(ip)) return res.status(429).json({ error: "Too many scans from this network. Please try again in a few minutes." });

  const practiceName = clean(input.practiceName).slice(0, 160);
  const city = clean(input.city).slice(0, 120);
  let email = clean(input.email).slice(0, 200);
  if (email && !EMAIL_RE.test(email)) email = "";
  const norm = normalizeUrl(typeof input.websiteUrl === "string" ? input.websiteUrl.slice(0, 300) : "");
  if (norm.error) return res.status(400).json({ error: norm.error });
  const websiteUrl = norm.url.href;
  const started = Date.now();

  let page;
  try {
    page = await fetchSite(norm.url);
  } catch (err) {
    const reason = err?.message === "blocked-host" ? "That address isn't a public website."
      : err?.name === "TimeoutError" || err?.name === "AbortError" ? "The site took longer than 8 seconds to respond. That alone is costing it visitors."
        : "We couldn't reach that website. Check the address and try again.";
    if (err?.message !== "blocked-host") await notify({ practiceName, city, websiteUrl, email, scoreText: "not scanned", ip, error: reason });
    return res.status(200).json({ ok: false, error: reason, websiteUrl });
  }
  if (page.status >= 400 || !/html|^$/i.test(page.contentType) || page.html.length < 200) {
    const reason = `The site answered with ${page.status >= 400 ? `an error (HTTP ${page.status})` : "something other than a web page"}, so there was nothing to inspect. Some sites block automated checks.`;
    await notify({ practiceName, city, websiteUrl, email, scoreText: "not scanned", ip, error: reason });
    return res.status(200).json({ ok: false, error: reason, websiteUrl });
  }

  const analysis = analyze(page, city, practiceName);
  let speed;
  try {
    speed = await pageSpeed(page.finalUrl.href);
  } catch (err) {
    console.error("audit: PageSpeed unavailable:", err?.message);
    speed = estimateSpeed(page, analysis.cms);
  }
  const result = score(analysis, speed, page);
  const scoreText = `${result.score.toFixed(1)} / 10 — ${result.verdict.short}`;

  await notify({ practiceName, city, websiteUrl, email, scoreText, cms: analysis.cms, ip });

  // Copy to the practice, only when a verified sending domain is configured
  // (Resend's shared test sender can't deliver to outside addresses).
  let emailedCopy = false;
  if (email && process.env.RESEND_API_KEY && process.env.INTAKE_FROM_EMAIL) {
    emailedCopy = await sendEmail({
      to: email,
      subject: `Your website audit: ${scoreText}`,
      heading: `Website & Local Rank Readiness: ${scoreText}`,
      rows: [
        ["Practice", practiceName],
        ["Website", page.finalUrl.href],
        ["Verdict", result.verdict.label],
        ...result.categories.flatMap((c) => c.checks.filter((k) => k.status !== "info").map((k) => [`${k.status === "pass" ? "Pass" : k.status === "warn" ? "Warning" : "Fail"}: ${k.label}`, k.detail])),
      ],
      footer: "Sent because this address was entered on kindsupplydigital.com/audit. Kind Supply Digital · partnerships@kindsupplydigital.com",
    }).then(Boolean).catch((e) => (console.error("audit: copy email failed:", e?.message), false));
  }

  return res.status(200).json({
    ok: true,
    practiceName,
    city,
    websiteUrl,
    finalUrl: page.finalUrl.href,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    scoreText,
    emailedCopy,
    ...result,
    cms: analysis.cms,
    speed: { source: speed.source, performance: speed.performance, seo: speed.seo, lcpSeconds: speed.lcpSeconds, ttfbMs: page.ttfbMs, htmlKb: Math.round(page.bytes / 1024) },
    meta: { title: analysis.title, description: analysis.description, h1: analysis.h1s.filter(Boolean).slice(0, 3), schemaTypes: analysis.schema.types.slice(0, 12), booking: analysis.bookingVendor, trackers: analysis.trackers.map((t) => t.name) },
    summary: rankSummary(result, analysis),
  });
}
