import { useEffect, useId, useState } from "react";
import { ArrowRight, Check, Link2, Printer, Star } from "lucide-react";
import { LeadGate } from "../components/funnel/LeadGate";
import { SEOHead, SITE } from "../components/SEOHead";
import { BOOK_CALL_URL } from "../components/dental/dentalConfig";
import { CREAM, Eyebrow, GOLD_ON_CREAM, INTER, PLAYFAIR, body, buttonText, cleanText, display, focusScope, ghostButton, goldButton, inputClass, labelClass, labelStyle, useQueryParams } from "../components/funnel/ui";

const PAGE_URL = `${SITE}/map-gap`;
const NAVY = "#0f172a";

type State = {
  practice: string; reviews: number; rating: number;
  comp: string; compReviews: number; compRating: number;
  top3: boolean; searches: number; share: number; conv: number; value: number;
};

/*
 * Assumptions behind the "patients lost" estimate. All four are editable on the
 * page and travel in the link; none is a measurement of the practice.
 */
const DEFAULTS: State = {
  practice: "", reviews: 48, rating: 4.4,
  comp: "", compReviews: 312, compRating: 4.9,
  top3: false,
  searches: 1000, // local "dentist near me"-type searches a month in the practice's area
  share: 40, // % of those searchers who pick a practice from the Map Pack
  conv: 6, // % of Map Pack clicks/calls that become a booked new patient
  value: 1200, // first-year value of a new patient, $
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const num = (v: string | null, fallback: number, lo: number, hi: number, decimals = 0) => {
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const f = 10 ** decimals;
  return clamp(Math.round(n * f) / f, lo, hi);
};

function parse(p: URLSearchParams): State {
  return {
    practice: cleanText(p.get("practice"), 60),
    reviews: num(p.get("reviews"), DEFAULTS.reviews, 0, 50000),
    rating: num(p.get("rating"), DEFAULTS.rating, 1, 5, 1),
    comp: cleanText(p.get("comp"), 60),
    compReviews: num(p.get("comp_reviews"), DEFAULTS.compReviews, 0, 50000),
    compRating: num(p.get("comp_rating"), DEFAULTS.compRating, 1, 5, 1),
    top3: p.get("top3") === "1",
    searches: num(p.get("searches"), DEFAULTS.searches, 50, 50000),
    share: num(p.get("share"), DEFAULTS.share, 5, 80),
    conv: num(p.get("conv"), DEFAULTS.conv, 1, 30),
    value: num(p.get("value"), DEFAULTS.value, 100, 10000),
  };
}

function toQuery(s: State) {
  const q = new URLSearchParams();
  if (s.practice) q.set("practice", s.practice);
  q.set("reviews", String(s.reviews));
  q.set("rating", String(s.rating));
  if (s.comp) q.set("comp", s.comp);
  q.set("comp_reviews", String(s.compReviews));
  q.set("comp_rating", String(s.compRating));
  if (s.top3) q.set("top3", "1");
  (["searches", "share", "conv", "value"] as const).forEach((k) => s[k] !== DEFAULTS[k] && q.set(k, String(s[k])));
  return q;
}

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Stars({ rating, dark = false }: { rating: number; dark?: boolean }) {
  return (
    <span className="relative inline-block align-middle" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <span className={`flex gap-0.5 ${dark ? "text-white/20" : "text-[#0f172a]/15"}`}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} fill="currentColor" strokeWidth={0} />)}</span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-[#caa34e]" style={{ width: `${(rating / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} fill="currentColor" strokeWidth={0} className="shrink-0" />)}
      </span>
    </span>
  );
}

const PLAN = [
  { days: "Days 1–30", title: "Fix the foundation", items: ["Google Business Profile rebuilt: categories, services, hours, photos, booking link", "Review requests go out by text after every completed visit", "Site speed, Dentist schema and city-specific title tags corrected"] },
  { days: "Days 31–60", title: "Close the review gap", items: ["Steady weekly reviews, with a reply posted to every one", "Service pages built for the searches that bring new patients (emergency, implants, cosmetic)", "Name, address and phone made consistent across the main directories"] },
  { days: "Days 61–90", title: "Hold the position", items: ["Weekly Google Business Profile posts and fresh photos", "Rank tracking across your service area, reported in plain numbers", "Missed-call text-back so Map Pack calls don't ring out"] },
];

