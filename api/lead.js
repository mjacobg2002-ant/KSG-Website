// Vercel Function: POST /api/lead
//
// Small lead forms on the dental funnel pages:
//   kind "test-text"  -> /demo-call: "Send a Real Test Text to My Phone"
//   kind "waitlist"   -> TerritoryChecker: waitlist for a claimed ZIP
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

const KINDS = {
  "test-text": (f) => {
    const practiceName = clean(f.practiceName).slice(0, 160);
    const phoneE164 = toE164(clean(f.phone));
    if (!practiceName) return { error: "Please enter your practice name." };
    if (!phoneE164) return { error: "Please enter a 10-digit US cell number." };
    return {
      label: "Lead Rescue demo: live test text requested",
      data: { practiceName, phoneE164, consent: "Agreed on the form to receive one demo text at this number" },
      rows: [["Practice name", practiceName], ["Cell phone", phoneE164], ["Consent", "Agreed to receive one demo text"]],
      extraWebhook: process.env.DEMO_TEXT_WEBHOOK_URL,
    };
  },
  waitlist: (f) => {
    const zip = clean(f.zip);
    const email = clean(f.email).slice(0, 200);
    const practiceName = clean(f.practiceName).slice(0, 160);
    if (!/^\d{5}$/.test(zip)) return { error: "Invalid ZIP code." };
    if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
    return {
      label: `Territory waitlist: ${zip}`,
      data: { zip, email, practiceName },
      rows: [["ZIP", zip], ["Email", email], ["Practice name", practiceName]],
      replyTo: email,
    };
  },
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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
