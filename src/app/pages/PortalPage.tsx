import { useEffect, useId, useState, type FormEvent } from "react";
import { useParams } from "react-router";
import { ArrowUpRight, CalendarCheck, Check, FileText, Globe, Lock, MessageSquare, MousePointerClick, PhoneCall, ShieldCheck, type LucideIcon } from "lucide-react";
import { SEOHead, SITE } from "../components/SEOHead";
import { GUARANTEE } from "../components/dental/dentalConfig";
import { portalClients, type PortalClient, type PortalStage, type StageStatus } from "../data/portal";
import { Eyebrow, INTER, LEADS_EMAIL, PLAYFAIR, body, buttonText, display, focusScope, goldButton, inputClass, labelClass, labelStyle } from "../components/funnel/ui";

const DAY = 86_400_000;
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Resolves a config date ("YYYY-MM-DD", or daysAgo for the demo) against today. */
function resolveDate(now: Date, date?: string, daysAgo?: number): Date | null {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  if (typeof daysAgo === "number") return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
  return null;
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const STATUS_LABEL: Record<StageStatus, string> = { complete: "Complete", "in-progress": "In progress", upcoming: "Up next" };

function Gate({ client, onUnlock }: { client: PortalClient; onUnlock: () => void }) {
  const uid = useId();
  const [code, setCode] = useState("");
  const [bad, setBad] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if ((await sha256(code.trim())) === client.accessCodeSha256?.toLowerCase()) {
      try {
        window.sessionStorage.setItem(`portal:${client.slug}`, "1");
      } catch {
        /* storage unavailable: unlock for this view only */
      }
      onUnlock();
    } else setBad(true);
  };
  return (
    <section className="max-w-md mx-auto px-5 py-24">
      <Lock size={26} className="text-blue-300 mb-6" aria-hidden="true" />
      <h1 className="text-white" style={display("2rem")}>{client.practiceName}</h1>
      <p className="text-white/60 mt-3 mb-8" style={body("0.98rem")}>Enter the access code from your launch email to view your status page.</p>
      <form onSubmit={submit}>
        <label htmlFor={`${uid}-code`} className={labelClass} style={labelStyle}>Access code</label>
        <input id={`${uid}-code`} type="password" autoComplete="off" className={inputClass} style={body("1rem")} value={code} onChange={(e) => (setCode(e.target.value), setBad(false))} aria-invalid={bad} />
        {bad && <p role="alert" className="text-[#f0a8a4] mt-2" style={body("0.86rem")}>That code doesn't match. Check your launch email or reply to it and we'll resend.</p>}
        <button type="submit" className={`${goldButton} mt-5 w-full`} style={buttonText}>View my status</button>
      </form>
    </section>
  );
}

