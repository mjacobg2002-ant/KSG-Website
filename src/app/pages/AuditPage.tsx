import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, ArrowRight, Check, Info, Loader2, X } from "lucide-react";
import { SEOHead, SITE } from "../components/SEOHead";
import { BOOK_CALL_URL } from "../components/dental/dentalConfig";
import { Eyebrow, INTER, PLAYFAIR, body, buttonText, cleanText, display, focusScope, goldButton, inputClass, labelClass, labelStyle, leadError, loadSavedLead, saveLead, useQueryParams } from "../components/funnel/ui";

const PAGE_URL = `${SITE}/audit`;
const AUDIT_ENDPOINT = "/api/audit";

type Status = "pass" | "warn" | "fail" | "info";
type CheckItem = { id: string; label: string; status: Status; detail: string };
type Deduction = { id: string; label: string; points: number; max: number };
type Report = {
  ok: true;
  practiceName: string; city: string; websiteUrl: string; finalUrl: string; scoreText: string; emailedCopy: boolean;
  score: number;
  verdict: { tone: "red" | "amber" | "teal" | "green"; short: string; label: string };
  deductions: Deduction[];
  categories: { id: string; title: string; checks: CheckItem[] }[];
  cms: string;
  speed: { source: "psi" | "estimate"; performance: number; seo: number | null; lcpSeconds: number | null; ttfbMs: number; htmlKb: number };
  summary: string;
};

const STEPS = ["Checking SSL & Mobile Speed…", "Inspecting Metadata & Dental Schema…", "Scanning Tracking Scripts & Conversion Paths…", "Waiting on Google's mobile speed test…"];

const TONE = {
  red: { color: "#e0655e", bg: "bg-[#2a1719]", border: "border-[#c2554f]/60", text: "text-[#f3b6b2]" },
  amber: { color: "#e0a23c", bg: "bg-[#2a2113]", border: "border-[#e0a23c]/60", text: "text-[#f1cf94]" },
  teal: { color: "#4fb3bf", bg: "bg-[#11262b]", border: "border-[#4fb3bf]/60", text: "text-[#a8dde4]" },
  green: { color: "#5fae78", bg: "bg-[#13261c]", border: "border-[#4f9a66]/60", text: "text-[#b5e0bf]" },
} as const;

const STATUS_UI: Record<Status, { icon: typeof Check; label: string; cls: string; ring: string }> = {
  pass: { icon: Check, label: "Pass", cls: "bg-[#4f9a66] text-[#0f172a]", ring: "border-[#4f9a66]/35" },
  warn: { icon: AlertTriangle, label: "Warning", cls: "bg-[#e0a23c] text-[#0f172a]", ring: "border-[#e0a23c]/40" },
  fail: { icon: X, label: "Fail", cls: "bg-[#c2554f] text-white", ring: "border-[#c2554f]/50" },
  info: { icon: Info, label: "Note", cls: "bg-white/15 text-white", ring: "border-white/12" },
};

function Gauge({ score, color }: { score: number; color: string }) {
  const r = 78;
  const arc = Math.PI * r; // half circle
  return (
    <div className="relative w-[200px] shrink-0 self-center sm:self-auto" role="img" aria-label={`Score ${score.toFixed(1)} out of 10`}>
      <svg viewBox="0 0 200 112" className="w-full h-auto" aria-hidden="true">
        <path d="M 22 100 A 78 78 0 0 1 178 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 22 100 A 78 78 0 0 1 178 100" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={arc} strokeDashoffset={arc * (1 - score / 10)} style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }} />
      </svg>
      <p className="absolute inset-x-0 bottom-0 text-center text-white tabular-nums whitespace-nowrap" style={{ fontFamily: INTER, lineHeight: 1 }}>
        <span style={{ fontSize: "2.6rem", fontWeight: 600 }}>{score.toFixed(1)}</span>
        <span className="text-white/45" style={{ fontSize: "1.1rem", fontWeight: 500 }}> / 10</span>
      </p>
    </div>
  );
}

