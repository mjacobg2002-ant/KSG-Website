/*
 * Shared type scale, form styles and helpers for the dental funnel pages
 * (/audit, /demo-call, /map-gap, /start, /portal/:slug). Same families and
 * scale as /dental-marketing and /dental-roi.
 */
import { useEffect, useState, type ReactNode } from "react";

export const INTER = "'Inter', sans-serif";
export const PLAYFAIR = "'Playfair Display', serif";
export const CREAM = "#f4f0e7";
/** Gold dark enough for text on cream (5.4:1). */
export const GOLD_ON_CREAM = "#7a5c26";
export const LEADS_EMAIL = "partnerships@kindsupplydigital.com";
export const LEAD_ENDPOINT = "/api/lead";

export const eyebrowStyle = { fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" } as const;
export const display = (size: string) =>
  ({ fontFamily: PLAYFAIR, fontSize: size, fontWeight: 400, lineHeight: 1.14, letterSpacing: "-0.02em" }) as const;
export const body = (size = "1rem", lh = 1.7) => ({ fontFamily: INTER, fontSize: size, lineHeight: lh }) as const;

export function Eyebrow({ children, onCream = false }: { children: ReactNode; onCream?: boolean }) {
  return (
    <p className={`uppercase mb-5 ${onCream ? "" : "text-blue-300/80"}`} style={{ ...eyebrowStyle, color: onCream ? GOLD_ON_CREAM : undefined }}>
      {children}
    </p>
  );
}

/** Focus rings for every link and control inside a funnel page. */
export const focusScope =
  "[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-blue-300 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-blue-300";

export const goldButton =
  "inline-flex items-center justify-center gap-3 min-h-[52px] px-6 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group";
export const ghostButton =
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-5 border border-white/20 text-white/85 hover:border-blue-400/60 hover:text-white transition-colors";
export const buttonText = { fontFamily: INTER, fontSize: "0.92rem", fontWeight: 600, letterSpacing: "0.02em" } as const;

export const inputClass =
  "w-full min-h-[50px] px-4 bg-[#0a1120] border border-white/15 text-white placeholder:text-white/30 focus:border-blue-400 focus:outline-none transition-colors";
export const labelClass = "block text-white/75 mb-2";
export const labelStyle = { fontFamily: INTER, fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.03em" } as const;

/** Query params, read after mount so the prerendered HTML and first client render match. */
export function useQueryParams(): URLSearchParams | null {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => setParams(new URLSearchParams(window.location.search)), []);
  return params;
}

export const cleanText = (v: string | null | undefined, max = 80) =>
  (v ?? "").replace(/[<>{}\u0000-\u001F]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

export type LeadResult = { ok: true } | { ok: false; unconfigured: boolean; message: string };

/** POSTs a small lead form to /api/lead. `startedAt` feeds the server's time-on-form check. */
export async function postLead(kind: string, fields: Record<string, string>, startedAt: number, honeypot = ""): Promise<LeadResult> {
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, fields, page: window.location.pathname, company_site: honeypot, elapsedMs: Date.now() - startedAt }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, unconfigured: res.status === 503 || res.status >= 500, message: data.error || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, unconfigured: true, message: "We couldn't reach the server." };
  }
}

export const mailto = (subject: string, lines: string[]) =>
  `mailto:${LEADS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