export function MapGapPage() {
  const uid = useId();
  const params = useQueryParams();
  const [s, setS] = useState<State>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    if (!params) return;
    setS(parse(params));
    setToday(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    setReady(true);
  }, [params]);

  // Keep the address bar in step so the page can be shared or printed as-is.
  useEffect(() => {
    if (!ready) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${toQuery(s).toString()}`);
  }, [s, ready]);

  const set = <K extends keyof State>(key: K, value: State[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const you = s.practice || "Your practice";
  const them = s.comp || "#1 local competitor";

  const reviewGap = Math.max(0, s.compReviews - s.reviews);
  const multiple = s.reviews > 0 ? s.compReviews / s.reviews : null;
  const ratingGap = Math.round((s.compRating - s.rating) * 10) / 10;
  const perWeek = Math.ceil(reviewGap / 13);
  const lost = s.top3 ? 0 : Math.round(s.searches * (s.share / 100) * (1 / 3) * (s.conv / 100));
  const lostValue = lost * s.value;
  const maxReviews = Math.max(s.reviews, s.compReviews, 1);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  };

  const numField = (key: keyof State, label: string, props: { min: number; max: number; step?: number }) => (
    <div>
      <label htmlFor={`${uid}-${key}`} className={labelClass} style={labelStyle}>{label}</label>
      <input id={`${uid}-${key}`} type="number" inputMode="decimal" className={inputClass} style={body("1rem")} {...props} value={s[key] as number}
        onChange={(e) => set(key, clamp(Number(e.target.value) || 0, 0, props.max) as never)}
        onBlur={(e) => set(key, clamp(Number(e.target.value) || props.min, props.min, props.max) as never)} />
    </div>
  );
  const textField = (key: "practice" | "comp", label: string, placeholder: string) => (
    <div>
      <label htmlFor={`${uid}-${key}`} className={labelClass} style={labelStyle}>{label}</label>
      <input id={`${uid}-${key}`} className={inputClass} style={body("1rem")} maxLength={60} placeholder={placeholder} value={s[key]} onChange={(e) => set(key, e.target.value.replace(/[<>{}]/g, ""))} />
    </div>
  );

  const card = (label: string, name: string, reviews: number, rating: number, mine: boolean) => (
    <div className={`p-5 sm:p-6 border ${mine ? "border-[#0f172a]/25 bg-white" : "border-[#0f172a] bg-[#0f172a] text-white"}`}>
      <p className="uppercase mb-2" style={{ fontFamily: INTER, fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.2em", color: mine ? GOLD_ON_CREAM : "#dcc07b" }}>{label}</p>
      <p className="break-words" style={{ fontFamily: PLAYFAIR, fontSize: "1.5rem", lineHeight: 1.2 }}>{name}</p>
      <p className="mt-5 tabular-nums" style={{ fontFamily: INTER, fontSize: "2.6rem", fontWeight: 600, lineHeight: 1 }}>{reviews.toLocaleString("en-US")}</p>
      <p className={mine ? "text-[#0f172a]/65" : "text-white/65"} style={body("0.85rem")}>Google reviews</p>
      <div className="h-2.5 mt-3" style={{ background: mine ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.15)" }} aria-hidden="true">
        <div className="h-full" style={{ width: `${Math.max(2, (reviews / maxReviews) * 100)}%`, background: "#caa34e" }} />
      </div>
      <p className="mt-5 flex items-center gap-2.5">
        <span className="tabular-nums" style={{ fontFamily: INTER, fontSize: "1.4rem", fontWeight: 600 }}>{rating.toFixed(1)}</span>
        <Stars rating={rating} dark={!mine} />
      </p>
    </div>
  );

  return (
    <div className={focusScope}>
      <SEOHead
        title="Local Map Pack Competitor Snapshot | Kind Supply Digital"
        description="Side-by-side Google review comparison between a dental practice and its top local competitor, with an estimate of patients lost outside the Map Pack Top 3."
        canonical={PAGE_URL}
        noIndex
      />

      <LeadGate
        tool="map-gap"
        title="See how far behind the #1 practice on the map you are"
        text="Enter your practice name and work email to open your Map Pack snapshot."
        cta="Open my snapshot"
        details={() => ({ competitor: s.comp, reviews: s.reviews, rating: s.rating, compReviews: s.compReviews, compRating: s.compRating })}
        onUnlock={(l) => !s.practice && set("practice", l.practiceName)}
      >
      {/* ============ CONTROLS (not printed) ============ */}
      <section className="no-print border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="gap-controls">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12">
          <Eyebrow>Local Map Pack Snapshot</Eyebrow>
          <h1 id="gap-controls" className="text-white max-w-3xl" style={display("clamp(1.9rem, 4.4vw, 2.9rem)")}>How far behind the #1 practice on the map are you?</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {textField("practice", "Your practice", "Maple Avenue Dental")}
            {numField("reviews", "Your Google reviews", { min: 0, max: 50000 })}
            {numField("rating", "Your rating", { min: 1, max: 5, step: 0.1 })}
            {textField("comp", "#1 local competitor", "Competitor name")}
            {numField("compReviews", "Their Google reviews", { min: 0, max: 50000 })}
            {numField("compRating", "Their rating", { min: 1, max: 5, step: 0.1 })}
          </div>
          <label className="inline-flex items-center gap-2.5 mt-5 min-h-[44px] text-white/70 cursor-pointer" style={body("0.9rem")}>
            <input type="checkbox" className="w-4 h-4 accent-[#caa34e]" checked={s.top3} onChange={(e) => set("top3", e.target.checked)} />
            This practice already shows in the Map Pack Top 3
          </label>
          <div className="flex flex-wrap gap-3 mt-5">
            <button type="button" onClick={() => window.print()} className={goldButton} style={buttonText}><Printer size={16} aria-hidden="true" /> Print / Save as PDF</button>
            <button type="button" onClick={copy} className={ghostButton} style={buttonText}><Link2 size={16} aria-hidden="true" /> {copied ? "Link copied" : "Copy link to this snapshot"}</button>
          </div>
        </div>
      </section>

      {/* ============ REPORT (printed) ============ */}
      <section className="print-sheet text-[#0f172a] py-10 sm:py-14" style={{ background: CREAM }} aria-labelledby="gap-report">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#0f172a]/20">
            <div>
              <p className="uppercase mb-3" style={{ fontFamily: INTER, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.24em", color: GOLD_ON_CREAM }}>Local Map Pack Competitor Snapshot</p>
              <h2 id="gap-report" style={display("clamp(1.7rem, 3.8vw, 2.5rem)")}>{you} <span className="text-[#0f172a]/45">vs.</span> {them}</h2>
            </div>
            <p className="text-[#0f172a]/60" style={body("0.82rem")}>Kind Supply Digital{today ? ` · ${today}` : ""}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 print-avoid-break">
            {card("Your practice", you, s.reviews, s.rating, true)}
            {card("#1 on the map", them, s.compReviews, s.compRating, false)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 print-avoid-break">
            {[
              [reviewGap.toLocaleString("en-US"), reviewGap > 0 ? `review gap${multiple && multiple >= 1.5 ? `: they have ${multiple.toFixed(1)}× your reviews` : ""}` : "review gap: you're level or ahead"],
              [ratingGap > 0 ? `−${ratingGap.toFixed(1)}` : ratingGap < 0 ? `+${Math.abs(ratingGap).toFixed(1)}` : "0.0", ratingGap > 0 ? "stars behind on rating" : "stars vs. their rating"],
              [reviewGap > 0 ? `${perWeek}/wk` : "—", reviewGap > 0 ? "new reviews a week to match them in 90 days (if they stand still)" : "no catch-up needed on review count"],
            ].map(([big, small]) => (
              <div key={small} className="border border-[#0f172a]/20 p-5">
                <p className="tabular-nums" style={{ fontFamily: INTER, fontSize: "1.9rem", fontWeight: 600, lineHeight: 1.1 }}>{big}</p>
                <p className="text-[#0f172a]/70 mt-1.5" style={body("0.86rem", 1.5)}>{small}</p>
              </div>
            ))}
          </div>

          {/* ---- Patients lost ---- */}
          <div className="mt-8 border-2 border-[#0f172a] p-6 sm:p-8 print-avoid-break">
            <p className="uppercase mb-3" style={{ fontFamily: INTER, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", color: GOLD_ON_CREAM }}>Estimated cost of sitting outside the Top 3</p>
            {s.top3 ? (
              <p style={body("1.05rem")}>
                {you} already shows in the Map Pack Top 3, so this estimate is zero. The risk runs the other way: a competitor with {reviewGap > 0 ? "more" : "faster-growing"} reviews can take the spot.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                <div>
                  <p className="tabular-nums" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(3rem, 9vw, 4.6rem)", lineHeight: 1 }}>~{lost}</p>
                  <p className="mt-2" style={body("1.02rem", 1.5)}>new patients a month going to the three practices on the map instead of {you}</p>
                </div>
                <div className="sm:text-right">
                  <p className="tabular-nums" style={{ fontFamily: INTER, fontSize: "1.9rem", fontWeight: 600 }}>{usd(lostValue)}</p>
                  <p className="text-[#0f172a]/70" style={body("0.9rem", 1.5)}>in first-year patient value, every month</p>
                </div>
              </div>
            )}
            <p className="text-[#0f172a]/65 mt-5 pt-4 border-t border-[#0f172a]/15" style={body("0.8rem", 1.6)}>
              How it's worked out: {s.searches.toLocaleString("en-US")} local dental searches a month × {s.share}% who choose from the Map Pack × a one-in-three share of those clicks × {s.conv}% who book × {usd(s.value)} per new patient. These are planning assumptions, not measurements of your practice. Review counts and ratings are as entered.
            </p>
          </div>

          {/* ---- Assumption controls (not printed) ---- */}
          {!s.top3 && (
            <div className="no-print mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 [&_input]:bg-white [&_input]:text-[#0f172a] [&_input]:border-[#0f172a]/25 [&_label]:text-[#0f172a]/70">
              {numField("searches", "Local searches / mo", { min: 50, max: 50000, step: 50 })}
              {numField("share", "Map Pack share %", { min: 5, max: 80 })}
              {numField("conv", "Booking rate %", { min: 1, max: 30 })}
              {numField("value", "Patient value $", { min: 100, max: 10000, step: 50 })}
            </div>
          )}

          {/* ---- 90-day fix ---- */}
          <div className="mt-12">
            <h3 style={display("clamp(1.5rem, 3vw, 2rem)")}>Our 90-day fix</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {PLAN.map((p) => (
                <div key={p.days} className="bg-white border border-[#0f172a]/15 p-5 print-avoid-break">
                  <p className="uppercase" style={{ fontFamily: INTER, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.2em", color: GOLD_ON_CREAM }}>{p.days}</p>
                  <p className="mt-2 mb-4" style={{ fontFamily: PLAYFAIR, fontSize: "1.25rem" }}>{p.title}</p>
                  <ul className="flex flex-col gap-2.5">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[#0f172a]/80" style={body("0.86rem", 1.5)}>
                        <Check size={15} className="shrink-0 mt-0.5" style={{ color: GOLD_ON_CREAM }} aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-[#0f172a]/60 mt-4" style={body("0.8rem", 1.6)}>
              Google decides Map Pack positions; no agency can promise a rank. This is the work that closes the gap shown above.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#0f172a]/20 flex flex-wrap items-center justify-between gap-5 print-avoid-break">
            <p style={body("0.95rem")}>
              <strong>Kind Supply Digital</strong> &middot; kindsupplydigital.com &middot; partnerships@kindsupplydigital.com
            </p>
            <div className="no-print flex flex-wrap gap-3">
              <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 min-h-[52px] px-6 text-white hover:bg-[#1e293b] transition-colors group" style={{ ...buttonText, background: NAVY }}>
                Book 15 minutes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
              <a href={`/audit${s.practice ? `?practice=${encodeURIComponent(s.practice)}` : ""}`} className="inline-flex items-center min-h-[52px] px-5 border border-[#0f172a]/40 hover:border-[#0f172a] transition-colors" style={buttonText}>
                Scan your website free
              </a>
            </div>
          </div>
        </div>
      </section>
      </LeadGate>
    </div>
  );
}
