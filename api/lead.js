// Vercel Function: POST /api/lead
//
// Small lead forms on the dental funnel pages:
//   kind "test-text"  -> /demo-call: "Send a Real Test Text to My Phone"
//   kind "waitlist"   -> TerritoryChecker: waitlist for a claimed ZIP
//   kind "tool"       -> any dental tool opened (practice name + work email gate)
//
// GET /api/lead returns which delivery channels are configured (booleans only).
//
// Delivery: see api/_lib/deliver.js. For "test-text" you can also set
//   DEMO_TEXT_WEBHOOK_URL  an inbound webhook (e.g. a GoHighLevel workflow) that
//                          sends the live Lead Rescue demo text to `phoneE164`.
// Until at least one delivery is configured this returns 503 and the page
// falls back to a pre-filled email.

import { EMAIL_RE, clean, clientIp, deliver, deliveryConfigured, rateLimiter, readBody, sendEmail, sendWebhook } from "./_lib/deliver.js";

const MIN_FILL_MS = 1500;
const limited = rateLimiter(6, 10 * 60 * 1000);

function toE164(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const TOOLS = {
  "demo-call": "Missed-Call Simulator",
  "dental-roi": "Patient Leak & ROI Calculator",
  "map-gap": "Map Pack Competitor Snapshot",
  territory: "Territory Availability Check",
};

/** Practice name + email are required on every dental tool form. */
function contact(f) {
  const practiceName = clean(f.practiceName).slice(0, 160);
  const email = clean(f.email).slice(0, 200);
  if (!practiceName) return { error: "Please enter your practice name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid work email." };
  return { practiceName, email };
}

function parseDetails(raw) {
  try {
    const obj = JSON.parse(clean(raw).slice(0, 4000) || "{}");
    return Object.entries(obj).slice(0, 25).map(([k, v]) => [clean(k).slice(0, 40), clean(String(v)).slice(0, 300)]).filter(([k, v]) => k && v);
  } catch {
    return [];
  }
}

const KINDS = {
  "test-text": (f) => {
    const c = contact(f);
    if (c.error) return c;
    const phoneE164 = toE164(clean(f.phone));
    if (!phoneE164) return { error: "Please enter a 10-digit US cell number." };
    return {
      label: "Lead Rescue demo: live test text requested",
      data: { ...c, phoneE164, consent: "Agreed on the form to receive one demo text at this number" },
      rows: [["Practice name", c.practiceName], ["Email", c.email], ["Cell phone", phoneE164], ["Consent", "Agreed to receive one demo text"]],
      replyTo: c.email,
      extraWebhook: process.env.DEMO_TEXT_WEBHOOK_URL,
    };
  },
  waitlist: (f) => {
    const c = contact(f);
    if (c.error) return c;
    const zip = clean(f.zip);
    if (!/^\d{5}$/.test(zip)) return { error: "Invalid ZIP code." };
    return {
      label: `Territory waitlist: ${zip}`,
      data: { zip, ...c },
      rows: [["ZIP", zip], ["Practice name", c.practiceName], ["Email", c.email]],
      replyTo: c.email,
    };
  },
  tool: (f) => {
    const c = contact(f);
    if (c.error) return c;
    const tool = clean(f.tool);
    if (!TOOLS[tool]) return { error: "Unknown tool." };
    const details = parseDetails(f.details);
    return {
      label: `Dental tool used: ${TOOLS[tool]}`,
      data: { tool, ...c, details: Object.fromEntries(details) },
      rows: [["Tool", TOOLS[tool]], ["Practice name", c.practiceName], ["Email", c.email], ...details],
      replyTo: c.email,
    };
  },
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method === "GET") {
    return res.status(200).json({
      delivery: {
        email: Boolean(process.env.RESEND_API_KEY),
        verifiedSender: Boolean(process.env.INTAKE_FROM_EMAIL),
        webhook: Boolean(process.env.LEADS_WEBHOOK_URL || process.env.INTAKE_WEBHOOK_URL),
        demoTextWebhook: Boolean(process.env.DEMO_TEXT_WEBHOOK_URL),
        pagespeedKey: Boolean(process.env.PAGESPEED_API_KEY),
      },
    });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const body = readBody(req);
  if (!body) return res.status(400).json({ error: "Invalid request." });

  // Bots: accept silently, deliver nothing.
  if (clean(body.company_site)) return res.status(200).json({ ok: true });
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) return res.status(200).json({ ok: true });
  if (limited(clientIp(req))) return res.status(429).json({ error: "Too many requests. Please try again later." });

  const build = KINDS[clean(body.kind)];
  if (!build) return res.status(400).json({ error: "Unknown form." });
  const lead = build(body.fields || {});
  if (lead.error) return res.status(400).json({ error: lead.error });

  if (!deliveryConfigured(lead.extraWebhook)) {
    console.error("lead: no delivery configured (set RESEND_API_KEY, LEADS_WEBHOOK_URL or DEMO_TEXT_WEBHOOK_URL)");
    return res.status(503).json({ error: "Form delivery is not configured." });
  }

  const submittedAt = new Date().toISOString();
  const page = clean(body.page).slice(0, 120);
  const payload = { source: `kindsupplydigital.com${page || ""}`, kind: clean(body.kind), formLabel: lead.label, submittedAt, ...lead.data };
  const delivered = await deliver("lead", [
    sendEmail({
      subject: `${lead.label}${lead.data.practiceName ? ` — ${lead.data.practiceName}` : ""}`,
      heading: lead.label,
      rows: lead.rows,
      replyTo: lead.replyTo,
      footer: `Page: ${page || "?"} · Submitted: ${submittedAt}`,
    }),
    sendWebhook(payload),
    lead.extraWebhook ? sendWebhook(payload, lead.extraWebhook) : null,
  ]);
  if (!delivered) return res.status(502).json({ error: "We couldn't deliver your request." });
  return res.status(200).json({ ok: true });
}
