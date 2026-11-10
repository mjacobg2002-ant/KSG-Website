// Vercel Function: POST /api/dental-intake
//
// Receives the two forms on /dental-marketing:
//   kind "enrollment"  -> request to enroll in the Complete Dental Growth Package
//   kind "assessment"  -> request for a written practice growth assessment
//
// Delivery (configure at least one in Vercel → Project → Settings → Environment
// Variables; until then this returns 503 and the page offers a pre-filled
// email instead):
//   RESEND_API_KEY       Resend API key — emails each request
//   INTAKE_TO_EMAIL      recipient (default marcel.grisard@kindsupplyco.org)
//   INTAKE_FROM_EMAIL    sender on a domain verified in Resend
//                        (default "Kind Supply Digital <onboarding@resend.dev>",
//                        which Resend only delivers to the account owner)
//   INTAKE_WEBHOOK_URL   optional: also POST the JSON to a CRM inbound webhook
//                        (e.g. a GoHighLevel workflow "Inbound Webhook" trigger)
//
// Spam protection: honeypot field, minimum time-on-form, strict field
// validation and length limits, and a best-effort per-IP rate limit.
// No protected health information is requested; free text is length-capped.

const DEFAULT_TO = "marcel.grisard@kindsupplyco.org";
const DEFAULT_FROM = "Kind Supply Digital <onboarding@resend.dev>";
const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes per IP (per instance)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SCHEMAS = {
  enrollment: {
    label: "Enrollment request — Complete Dental Growth Package",
    fields: {
      practiceName: { label: "Practice name", required: true, max: 160 },
      contactName: { label: "Contact name", required: true, max: 120 },
      email: { label: "Business email", required: true, max: 200, email: true },
      practiceStatus: { label: "Practice status", required: true, oneOf: ["Existing practice", "Opening soon"] },
      location: { label: "Location to be covered", required: true, max: 240 },
      website: { label: "Current website", max: 200 },
      locations: { label: "Total locations", required: true, oneOf: ["1", "2", "3 or more"] },
      notes: { label: "Notes", max: 800 },
    },
  },
  assessment: {
    label: "Written Practice Growth Assessment request",
    fields: {
      practiceName: { label: "Practice name", required: true, max: 160 },
      website: { label: "Website", max: 200 },
      city: { label: "City", required: true, max: 100 },
      state: { label: "State", required: true, max: 2, pattern: /^[A-Z]{2}$/ },
      email: { label: "Business email", required: true, max: 200, email: true },
      practiceStatus: { label: "Practice status", required: true, oneOf: ["Existing practice", "Opening soon"] },
      concern: {
        label: "Main marketing concern",
        required: true,
        oneOf: [
          "Not enough new patients",
          "Not showing up in local Google searches",
          "Google Ads cost too much for the results",
          "Website is outdated or hard to book from",
          "Preparing to open a new practice",
          "Something else",
        ],
      },
    },
  },
};

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const clean = (v) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function validate(kind, input) {
  const schema = SCHEMAS[kind];
  if (!schema) return { error: "Unknown form." };
  const out = {};
  for (const [name, rule] of Object.entries(schema.fields)) {
    const value = clean(input?.[name]);
    if (rule.required && !value) return { error: `Missing ${rule.label}.` };
    if (!value) {
      out[name] = "";
      continue;
    }
    if (rule.max && value.length > rule.max) return { error: `${rule.label} is too long.` };
    if (rule.email && !EMAIL_RE.test(value)) return { error: "Invalid email address." };
    if (rule.oneOf && !rule.oneOf.includes(value)) return { error: `Invalid ${rule.label}.` };
    if (rule.pattern && !rule.pattern.test(value)) return { error: `Invalid ${rule.label}.` };
    out[name] = value;
  }
  return { data: out, schema };
}

async function sendEmail({ schema, data, kind, page, submittedAt }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const rows = Object.entries(schema.fields)
    .map(
      ([name, rule]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;vertical-align:top;white-space:nowrap">${esc(rule.label)}</td><td style="padding:8px 0;color:#0f172a;font-size:15px;white-space:pre-wrap">${esc(data[name] || "—")}</td></tr>`
    )
    .join("");
  const subjectName = data.practiceName ? ` — ${data.practiceName}` : "";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: process.env.INTAKE_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.INTAKE_TO_EMAIL || DEFAULT_TO],
      reply_to: data.email,
      subject: `${schema.label}${subjectName}`.slice(0, 200),
      html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:620px"><h2 style="font-weight:500;color:#0f172a">${esc(schema.label)}</h2><table style="border-collapse:collapse">${rows}</table><p style="color:#64748b;font-size:12px;margin-top:24px">Form: ${esc(kind)} · Page: ${esc(page || "/dental-marketing")} · Submitted: ${esc(submittedAt)}</p></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return true;
}

async function sendWebhook(payload) {
  const url = process.env.INTAKE_WEBHOOK_URL;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid request." });
    }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid request." });

  // Bots: accept silently so they get no signal, but deliver nothing.
  if (clean(body.company_site)) return res.status(200).json({ ok: true });
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) return res.status(200).json({ ok: true });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Too many requests. Please try again later." });

  const kind = clean(body.kind);
  const { data, schema, error } = validate(kind, body.fields);
  if (error) return res.status(400).json({ error });

  const submittedAt = new Date().toISOString();
  const page = clean(body.page).slice(0, 120);
  const payload = { source: "kindsupplydigital.com/dental-marketing", kind, formLabel: schema.label, submittedAt, ...data };

  if (!process.env.RESEND_API_KEY && !process.env.INTAKE_WEBHOOK_URL) {
    console.error("dental-intake: no delivery configured (set RESEND_API_KEY or INTAKE_WEBHOOK_URL)");
    return res.status(503).json({ error: "Form delivery is not configured." });
  }

  const results = await Promise.allSettled([
    sendEmail({ schema, data, kind, page, submittedAt }),
    sendWebhook(payload),
  ]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  results.forEach((r) => r.status === "rejected" && console.error("dental-intake delivery failed:", r.reason?.message));

  if (!delivered) return res.status(502).json({ error: "We couldn't deliver your request." });
  return res.status(200).json({ ok: true });
}