export function PortalPage() {
  const { slug = "" } = useParams();
  const client = portalClients[slug];
  const [now, setNow] = useState<Date | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setNow(new Date());
    try {
      if (window.sessionStorage.getItem(`portal:${slug}`) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, [slug]);

  const head = (
    <SEOHead
      title={client ? `${client.practiceName}: Launch & Guarantee Tracker | Kind Supply Digital` : "Client Portal | Kind Supply Digital"}
      description="Client launch status and first-month new-patient guarantee tracker."
      canonical={`${SITE}/portal/${slug}`}
      noIndex
    />
  );

  if (!client) {
    return (
      <section className="max-w-xl mx-auto px-5 py-28 text-center">
        {head}
        <h1 className="text-white" style={display("2rem")}>We couldn't find that status page</h1>
        <p className="text-white/60 mt-4" style={body()}>
          Check the link in your launch email, or write to <a className="underline underline-offset-4 text-blue-200" href={`mailto:${LEADS_EMAIL}`}>{LEADS_EMAIL}</a>.
        </p>
      </section>
    );
  }
  if (client.accessCodeSha256 && !unlocked) {
    return (
      <div className={focusScope}>
        {head}
        <Gate client={client} onUnlock={() => setUnlocked(true)} />
      </div>
    );
  }

  /* ---- Guarantee window ---- */
  const g = client.guarantee;
  const target = g.target ?? GUARANTEE.bookedNewPatients;
  const windowDays = g.windowDays ?? GUARANTEE.periodDays;
  const adsLive = now ? resolveDate(now, g.adsLiveDate, g.adsLiveDaysAgo) : null;
  const windowEnd = adsLive ? new Date(adsLive.getTime() + windowDays * DAY) : null;
  const dayOf = now && adsLive ? Math.floor((now.getTime() - adsLive.getTime()) / DAY) + 1 : 0;
  const booked = now
    ? g.bookedPatients
        .map((b) => ({ ...b, when: resolveDate(now, b.date, b.daysAgo) }))
        .filter((b) => !adsLive || !b.when || !windowEnd || (b.when >= adsLive && b.when <= windowEnd))
        .sort((a, b) => (a.when?.getTime() ?? 0) - (b.when?.getTime() ?? 0))
    : [];
  const count = booked.length;
  const met = count >= target;
  const windowOver = Boolean(adsLive) && dayOf > windowDays;
  const windowState: "waiting" | "active" | "met" | "ended" = !adsLive ? "waiting" : met ? "met" : windowOver ? "ended" : "active";
  const daysLeft = Math.max(0, windowDays - dayOf + 1);

  const windowStage: PortalStage = {
    status: windowState === "waiting" ? "upcoming" : windowState === "active" ? "in-progress" : "complete",
    note:
      windowState === "waiting" ? "Starts the day your Google Ads go live."
        : windowState === "active" ? `Day ${Math.min(dayOf, windowDays)} of ${windowDays}. ${count} of ${target} booked new patients so far.`
          : windowState === "met" ? `Guarantee met: ${count} booked new patients inside the window.`
            : `Window closed with ${count} of ${target} booked new patients. Your first payment is refunded under Section 17.`,
  };

  const stages: { key: string; title: string; icon: LucideIcon; stage: PortalStage; when: Date | null }[] = [
    { key: "leadRescue", title: "Lead Rescue Text-Back", icon: MessageSquare, stage: client.stages.leadRescue, when: now ? resolveDate(now, client.stages.leadRescue.date, client.stages.leadRescue.daysAgo) : null },
    { key: "websiteBuild", title: "Website Build", icon: Globe, stage: client.stages.websiteBuild, when: now ? resolveDate(now, client.stages.websiteBuild.date, client.stages.websiteBuild.daysAgo) : null },
    { key: "googleAds", title: "Google Ads Live", icon: MousePointerClick, stage: client.stages.googleAds, when: now ? resolveDate(now, client.stages.googleAds.date, client.stages.googleAds.daysAgo) : null },
    { key: "guarantee", title: "Guarantee Window Active", icon: ShieldCheck, stage: windowStage, when: adsLive },
  ];
  const doneCount = stages.filter((s) => s.stage.status === "complete").length;

  const links: { label: string; hint: string; href?: string; icon: LucideIcon }[] = [
    { label: "Your live site", hint: "Open the website patients see", href: client.links.liveSite, icon: Globe },
    { label: "Call logs", hint: "Every tracked call and text-back", href: client.links.callLogs, icon: PhoneCall },
    { label: "Section 17 agreement", hint: "The guarantee terms, in full", href: client.links.agreement, icon: FileText },
  ];

  return (
    <div className={focusScope}>
      {head}
      {client.demo && (
        <p className="bg-blue-500 text-[#0f172a] text-center px-4 py-2.5" style={{ fontFamily: INTER, fontSize: "0.82rem", fontWeight: 600 }}>
          Sample portal with example data. Every client gets a private page like this one.
        </p>
      )}

      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="portal-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-9 sm:pt-14">
          <Eyebrow>Client Launch &amp; Guarantee Tracker</Eyebrow>
          <h1 id="portal-title" className="text-white" style={display("clamp(2rem, 5vw, 3.1rem)")}>{client.practiceName}</h1>
          <p className="text-white/60 mt-3" style={body("0.98rem")}>
            {client.city ?? ""}{now ? `${client.city ? " · " : ""}${doneCount} of ${stages.length} launch stages complete · as of ${fmt(now)}` : ""}
          </p>
        </div>
      </section>

      {now && (<>
      {/* ============ ONBOARDING TRACKER ============ */}
      <section className="py-10 sm:py-14" aria-labelledby="stages-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 id="stages-title" className="text-white mb-7" style={{ fontFamily: PLAYFAIR, fontSize: "1.6rem", fontWeight: 400 }}>Launch progress</h2>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {stages.map((s, i) => {
              const st = s.stage.status;
              const Icon = s.icon;
              return (
                <li key={s.key} aria-current={st === "in-progress" ? "step" : undefined} className={`relative p-5 border ${st === "complete" ? "border-[#4f9a66]/45 bg-[#13261c]" : st === "in-progress" ? "border-blue-400/60 bg-[#1a1f2b]" : "border-white/10 bg-[#0c1525]"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center ${st === "complete" ? "bg-[#4f9a66] text-[#0f172a]" : st === "in-progress" ? "bg-blue-500 text-[#0f172a]" : "border border-white/20 text-white/40"}`}>
                      {st === "complete" ? <Check size={17} strokeWidth={3} aria-hidden="true" /> : <Icon size={16} aria-hidden="true" />}
                    </span>
                    <span className="text-white/40 tabular-nums" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 600 }}>{i + 1} / {stages.length}</span>
                  </div>
                  <p className="text-white" style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 }}>{s.title}</p>
                  <p className={`uppercase mt-1.5 ${st === "complete" ? "text-[#a9d7b0]" : st === "in-progress" ? "text-blue-300" : "text-white/40"}`} style={{ fontFamily: INTER, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.14em" }}>
                    {STATUS_LABEL[st]}{s.when && st !== "upcoming" ? ` · ${fmt(s.when)}` : ""}
                  </p>
                  {s.stage.note && <p className="text-white/60 mt-3" style={body("0.84rem", 1.55)}>{s.stage.note}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============ GUARANTEE METER ============ */}
      <section className="py-10 sm:py-14 bg-[#0c1525] border-y border-white/8" aria-labelledby="meter-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <div>
            <Eyebrow>{target}-New-Patient Guarantee</Eyebrow>
            <h2 id="meter-title" className="text-white" style={display("clamp(1.7rem, 3.6vw, 2.4rem)")}>
              {windowState === "waiting" ? "Your 30-day window hasn't started yet"
                : windowState === "met" ? `Guarantee met: ${count} booked new patients`
                  : windowState === "ended" ? `Window closed at ${count} of ${target}`
                    : `${count} of ${target} booked new patients`}
            </h2>

            <div className="flex gap-3 mt-8" role="img" aria-label={`${Math.min(count, target)} of ${target} guaranteed new patients booked`}>
              {Array.from({ length: target }, (_, i) => {
                const filled = i < count;
                return (
                  <div key={i} className={`flex-1 h-24 sm:h-28 flex flex-col items-center justify-center gap-2 border-2 transition-colors ${filled ? "border-[#4f9a66] bg-[#4f9a66]/15" : "border-dashed border-white/20"}`}>
                    {filled ? <CalendarCheck size={26} className="text-[#a9d7b0]" aria-hidden="true" /> : <span className="text-white/25" style={{ fontFamily: PLAYFAIR, fontSize: "1.8rem" }}>{i + 1}</span>}
                    <span className={filled ? "text-[#a9d7b0]" : "text-white/35"} style={{ fontFamily: INTER, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em" }}>{filled ? "BOOKED" : "OPEN"}</span>
                  </div>
                );
              })}
            </div>
            {count > target && <p className="text-[#a9d7b0] mt-3" style={body("0.9rem")}>+{count - target} more beyond the guarantee.</p>}

            {adsLive && windowEnd && (
              <div className="mt-8">
                <div className="flex justify-between text-white/60 mb-2" style={body("0.82rem")}>
                  <span>Ads live {fmt(adsLive)}</span>
                  <span>Window ends {fmt(windowEnd)}</span>
                </div>
                <div className="h-2.5 bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={windowDays} aria-valuenow={Math.min(dayOf, windowDays)} aria-label="Days elapsed in the guarantee window">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (dayOf / windowDays) * 100)}%` }} />
                </div>
                <p className="text-white/75 mt-3" style={body("0.92rem")}>
                  {windowState === "active" ? `Day ${dayOf} of ${windowDays}: ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left to log ${target - count} more.`
                    : windowState === "met" ? "The guarantee is satisfied. From here the meter keeps counting every booked new patient."
                      : "The window has closed. We'll be in touch about the refund; you don't need to request it."}
                </p>
              </div>
            )}
            {!adsLive && <p className="text-white/65 mt-6" style={body("0.95rem")}>The {windowDays} days begin the day your Google Ads start running. We'll update this page that morning.</p>}
          </div>

          <div>
            <h3 className="text-white mb-4" style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600 }}>Booked new patients logged</h3>
            {booked.length === 0 ? (
              <p className="border border-dashed border-white/15 text-white/45 p-5" style={body("0.9rem")}>None logged yet. Each booked new patient appears here with the date and where it came from.</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {booked.map((b, i) => (
                  <li key={i} className="flex items-center gap-4 border border-white/10 bg-[#0f172a] px-4 py-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#4f9a66] text-[#0f172a] flex items-center justify-center shrink-0 tabular-nums" style={{ fontFamily: INTER, fontSize: "0.8rem", fontWeight: 700 }}>{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-white" style={{ fontFamily: INTER, fontSize: "0.92rem", fontWeight: 500 }}>{b.source || "Booked new patient"}</span>
                      <span className="block text-white/50" style={{ fontFamily: INTER, fontSize: "0.78rem" }}>{b.when ? fmt(b.when) : "Date pending"}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="text-white/40 mt-4" style={body("0.78rem", 1.6)}>
              A booked patient is a new patient who schedules by phone from the ads or after clicking through to your site. No patient names or details are shown here.
            </p>
          </div>
        </div>
      </section>

      </>)}

      {/* ============ QUICK LINKS ============ */}
      <section className="py-10 sm:py-14" aria-labelledby="links-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 id="links-title" className="text-white mb-6" style={{ fontFamily: PLAYFAIR, fontSize: "1.6rem", fontWeight: 400 }}>Quick links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {links.map(({ label, hint, href, icon: Icon }) =>
              href ? (
                <a key={label} href={href} {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-start gap-4 p-5 border border-white/12 bg-[#0c1525] hover:border-blue-400/60 transition-colors min-h-[88px]">
                  <Icon size={20} className="text-blue-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block text-white" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600 }}>{label}</span>
                    <span className="block text-white/55 mt-1" style={body("0.82rem", 1.4)}>{hint}</span>
                  </span>
                  <ArrowUpRight size={16} className="text-white/40 group-hover:text-blue-300 transition-colors" aria-hidden="true" />
                </a>
              ) : (
                <div key={label} className="flex items-start gap-4 p-5 border border-dashed border-white/12 min-h-[88px]">
                  <Icon size={20} className="text-white/30 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="block text-white/60" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600 }}>{label}</span>
                    <span className="block text-white/40 mt-1" style={body("0.82rem", 1.4)}>Not connected yet</span>
                  </span>
                </div>
              )
            )}
          </div>
          <p className="text-white/55 mt-8" style={body("0.9rem")}>
            Questions about anything on this page? <a className="underline underline-offset-4 text-blue-200" href={`mailto:${LEADS_EMAIL}`}>{LEADS_EMAIL}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
