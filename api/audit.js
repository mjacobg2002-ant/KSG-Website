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
  let blocks = 0;
  let invalid = 0;
  const re = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  const walk = (node, depth = 0) => {
    if (!node || depth > 8) return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, depth + 1));
    if (typeof node !== "object") return;
    const t = node["@type"];
    (Array.isArray(t) ? t : [t]).forEach((x) => typeof x === "string" && types.add(x.replace(/^https?:\/\/schema\.org\//, "")));
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
  return { types: [...types], blocks, invalid };
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
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: AbortSignal.timeout(PSI_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`PSI ${res.status}`);
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

/** Rough stand-in when PSI is unavailable. Always labeled as an estimate in the UI. */
export function estimateSpeed(page) {
  let s = 88;
  if (page.ttfbMs > 2500) s -= 40;
  else if (page.ttfbMs > 1200) s -= 26;
  else if (page.ttfbMs > 600) s -= 12;
  if (page.bytes > 800_000) s -= 18;
  else if (page.bytes > 300_000) s -= 9;
  const scripts = (page.html.match(/<script\b/gi) || []).length;
  if (scripts > 50) s -= 18;
  else if (scripts > 25) s -= 9;
  return { source: "estimate", performance: Math.max(20, Math.min(90, s)), seo: null, lcpSeconds: null, scripts };
}

/* ------------------------------------------------------------------ */
/* Analysis                                                             */
/* ------------------------------------------------------------------ */
export function analyze(page, city) {
  const html = page.html;
  const lower = html.toLowerCase();
  const metas = tags(html, "meta");
  const links = tags(html, "link");
  const anchors = tags(html, "a");
  const meta = (key) => metas.find((m) => (m.name || m.property || "").toLowerCase() === key)?.content?.trim() || "";

  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const description = meta("description");
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  const canonical = links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "";
  const ogTitle = meta("og:title");
  const ogImage = meta("og:image");
  const viewport = meta("viewport");
  const schema = schemaTypes(html);

  const cityName = clean(city).split(",")[0].trim().toLowerCase();
  const titleHasDental = DENTAL_WORDS.test(title);
  const titleHasCity = cityName.length > 1 && title.toLowerCase().includes(cityName);

  // Click-to-call: is a tel: link in the header/nav, or at least near the top of the page?
  const telCount = anchors.filter((a) => /^tel:/i.test(a.href || "")).length;
  const bodyStart = Math.max(0, lower.indexOf("<body"));
  const headerHtml = [...html.matchAll(/<(header|nav)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]).join(" ");
  const topSlice = html.slice(bodyStart, bodyStart + Math.max(6000, Math.round((html.length - bodyStart) * 0.3)));
  const telInHeader = /href\s*=\s*["']?tel:/i.test(headerHtml) || /href\s*=\s*["']?tel:/i.test(topSlice);

  // Online booking: a real scheduling widget vs. a link to a request form.
  const bookingVendor = BOOKING_VENDORS.find(([, re]) => re.test(html))?.[0] || "";
  const bookingLink = anchors.some((a) => /\/(book|booking|appointments?|schedule|scheduling|request-an?-appointment)\b/i.test(a.href || "")) ||
    /(book|schedule|request)\s+(an?\s+)?(appointment|online|now|a visit)/i.test(text(html.slice(bodyStart)).slice(0, 60000));
  const hasForm = /<form\b/i.test(html);

  const trackers = TRACKERS.filter(([, , re]) => re.test(html)).map(([id, name, , ad]) => ({ id, name, ad }));
  const adTrackers = trackers.filter((t) => t.ad);
  const patientFacing = hasForm || Boolean(bookingVendor) || bookingLink;

  return {
    title, description, h1s, canonical, ogTitle, ogImage, viewport, schema, titleHasDental, titleHasCity, cityName,
    telCount, telInHeader, bookingVendor, bookingLink, hasForm, trackers, adTrackers, patientFacing,
    viewportOk: /width\s*=\s*device-width/i.test(viewport),
    cms: detectCms(html, page),
  };
}

const LOCAL_TYPES = ["Dentist", "DentalClinic", "MedicalBusiness", "MedicalClinic", "LocalBusiness", "Physician", "MedicalOrganization"];

export function score(a, speed, page) {
  const deductions = [];
  const cut = (id, label, points, max) => deductions.push({ id, label, points, max });
  const checks = { local: [], speed: [], conversion: [], privacy: [] };
  const add = (group, id, label, status, detail) => checks[group].push({ id, label, status, detail });

  /* --- Mobile page speed: up to -2.5 --- */
  const p = speed.performance;
  const speedCut = p < 50 ? 2.5 : p < 75 ? 1.5 : p < 90 ? 0.5 : 0;
  cut("speed", `Mobile page speed (${p}/100${speed.source === "estimate" ? ", estimated" : ""})`, speedCut, 2.5);
  add("speed", "pagespeed", "Mobile performance score", p >= 90 ? "pass" : p >= 50 ? "warn" : "fail",
    speed.source === "psi"
      ? `Google PageSpeed Insights scored the mobile site ${p}/100.${speed.seo !== null ? ` Google's SEO audit: ${speed.seo}/100.` : ""}`
      : `Google PageSpeed Insights didn't respond in time, so this is an estimate (${p}/100) from server response time (${page.ttfbMs} ms) and page weight (${Math.round(page.bytes / 1024)} KB of HTML, ${speed.scripts} scripts). Run it again for the measured score.`);
  if (speed.lcpSeconds !== null) {
    add("speed", "lcp", "Largest Contentful Paint (LCP)", speed.lcpSeconds <= 2.5 ? "pass" : speed.lcpSeconds <= 4 ? "warn" : "fail",
      `The main content takes ${speed.lcpSeconds}s to appear on a phone. Google's "good" threshold is 2.5s.`);
  }

  /* --- Title + meta description: up to -2.0 --- */
  const tLen = a.title.length;
  let titleCut = 0;
  let titleStatus = "pass";
  let titleDetail = `"${a.title}" (${tLen} characters).`;
  if (!a.title) {
    titleCut = 1; titleStatus = "fail"; titleDetail = "No <title> tag found. This is the headline Google shows in search results.";
  } else if (!a.titleHasDental && !a.titleHasCity) {
    titleCut = 1; titleStatus = "fail"; titleDetail += " It names neither a dental keyword nor your city, so Google has little to match against local searches.";
  } else if (!a.titleHasDental || !a.titleHasCity) {
    titleCut = 0.5; titleStatus = "warn"; titleDetail += a.titleHasCity ? " It names your city but no dental keyword (dentist, dental)." : ` It has a dental keyword but doesn't name ${a.cityName ? titleCase(a.cityName) : "your city"}.`;
  } else if (tLen < 30 || tLen > 65) {
    titleStatus = "warn"; titleDetail += " It has the right keywords, but the ideal length is 30–65 characters so it isn't cut off.";
  } else {
    titleDetail += " Names the city and a dental keyword at a good length.";
  }
  cut("title", "Title tag local optimization", titleCut, 1);
  add("local", "title", "Title tag", titleStatus, titleDetail);

  const dLen = a.description.length;
  const descCut = !a.description ? 1 : dLen < 70 || dLen > 160 ? 0.5 : 0;
  cut("description", "Meta description", descCut, 1);
  add("local", "description", "Meta description", !a.description ? "fail" : descCut ? "warn" : "pass",
    !a.description ? "No meta description. Google will pull a random line of page text into your search listing."
      : `${dLen} characters${descCut ? " (ideal is 70–160)" : ""}: "${a.description.slice(0, 170)}${dLen > 170 ? "…" : ""}"`);

  const h1Count = a.h1s.filter(Boolean).length;
  add("local", "h1", "Main heading (H1)", h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : h1Count <= 3 ? "warn" : "fail",
    h1Count === 0 ? "No H1 heading with text. Google uses it to confirm what the page is about."
      : h1Count === 1 ? `One H1: "${a.h1s.find(Boolean).slice(0, 120)}"` : `${h1Count} H1 headings on one page. One clear main heading reads better to Google.`);

  /* --- Local schema: -1.5 --- */
  const localTypes = a.schema.types.filter((t) => LOCAL_TYPES.includes(t));
  const orgOnly = !localTypes.length && a.schema.types.includes("Organization");
  const schemaCut = localTypes.length || orgOnly ? 0 : 1.5;
  cut("schema", "Local dental schema (JSON-LD)", schemaCut, 1.5);
  add("local", "schema", "Local dental schema (JSON-LD)", localTypes.length ? "pass" : orgOnly ? "warn" : "fail",
    localTypes.length ? `Found ${localTypes.join(", ")} schema.${localTypes.includes("Dentist") ? "" : " Dentist is the most specific type for a dental practice."}`
      : orgOnly ? "Only generic Organization schema found. Dentist or LocalBusiness schema states your address, hours and services directly."
        : "Missing Local Search Schema (Hurts Google Map Pack & AI Search Visibility). No Dentist, MedicalBusiness, LocalBusiness or Organization markup found.");

  const social = [a.canonical && "canonical", a.ogTitle && "og:title", a.ogImage && "og:image"].filter(Boolean);
  add("local", "social", "Canonical & Open Graph tags", social.length === 3 ? "pass" : social.length ? "warn" : "fail",
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
  const baseOk = page.httpsOk && a.viewportOk;
  cut("basics", "HTTPS and mobile viewport", baseOk ? 0 : 1, 1);
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
  if (pixelRisk || a.trackers.length) {
    add("privacy", "tracker-list", "Trackers found in the source", "info", names(a.trackers));
  }

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

  const analysis = analyze(page, city);
  let speed;
  try {
    speed = await pageSpeed(page.finalUrl.href);
  } catch (err) {
    console.error("audit: PageSpeed unavailable:", err?.message);
    speed = estimateSpeed(page);
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
