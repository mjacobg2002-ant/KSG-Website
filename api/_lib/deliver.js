// Shared delivery helpers for the funnel endpoints (api/lead.js, api/audit.js).
// Files under api/_lib are not exposed as routes.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      Resend API key; emails each lead
//   LEADS_TO_EMAIL      recipient (default partnerships@kindsupplydigital.com)
//   INTAKE_FROM_EMAIL   sender on a domain verified in Resend (shared with dental-intake)
//   LEADS_WEBHOOK_URL   optional CRM inbound webhook (falls back to INTAKE_WEBHOOK_URL)

export const DEFAULT_TO = "partnerships@kindsupplydigital.com";
const DEFAULT_FROM = "Kind Supply Digital <onboarding@resend.dev>";

export const clean = (v) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function rateLimiter(limit, windowMs) {
  const hits = new Map();
  return (ip) => {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > limit;
  };
}

export const clientIp = (req) => String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";

export function readBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body && typeof body === "object" ? body : null;
}

export const deliveryConfigured = (extraWebhook) =>
  Boolean(process.env.RESEND_API_KEY || process.env.LEADS_WEBHOOK_URL || process.env.INTAKE_WEBHOOK_URL || extraWebhook);

const withTimeout = (ms) => AbortSignal.timeout(ms);

/** rows: [label, value][] */
export async function sendEmail({ subject, heading, rows, replyTo, footer, to }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:8px 0;color:#0f172a;font-size:15px;white-space:pre-wrap">${esc(value || "—")}</td></tr>`
    )
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: withTimeout(6000),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: process.env.INTAKE_FROM_EMAIL || DEFAULT_FROM,
      to: [to || process.env.LEADS_TO_EMAIL || DEFAULT_TO],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: String(subject).slice(0, 200),
      html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:620px"><h2 style="font-weight:500;color:#0f172a">${esc(heading || subject)}</h2><table style="border-collapse:collapse">${table}</table><p style="color:#64748b;font-size:12px;margin-top:24px">${esc(footer || "")}</p></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return true;
}

export async function sendWebhook(payload, url = process.env.LEADS_WEBHOOK_URL || process.env.INTAKE_WEBHOOK_URL) {
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    signal: withTimeout(6000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return true;
}

/** Runs every delivery, logs failures, and reports whether at least one landed. */
export async function deliver(tag, jobs) {
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error(`${tag} delivery failed:`, r.reason?.message));
  return results.some((r) => r.status === "fulfilled" && r.value === true);
}