export function AuditPage() {
  const uid = useId();
  const params = useQueryParams();
  const [form, setForm] = useState({ practiceName: "", city: "", websiteUrl: "", email: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!params) return;
    const saved = loadSavedLead();
    setForm((f) => ({
      ...f,
      practiceName: cleanText(params.get("practice"), 160) || f.practiceName || saved.practiceName,
      city: cleanText(params.get("city"), 120) || f.city,
      websiteUrl: cleanText(params.get("url"), 300) || f.websiteUrl,
      email: cleanText(params.get("email"), 200) || f.email || saved.email,
    }));
  }, [params]);

  useEffect(() => {
    if (state !== "loading") return;
    setStep(0);
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2600);
    return () => window.clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state === "done" || state === "error") resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state]);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const run = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const missing = leadError(form.practiceName, form.email) || (!form.city.trim() || !form.websiteUrl.trim() ? "Please fill in your city and website." : "");
    if (missing) {
      setState("error");
      setError(missing);
      return;
    }
    saveLead({ practiceName: form.practiceName.trim(), email: form.email.trim() });
    setState("loading");
    setReport(null);
    const honeypot = (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch(AUDIT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, company_site: honeypot }) });
      const data = (await res.json().catch(() => null)) as (Report | { ok?: false; error?: string }) | null;
      if (data && data.ok === true) {
        setReport(data);
        setState("done");
      } else {
        setError(data?.error || "The scan couldn't finish. Please try again in a moment.");
        setState("error");
      }
    } catch {
      setError("The scan couldn't finish. Check your connection and try again.");
      setState("error");
    }
  };

  const name = report?.practiceName || form.practiceName.trim() || "Your Practice";
  const tone = report ? TONE[report.verdict.tone] : TONE.amber;
  const startHref = `/start?practice=${encodeURIComponent(name)}`;

  const upgradeBox = (sticky: boolean) => (
    <aside className={`border border-blue-400/40 bg-[#131d32] p-6 ${sticky ? "lg:sticky lg:top-28" : ""}`} aria-label="Next step">
      <p className="text-white" style={{ fontFamily: PLAYFAIR, fontSize: "1.5rem", lineHeight: 1.25 }}>
        Want every leak on {name}&rsquo;s site fixed?
      </p>
      <div className="flex flex-col gap-3 mt-6">
        <a href={startHref} className={`${goldButton} text-center py-3`} style={{ ...buttonText, lineHeight: 1.35 }}>
          Fix Every Leak + Get 3 Guaranteed Patients in 30 Days
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" aria-hidden="true" />
        </a>
      </div>
      <p className="text-white/45 mt-4" style={body("0.76rem", 1.55)}>
        Guarantee: 3 booked new patients in your first 30 days of ads, or your first payment back. Conditions apply; see the agreement.
      </p>
      <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] mt-2 text-blue-200 underline underline-offset-4" style={body("0.88rem")}>
        Or book 15 minutes to walk through this report
      </a>
    </aside>
  );

  return (
    <div className={focusScope}>
      <SEOHead
        title="Free Dental Website & Local Rank Check | Kind Supply Digital"
        description="Scan your dental practice's website in seconds: mobile speed, title and meta tags, Dentist schema, click-to-call, online booking and tracking pixels, scored 1 to 10."
        keywords="dental website audit, dental SEO check, dentist website grader, local rank check dentist, dental schema checker"
        canonical={PAGE_URL}
      />

      {/* ============ INPUT ============ */}
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="audit-title">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14 sm:pb-12">
          <Eyebrow>Free Practice Website &amp; Rank Check</Eyebrow>
          <h1 id="audit-title" className="text-white max-w-3xl" style={display("clamp(2rem, 5vw, 3.3rem)")}>Is your website leaking new patients?</h1>
          <p className="text-white/65 max-w-2xl mt-5" style={body("1.05rem")}>
            We load your live site the way Google and a patient's phone do, then score what we find from 1 to 10. Takes a few seconds.
          </p>

          <form onSubmit={run} noValidate className="mt-8 border border-white/12 bg-[#0c1525] p-5 sm:p-6">
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor={`${uid}-company_site`}>Leave this field empty</label>
              <input id={`${uid}-company_site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`${uid}-p`} className={labelClass} style={labelStyle}>Practice name</label>
                <input id={`${uid}-p`} className={inputClass} style={body("1rem")} required maxLength={160} autoComplete="organization" placeholder="Maple Avenue Dental" {...field("practiceName")} />
              </div>
              <div>
                <label htmlFor={`${uid}-c`} className={labelClass} style={labelStyle}>City &amp; state</label>
                <input id={`${uid}-c`} className={inputClass} style={body("1rem")} required maxLength={120} autoComplete="address-level2" placeholder="Vienna, VA" {...field("city")} />
              </div>
              <div>
                <label htmlFor={`${uid}-u`} className={labelClass} style={labelStyle}>Website URL</label>
                <input id={`${uid}-u`} className={inputClass} style={body("1rem")} required maxLength={300} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="yourpractice.com" {...field("websiteUrl")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mt-4 md:items-end">
              <div>
                <label htmlFor={`${uid}-e`} className={labelClass} style={labelStyle}>Work email</label>
                <input id={`${uid}-e`} className={inputClass} style={body("1rem")} type="email" required maxLength={200} autoComplete="email" placeholder="you@yourpractice.com" {...field("email")} />
              </div>
              <button type="submit" disabled={state === "loading"} className={goldButton} style={buttonText}>
                {state === "loading" ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : null}
                {state === "loading" ? "Scanning…" : "Run My Free Scan"}
                {state !== "loading" && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {state === "loading" && (
            <ol className="mt-6 flex flex-col gap-2.5" aria-live="polite">
              {STEPS.slice(0, step + 1).map((label, i) => (
                <li key={label} className="funnel-in flex items-center gap-3 text-white/80" style={body("0.95rem")}>
                  {i < step ? <Check size={16} className="text-[#7fc493]" aria-hidden="true" /> : <Loader2 size={16} className="animate-spin text-blue-300" aria-hidden="true" />}
                  {label}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <div ref={resultsRef} className="scroll-mt-24" />

      {state === "error" && (
        <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <p role="alert" className="border border-[#c2554f]/50 bg-[#2a1719] text-[#f3b6b2] p-5" style={body("1rem")}>{error}</p>
        </section>
      )}

      {/* ============ RESULTS ============ */}
      {state === "done" && report && (
        <section className="py-10 sm:py-14" aria-labelledby="result-title">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 items-start">
            <div className="min-w-0">
              <div className={`funnel-in border ${tone.border} ${tone.bg} p-6 sm:p-8`}>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-center">
                  <Gauge score={report.score} color={tone.color} />
                  <div className="min-w-0">
                    <p className={`inline-block px-3 py-1.5 border ${tone.border} ${tone.text} uppercase mb-3`} style={{ fontFamily: INTER, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em" }}>{report.verdict.short}</p>
                    <h2 id="result-title" className="text-white" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", lineHeight: 1.25 }}>{report.verdict.label}</h2>
                    <p className="text-white/60 mt-3 break-all" style={body("0.86rem")}>
                      {report.practiceName} &middot; {report.finalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>
                    <p className="text-white/80 mt-1.5" style={body("0.9rem")}>Website &amp; Local Rank Readiness Score &middot; Built on: <strong className="text-white">{report.cms}</strong></p>
                  </div>
                </div>
                <div className="mt-7 pt-6 border-t border-white/10">
                  <p className="text-white mb-2" style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600 }}>How This Impacts Your Local Google Rank</p>
                  <p className="text-white/75" style={body("0.95rem")}>{report.summary}</p>
                </div>
                {report.emailedCopy && <p className="text-white/55 mt-4" style={body("0.84rem")}>A copy of this report is on its way to your inbox.</p>}
              </div>

              <div className="lg:hidden mt-6">{upgradeBox(false)}</div>

              {report.categories.map((cat) => (
                <div key={cat.id} className="mt-10">
                  <h3 className="text-white mb-4" style={{ fontFamily: PLAYFAIR, fontSize: "1.45rem", fontWeight: 400 }}>{cat.title}</h3>
                  <ul className="flex flex-col gap-3">
                    {cat.checks.map((c) => {
                      const ui = STATUS_UI[c.status];
                      const Icon = ui.icon;
                      return (
                        <li key={c.id} className={`flex gap-4 p-4 sm:p-5 border ${ui.ring} bg-[#0c1525]`}>
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ui.cls}`}>
                            <Icon size={15} strokeWidth={2.6} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-white" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600 }}>
                              {c.label} <span className="text-white/45 uppercase ml-1" style={{ fontSize: "0.66rem", letterSpacing: "0.14em" }}>{ui.label}</span>
                            </p>
                            <p className="text-white/65 mt-1.5 break-words" style={body("0.9rem", 1.6)}>{c.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <details className="mt-10 border border-white/12 bg-[#0c1525]">
                <summary className="cursor-pointer px-5 py-4 text-white min-h-[52px] flex items-center" style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600 }}>How the {report.score.toFixed(1)} was calculated</summary>
                <div className="px-5 pb-5">
                  <table className="w-full text-left" style={body("0.88rem", 1.5)}>
                    <tbody>
                      <tr className="border-t border-white/10"><td className="py-2.5 text-white/75">Starting score</td><td className="py-2.5 text-right text-white tabular-nums">10.0</td></tr>
                      {report.deductions.map((d) => (
                        <tr key={d.id} className="border-t border-white/10">
                          <td className="py-2.5 pr-4 text-white/75">{d.label} <span className="text-white/35">(up to −{d.max.toFixed(1)})</span></td>
                          <td className={`py-2.5 text-right tabular-nums ${d.points ? "text-[#f3b6b2]" : "text-[#a9d7b0]"}`}>{d.points ? `−${d.points.toFixed(1)}` : "0.0"}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-white/25"><td className="py-2.5 text-white font-semibold">Score (minimum 1.0)</td><td className="py-2.5 text-right text-white font-semibold tabular-nums">{report.score.toFixed(1)}</td></tr>
                    </tbody>
                  </table>
                  <p className="text-white/45 mt-4" style={body("0.78rem", 1.6)}>
                    {report.speed.source === "psi" ? "Mobile speed is from Google PageSpeed Insights." : "Google PageSpeed Insights didn't answer in time, so mobile speed is an estimate from server response and page weight."} Everything else is read from the homepage's live source code at the moment of the scan. Content added by scripts after the page loads may not be seen. This is an automated check, not legal or compliance advice.
                  </p>
                </div>
              </details>

              <div className="mt-10">{upgradeBox(false)}</div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-28">{upgradeBox(false)}</div>
          </div>
        </section>
      )}

      {/* ============ WHAT WE CHECK ============ */}
      {state !== "done" && (
        <section className="py-12 sm:py-16" aria-labelledby="checks-title">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 id="checks-title" className="text-white mb-8" style={display("clamp(1.5rem, 3vw, 2rem)")}>What the scan looks at</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Local search & metadata", "Title tag, meta description, main heading and Dentist schema: the signals Google reads to place you in the Map Pack."],
                ["Speed & mobile experience", "Google's own mobile speed score, load time, HTTPS and phone layout."],
                ["Conversion & lead capture", "Tap-to-call in the header and whether patients can book online without waiting for a callback."],
                ["HIPAA & pixel privacy", "Advertising pixels sitting on the same pages as your patient forms."],
              ].map(([t, d]) => (
                <div key={t} className="border border-white/10 bg-[#0c1525] p-5">
                  <p className="text-white mb-2" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600 }}>{t}</p>
                  <p className="text-white/60" style={body("0.88rem", 1.6)}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
