import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Check, ChevronDown, Link2, PhoneMissed, MousePointerClick, ShieldCheck } from "lucide-react";
import { LeadGate } from "../components/funnel/LeadGate";
import { SEOHead, SITE } from "../components/SEOHead";
import { RangeField } from "../components/dental/RoiControls";
import { AGREEMENT_PATH, BOOK_CALL_URL, GUARANTEE, PACKAGE, STANDALONE, usd } from "../components/dental/dentalConfig";
import {
  DEFAULT_INPUTS,
  LIMITS,
  MAX_PRACTICE_LENGTH,
  ROI,
  ROI_PATH,
  cleanPractice,
  compute,
  parseRoiParams,
  present,
  roiContactHref,
  roiQuery,
  type Basis,
  type RoiInputs,
} from "../components/dental/roiMath";

/* ------------------------------------------------------------------ */
/* Type system: same families and scale as /dental-marketing           */
/* ------------------------------------------------------------------ */
const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";
const CREAM = "#f4f0e7";
const GOLD_ON_CREAM = "#7a5c26";

const eyebrowStyle = { fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" } as const;
const display = (size: string) => ({ fontFamily: PLAYFAIR, fontSize: size, fontWeight: 400, lineHeight: 1.14, letterSpacing: "-0.02em" }) as const;
const body = (size = "1rem", lh = 1.7) => ({ fontFamily: INTER, fontSize: size, lineHeight: lh }) as const;
const capsLabel = { fontFamily: INTER, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" } as const;

const PAGE_URL = `${SITE}${ROI_PATH}`;
const pct = (n: number) => `${n.toFixed(1)}%`;
const patients = (n: number) => n.toFixed(1);
const signed = (n: number) => `${n < 0 ? "−" : "+"}${usd(Math.abs(n))}`;

/* ------------------------------------------------------------------ */
/* Methodology: one row per number the calculator uses                  */
/* ------------------------------------------------------------------ */
const SOURCES = {
  patientPrism: {
    label: "Patient Prism, The Dental Patient Access Report (July 2026)",
    href: "https://www.patientprism.com/report/dental-patient-access-report/",
  },
  peerlogic: {
    label: "Peerlogic, analysis of 4,280 calls across 26 practices (February 2026)",
    href: "https://www.peerlogic.com/post/peerlogic-dso-case-study",
  },
  pankey: {
    label: "The Pankey Institute, citing Patient Prism benchmarks (August 2026)",
    href: "https://pankey.org/the-phone-is-still-the-dental-practices-most-critical-patient-touchpoint/",
  },
  wordstream: {
    label: "WordStream by LocaliQ, 2026 Search Advertising Benchmarks (Dentists & Dental Services)",
    href: "https://www.wordstream.com/blog/2026-google-ads-benchmarks",
  },
  dentaltown: {
    label: "Dentaltown Magazine, “Running With the Right Clicks”",
    href: "https://www.dentaltown.com/magazine/article/8864/running-with-the-right-clicks",
  },
} as const;

type MethodRow = { name: string; value: string; kind: "Your input" | "Published benchmark" | "Planning assumption" | "From our agreement" | "Arithmetic"; note: string };

const ROI_METHOD: MethodRow[] = [
  {
    name: "Missed calls per week",
    value: "You enter it",
    kind: "Your input",
    note: "Your phone system’s missed-call report is the best source. For reference: Patient Prism’s study of 11.5 million calls to 8,280 dental locations in 2025 found 31 of every 100 callers hung up before reaching anyone, and Peerlogic’s February 2026 analysis found 38% of calls went unanswered.",
  },
  {
    name: "Weeks per month",
    value: String(ROI.WEEKS_PER_MONTH),
    kind: "Arithmetic",
    note: "52 weeks divided by 12 months, rounded to two decimals.",
  },
  {
    name: "Voicemail callers who hang up without a message",
    value: `${ROI.VOICEMAIL_HANGUP_RATE * 100}%`,
    kind: "Published benchmark",
    note: "The Pankey Institute, citing Patient Prism benchmarks, puts this at 78%. Other published figures range from about 75% to 86%, so we use 80%.",
  },
  {
    name: "Share of missed calls from prospective new patients",
    value: `${ROI.NEW_PATIENT_CALL_SHARE * 100}%`,
    kind: "Planning assumption",
    note: "We found no published benchmark for this. The other 70% are treated as existing patients, vendors, and admin calls and are valued at zero. Your call log will give you the real share.",
  },
  {
    name: "Answered new-patient calls that book",
    value: `${ROI.FRONT_DESK_BOOK_RATE * 100}%`,
    kind: "Planning assumption",
    note: "Set between two published measurements: Peerlogic measured 25% for new-patient calls, and Patient Prism’s report shows 21 of every 34 real booking opportunities booked (about 62%).",
  },
  {
    name: "Website visitors and current booking rate",
    value: "You enter them",
    kind: "Your input",
    note: "Use your analytics and your online booking or appointment-request counts. Published figures for typical dental sites cluster around 2% to 5% of visitors taking a booking action; Dentaltown’s example uses 2.5% as typical and 5% as the mark of a solid site.",
  },
  {
    name: "Target website booking rate",
    value: `${ROI.KSG_SITE_CVR_TENTHS / 10}%, or your rate plus ${ROI.MIN_CVR_LIFT_TENTHS / 10} points if higher`,
    kind: "Planning assumption",
    note: "This is a target, not a measured average of our sites. The calculator also counts every added booking as one new patient, which is generous if some of your online requests come from existing patients or don’t schedule.",
  },
  {
    name: "Google Ads cost per lead",
    value: usd(ROI.DENTAL_ADS_CPL),
    kind: "Published benchmark",
    note: "WordStream by LocaliQ’s 2026 benchmarks report an $8.00 average cost per click, a 10.67% conversion rate, and a $72.97 cost per lead for dentists and dental services. We plan on $78, about 7% worse than that average.",
  },
  {
    name: "Paid-search leads that book",
    value: `${ROI.ADS_LEAD_BOOK_RATE * 100}%`,
    kind: "Planning assumption",
    note: "Our planning figure for leads that are answered or texted back quickly. It sits below the 50% used for answered new-patient calls.",
  },
  {
    name: "Missed callers recovered by Lead Rescue text-back",
    value: `${ROI.LEAD_RESCUE_RECOVERY_RATE * 100}%`,
    kind: "Planning assumption",
    note: "The nearest published figure we found: Peerlogic reports automated text follow-up engaged 40% of patients who missed a connection with staff. Lead Rescue is a separate add-on, and you can switch it off in the results.",
  },
  {
    name: "Average new patient value",
    value: "You enter it",
    kind: "Your input",
    note: `We found no measured public benchmark, so use your own production per new patient. The starting values (${usd(LIMITS.value.first.def)} first-year, ${usd(LIMITS.value.ltv.def)} over five years) are placeholders in the range practices commonly quote.`,
  },
  {
    name: "Monthly investment",
    value: `${usd(PACKAGE.monthly)} plus your ad budget`,
    kind: "From our agreement",
    note: `${PACKAGE.name}: ${usd(PACKAGE.monthly)} a month on a six-month agreement for one location. Ad spend is paid by you directly to Google. Any Lead Rescue fee is quoted separately and is not in this figure.`,
  },
];

const FORMULAS: [string, string][] = [
  ["Monthly missed calls", "missed calls per week × 4.33"],
  ["New patients lost to voicemail", "monthly missed calls × 80% × 30% × 50% (0.12 per missed call)"],
  ["Voicemail leak", "new patients lost to voicemail × patient value"],
  ["Website leak", "monthly visitors × (target rate − current rate) × patient value"],
  ["Patients from Google Ads", "(ad budget ÷ $78) × 45%"],
  ["Patients recovered by Lead Rescue", "new patients lost to voicemail × 45%"],
  ["Projected production", "(website + Google Ads + Lead Rescue patients) × patient value"],
  ["Net gain", "projected production − monthly investment"],
  ["Return", "projected production ÷ monthly investment"],
  ["Breakeven", "monthly investment ÷ patient value, rounded up"],
];

const KIND_TONE: Record<MethodRow["kind"], string> = {
  "Your input": "text-white/80 border-white/30",
  "Published benchmark": "text-emerald-300 border-emerald-400/40",
  "Planning assumption": "text-amber-300 border-amber-400/40",
  "From our agreement": "text-blue-300 border-blue-400/40",
  Arithmetic: "text-white/60 border-white/20",
};

function Eyebrow({ children, onCream = false }: { children: ReactNode; onCream?: boolean }) {
  return (
    <p className={`uppercase mb-5 ${onCream ? "" : "text-blue-300/80"}`} style={{ ...eyebrowStyle, color: onCream ? GOLD_ON_CREAM : undefined }}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export function DentalRoiPage() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS);
  const [practice, setPractice] = useState("");
  const [copied, setCopied] = useState(false);
  // Remember the value chosen in each mode so toggling back restores it.
  const valueByBasis = useRef<Record<Basis, number>>({ first: LIMITS.value.first.def, ltv: LIMITS.value.ltv.def });

  // Pre-filled links: read once after hydration so the static HTML (defaults)
  // and the first client render always match.
  useEffect(() => {
    const parsed = parseRoiParams(new URLSearchParams(window.location.search));
    valueByBasis.current[parsed.inputs.basis] = parsed.inputs.value;
    setInputs(parsed.inputs);
    setPractice(parsed.practice);
  }, []);

  const set = <K extends keyof RoiInputs>(key: K, v: RoiInputs[K]) => setInputs((prev) => ({ ...prev, [key]: v }));
  const setValue = (v: number) => {
    valueByBasis.current[inputs.basis] = v;
    set("value", v);
  };
  const setBasis = (basis: Basis) => {
    if (basis === inputs.basis) return;
    setInputs((prev) => ({ ...prev, basis, value: valueByBasis.current[basis] }));
  };

  const r = useMemo(() => compute(inputs), [inputs]);
  const d = useMemo(() => present(inputs, r), [inputs, r]);
  const valueRange = LIMITS.value[inputs.basis];
  const contactHref = roiContactHref(inputs, practice, d, r);
  const callShare = d.totalLeak > 0 ? (d.callLeak / d.totalLeak) * 100 : 0;

  const copyLink = async () => {
    const url = `${window.location.origin}${ROI_PATH}?${roiQuery(inputs, practice).toString()}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-blue-300 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-blue-300">
      <SEOHead
        title="Dental Patient Leak & ROI Calculator | Kind Supply Digital"
        description="Estimate how much new-patient revenue your dental practice loses each month to missed calls and website visitors who don't book, with every assumption and source listed."
        keywords="dental ROI calculator, dental marketing ROI, missed calls dental practice, dental new patient calculator, dental website conversion rate"
        canonical={PAGE_URL}
        structuredData={[
          {
            "@type": "WebApplication",
            "@id": `${PAGE_URL}#calculator`,
            name: "Dental Patient Leak & ROI Calculator",
            url: PAGE_URL,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            provider: { "@id": `${SITE}/#organization` },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Dental Marketing", item: `${SITE}/dental-marketing` },
              { "@type": "ListItem", position: 3, name: "Dental ROI Calculator", item: PAGE_URL },
            ],
          },
        ]}
      />

      {/* ============ HEADER ============ */}
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="roi-title">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <Eyebrow>Dental Patient Leak &amp; ROI Calculator</Eyebrow>
          <h1 id="roi-title" className="text-white mb-4 max-w-4xl text-balance" style={display("clamp(2rem, 4.2vw, 3.4rem)")}>
            {practice ? (
              <>
                <span className="block text-blue-200">{practice}:</span> what are missed calls and unbooked visitors costing you?
              </>
            ) : (
              <>What are missed calls and unbooked visitors costing your practice?</>
            )}
          </h1>
          <p className="text-white/75 max-w-2xl m-0" style={body("1.05rem")}>
            Enter five numbers from your own practice. The math is shown below the results, with each
            figure marked as a published benchmark or as our own planning assumption.
          </p>
        </div>
      </section>

      {/* ============ CALCULATOR ============ */}
      <LeadGate
        tool="dental-roi"
        title="See what your practice is losing each month"
        text="Enter your practice name and work email to open the calculator."
        cta="Open the calculator"
        onUnlock={(l) => !practice && setPractice(l.practiceName)}
      >
      <section className="py-8 sm:py-12" aria-label="Calculator">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ---------- Left: practice inputs ---------- */}
          <div className="lg:col-span-5 bg-[#131d32] border-t-2 border-blue-500 p-5 sm:p-7 lg:p-8">
            <h2 className="text-white mb-6" style={display("1.6rem")}>Your practice</h2>

            <div className="mb-7">
              <label htmlFor="roi-practice" className="block text-white mb-2" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 500 }}>
                Practice name <span className="text-white/50 font-normal">(optional)</span>
              </label>
              <input
                id="roi-practice"
                type="text"
                autoComplete="organization"
                maxLength={MAX_PRACTICE_LENGTH}
                value={practice}
                onChange={(e) => setPractice(e.target.value.slice(0, MAX_PRACTICE_LENGTH))}
                onBlur={(e) => setPractice(cleanPractice(e.target.value))}
                placeholder="Your practice"
                className="w-full h-11 px-3 bg-white/[0.04] border border-white/25 text-white placeholder:text-white/35 focus:border-blue-400 focus:outline-none"
                style={{ fontFamily: INTER, fontSize: "1rem", borderRadius: 0 }}
              />
            </div>

            <div className="space-y-8">
              <RangeField
                label="Missed calls per week"
                {...LIMITS.missed}
                value={inputs.missed}
                valueText={`${inputs.missed} missed calls per week`}
                onChange={(v) => set("missed", v)}
                hint="Published studies put missed calls at about 31% to 38% of inbound calls to dental practices. Calls after closing go to voicemail unless someone covers the line."
              />
              <RangeField
                label="Monthly website visitors"
                {...LIMITS.visitors}
                value={inputs.visitors}
                valueText={`${inputs.visitors} visitors per month`}
                onChange={(v) => set("visitors", v)}
              />
              <RangeField
                label="Website visitor-to-booking rate"
                {...LIMITS.cvr}
                decimals={1}
                suffix="%"
                value={inputs.cvr}
                valueText={`${inputs.cvr} percent`}
                onChange={(v) => set("cvr", v)}
                hint={`Bookings and appointment requests divided by visitors. Published figures for typical dental sites run about 2% to 5%; many brochure-style sites sit lower. We plan to ${ROI.KSG_SITE_CVR_TENTHS / 10}%.`}
              />

              <div>
                <p id="roi-basis-label" className="text-white mb-2" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 500 }}>
                  Patient value basis
                </p>
                <div role="radiogroup" aria-labelledby="roi-basis-label" className="grid grid-cols-2 border border-white/25 mb-5">
                  {(
                    [
                      ["first", "First-year value", "Conservative"],
                      ["ltv", "5-year lifetime value", "Longer view"],
                    ] as const
                  ).map(([key, title, sub]) => {
                    const on = inputs.basis === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setBasis(key)}
                        className={`min-h-[52px] px-3 py-2 text-left transition-colors ${on ? "bg-blue-500 text-[#0f172a]" : "bg-transparent text-white/75 hover:bg-white/[0.06]"}`}
                      >
                        <span className="block" style={{ fontFamily: INTER, fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.25 }}>{title}</span>
                        <span className={`block ${on ? "text-[#0f172a]/75" : "text-white/50"}`} style={{ fontFamily: INTER, fontSize: "0.74rem" }}>{sub}</span>
                      </button>
                    );
                  })}
                </div>
                <RangeField
                  key={inputs.basis}
                  label="Average new patient value"
                  {...valueRange}
                  prefix="$"
                  value={inputs.value}
                  valueText={`${usd(inputs.value)} per new patient`}
                  onChange={setValue}
                  hint={
                    inputs.basis === "first"
                      ? "Production from a new patient in their first twelve months. Use your own figure if you track it."
                      : "Production from a new patient over five years, before referrals."
                  }
                />
              </div>

              <RangeField
                label="Monthly Google Ads budget"
                {...LIMITS.adspend}
                prefix="$"
                value={inputs.adspend}
                valueText={`${usd(inputs.adspend)} per month`}
                onChange={(v) => set("adspend", v)}
                hint={`Paid by you directly to Google. The first-month guarantee needs a budget of at least ${usd(GUARANTEE.minAdBudget)}.`}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 min-h-[44px] text-blue-300 hover:text-blue-200 underline underline-offset-4"
                style={body("0.9rem")}
              >
                {copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
                <span aria-live="polite">{copied ? "Link copied" : "Copy a link with these numbers"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  valueByBasis.current = { first: LIMITS.value.first.def, ltv: LIMITS.value.ltv.def };
                  setInputs(DEFAULT_INPUTS);
                }}
                className="inline-flex items-center min-h-[44px] text-white/60 hover:text-white underline underline-offset-4"
                style={body("0.9rem")}
              >
                Reset
              </button>
            </div>
          </div>

          {/* ---------- Right: summary ---------- */}
          <div className="lg:col-span-7 space-y-5">
            {/* Leak */}
            <div className="border border-red-400/45 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(245,158,11,0.06))] p-5 sm:p-7">
              <p className="text-amber-300 m-0 mb-3" style={capsLabel}>Estimated monthly revenue leaking to competitors</p>
              <p className="m-0 text-red-300 tabular-nums lining-nums" style={display("clamp(2.5rem, 5.4vw, 4rem)")}>
                <output>{usd(d.totalLeak)}</output>
                <span className="text-red-200/80" style={body("1rem")}> /mo</span>
              </p>
              <p className="text-white/80 mt-1 mb-5 tabular-nums lining-nums" style={body("1rem")}>
                {usd(d.annualLeak)} a year at this rate
              </p>

              <div className="h-2 flex bg-white/10 mb-4" role="img" aria-label={`Voicemail is ${Math.round(callShare)} percent of the leak; website conversion is ${100 - Math.round(callShare)} percent`}>
                <div className="bg-red-400" style={{ width: `${callShare}%` }} />
                <div className="bg-amber-400 flex-1" />
              </div>

              <dl className="m-0 grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="flex items-center gap-2 text-white mb-1" style={{ ...body("0.9rem", 1.4), fontWeight: 600 }}>
                    <span className="inline-block w-2.5 h-2.5 bg-red-400 shrink-0" aria-hidden="true" />
                    <PhoneMissed size={15} className="text-red-300 shrink-0" aria-hidden="true" />
                    Voicemail leak
                  </dt>
                  <dd className="m-0">
                    <span className="block text-white tabular-nums lining-nums" style={display("1.7rem")}>{usd(d.callLeak)}</span>
                    <span className="block text-white/65 tabular-nums lining-nums" style={body("0.8rem", 1.5)}>
                      {patients(r.lostPatientsFromCalls)} new patients a month from {patients(r.monthlyMissedCalls)} missed calls
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-white mb-1" style={{ ...body("0.9rem", 1.4), fontWeight: 600 }}>
                    <span className="inline-block w-2.5 h-2.5 bg-amber-400 shrink-0" aria-hidden="true" />
                    <MousePointerClick size={15} className="text-amber-300 shrink-0" aria-hidden="true" />
                    Website conversion leak
                  </dt>
                  <dd className="m-0">
                    <span className="block text-white tabular-nums lining-nums" style={display("1.7rem")}>{usd(d.siteLeak)}</span>
                    <span className="block text-white/65 tabular-nums lining-nums" style={body("0.8rem", 1.5)}>
                      {patients(r.extraSitePatients)} bookings a month between {pct(inputs.cvr)} and {pct(r.targetSiteCvr)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Growth */}
            <div className="border border-emerald-400/45 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(16,185,129,0.04))] p-5 sm:p-7">
              <p className="text-emerald-300 m-0 mb-3" style={capsLabel}>Projected monthly production with Kind Supply Digital</p>
              <p className="m-0 text-emerald-300 tabular-nums lining-nums" style={display("clamp(2.5rem, 5.4vw, 4rem)")}>
                <output>+{usd(d.gross)}</output>
                <span className="text-emerald-200/80" style={body("1rem")}> /mo</span>
              </p>
              <p className="text-white/80 mt-1 mb-5 tabular-nums lining-nums" style={body("1rem")}>
                About {patients(r.totalAddedPatients)} added new patients a month
              </p>

              <dl className="m-0 grid grid-cols-3 border-y border-emerald-400/25 divide-x divide-emerald-400/25">
                <div className="py-3 pr-3">
                  <dt className="text-white/65 mb-1" style={body("0.74rem", 1.3)}>Net gain</dt>
                  <dd className={`m-0 tabular-nums lining-nums ${d.net < 0 ? "text-red-300" : "text-white"}`} style={display("clamp(1.15rem, 2.4vw, 1.7rem)")}>
                    {signed(d.net)}<span className="text-white/60" style={body("0.72rem")}> /mo</span>
                  </dd>
                </div>
                <div className="py-3 px-3">
                  <dt className="text-white/65 mb-1" style={body("0.74rem", 1.3)}>Return</dt>
                  <dd className="m-0 text-white tabular-nums lining-nums" style={display("clamp(1.15rem, 2.4vw, 1.7rem)")}>{d.roi.toFixed(1)}x</dd>
                </div>
                <div className="py-3 pl-3">
                  <dt className="text-white/65 mb-1" style={body("0.74rem", 1.3)}>Breakeven</dt>
                  <dd className="m-0 text-white tabular-nums lining-nums" style={display("clamp(1.15rem, 2.4vw, 1.7rem)")}>
                    {r.breakevenPatients}<span className="text-white/60" style={body("0.72rem")}> new patients/mo</span>
                  </dd>
                </div>
              </dl>

              <table className="w-full mt-4 tabular-nums lining-nums" style={body("0.86rem", 1.45)}>
                <caption className="sr-only">Where the projected patients come from</caption>
                <thead>
                  <tr className="text-white/55 text-left">
                    <th scope="col" className="font-normal py-1.5">Source</th>
                    <th scope="col" className="font-normal py-1.5 text-right whitespace-nowrap pl-2">Patients/mo</th>
                    <th scope="col" className="font-normal py-1.5 text-right pl-2">Production</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  <tr className="border-t border-white/10">
                    <th scope="row" className="font-normal text-left py-2">
                      Website booking rate, {pct(inputs.cvr)} to {pct(r.targetSiteCvr)}
                    </th>
                    <td className="text-right py-2 pl-2">{patients(r.extraSitePatients)}</td>
                    <td className="text-right py-2 pl-2">{usd(d.siteRevenue)}</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <th scope="row" className="font-normal text-left py-2">
                      Google Ads, {usd(inputs.adspend)} at {usd(ROI.DENTAL_ADS_CPL)} a lead
                    </th>
                    <td className="text-right py-2 pl-2">{patients(r.adsBookedPatients)}</td>
                    <td className="text-right py-2 pl-2">{usd(d.adsRevenue)}</td>
                  </tr>
                  <tr className={`border-t border-white/10 ${inputs.rescue ? "" : "text-white/45"}`}>
                    <th scope="row" className="font-normal text-left py-2">
                      <label className="inline-flex items-start gap-2.5 cursor-pointer min-h-[28px]" style={{ ...body("0.86rem", 1.45), fontWeight: 400 }}>
                        <input
                          type="checkbox"
                          checked={inputs.rescue}
                          onChange={(e) => set("rescue", e.target.checked)}
                          className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-emerald-400"
                        />
                        <span>Lead Rescue text-back <span className="text-white/55 whitespace-nowrap">(add-on)</span></span>
                      </label>
                    </th>
                    <td className="text-right py-2 pl-2 align-top">{patients(r.recoveredCallPatients)}</td>
                    <td className="text-right py-2 pl-2 align-top">{usd(d.rescueRevenue)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 pt-4 border-t border-emerald-400/25">
                <p className="text-white m-0" style={{ ...body("0.92rem", 1.55), fontWeight: 600 }}>
                  Monthly investment: <span className="tabular-nums lining-nums">{usd(d.investment)}</span>
                </p>
                <p className="text-white/75 mt-1 mb-0" style={body("0.84rem", 1.6)}>
                  {usd(PACKAGE.monthly)}/mo {PACKAGE.name}, with the {usd(STANDALONE.websiteBuild)} website build fee
                  waived, plus {usd(inputs.adspend)}/mo you pay directly to Google Ads.
                  {inputs.rescue ? " Lead Rescue is quoted separately and its fee is not in this figure." : ""}
                </p>
                <p
                  className={`inline-flex items-start gap-2 mt-4 mb-0 px-3 py-2 border ${r.guaranteeEligible ? "border-emerald-400/50 text-emerald-200 bg-emerald-400/10" : "border-amber-400/50 text-amber-200 bg-amber-400/10"}`}
                  style={{ ...body("0.84rem", 1.45), fontWeight: 600 }}
                >
                  <ShieldCheck size={17} className="shrink-0 mt-px" aria-hidden="true" />
                  {r.guaranteeEligible
                    ? `Minimum ${GUARANTEE.bookedNewPatients} booked patients guaranteed in month 1, or your first ${usd(GUARANTEE.refund)} back`
                    : `The ${GUARANTEE.bookedNewPatients}-patient guarantee needs an ad budget of ${usd(GUARANTEE.minAdBudget)} or more`}
                </p>
              </div>
            </div>

            {/* Proof */}
            <div className="border border-white/15 bg-[#0c1525] p-5 sm:px-7 flex flex-col xl:flex-row xl:items-center gap-x-6 gap-y-2">
              <p className="m-0 flex-1 text-white/85" style={body("0.9rem", 1.55)}>
                <strong className="text-white">Westpark Dental Studio, Tysons Corner, VA.</strong> Website bookings rose
                from 13 to 19 (+46%) in the month the new site launched, and 24 non-branded searches averaged page one of
                Google about three weeks after launch.
              </p>
              <Link to="/dental-marketing#work" className="inline-flex items-center gap-2 min-h-[44px] shrink-0 text-blue-300 hover:text-blue-200 underline underline-offset-4" style={body("0.88rem")}>
                See the case study
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <p className="text-white/60 m-0" style={body("0.8rem", 1.6)}>
              These are estimates built from the numbers you entered and the assumptions listed below. They are not a
              promise of results. Production is not profit: your own costs of care are not deducted. The only
              guarantee is the first-month guarantee described in the agreement.
            </p>
          </div>
        </div>

        {/* ============ METHODOLOGY ============ */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mt-8">
          <details className="group border border-white/15 bg-[#0c1525]">
            <summary className="flex items-center justify-between gap-4 min-h-[60px] px-5 sm:px-7 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-blue-300">
              <span className="text-white" style={display("clamp(1.2rem, 2.2vw, 1.5rem)")}>Methodology &amp; 2026 dental benchmarks</span>
              <ChevronDown size={20} className="shrink-0 text-blue-300 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="px-5 sm:px-7 pb-7 pt-1">
              <p className="text-white/75 max-w-3xl mb-6" style={body("0.94rem")}>
                Every number in the calculator is one of four things: something you enter, a published benchmark,
                a term of our agreement, or a planning assumption we chose. Assumptions are labeled as assumptions.
                Where we found no solid public figure, we say so.
              </p>

              <div className="border-t border-white/15">
                {ROI_METHOD.map((row) => (
                  <div key={row.name} className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-8 gap-y-2 py-4 border-b border-white/10">
                    <div>
                      <p className="text-white m-0 mb-1.5" style={{ ...body("0.94rem", 1.4), fontWeight: 600 }}>{row.name}</p>
                      <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="text-blue-200 tabular-nums lining-nums" style={body("0.92rem", 1.4)}>{row.value}</span>
                        <span className={`px-2 py-0.5 border ${KIND_TONE[row.kind]}`} style={{ fontFamily: INTER, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {row.kind}
                        </span>
                      </p>
                    </div>
                    <p className="text-white/72 m-0" style={body("0.88rem", 1.65)}>{row.note}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-white mt-8 mb-3" style={display("1.25rem")}>The formulas</h3>
              <dl className="m-0 border-t border-white/15">
                {FORMULAS.map(([name, formula]) => (
                  <div key={name} className="grid sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-8 gap-y-0.5 py-2.5 border-b border-white/10">
                    <dt className="text-white/85" style={body("0.88rem", 1.5)}>{name}</dt>
                    <dd className="m-0 text-white/72" style={body("0.88rem", 1.5)}>{formula}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-white/65 mt-3 mb-0 max-w-3xl" style={body("0.84rem", 1.65)}>
                Each dollar line is rounded to the nearest dollar once, and totals are the sum of the lines shown.
                Patient counts are shown to one decimal. The Westpark figures above are one client&rsquo;s
                measured results and are not the source of any assumption in this table.
              </p>

              <h3 className="text-white mt-8 mb-3" style={display("1.25rem")}>Sources</h3>
              <ul className="list-none m-0 p-0 space-y-1">
                {Object.values(SOURCES).map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[40px] text-blue-300 hover:text-blue-200 underline underline-offset-4" style={body("0.88rem", 1.5)}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* ============ OFFER & GUARANTEE ============ */}
      <section className="text-[#0f172a] py-14 lg:py-20 [&_a:focus-visible]:outline-[#7a5c26]!" style={{ background: CREAM }} aria-labelledby="roi-offer-title">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-6">
            <Eyebrow onCream>The Offer</Eyebrow>
            <h2 id="roi-offer-title" className="mb-4" style={display("clamp(2rem, 3.8vw, 3rem)")}>{PACKAGE.name}</h2>
            <p className="mb-1" style={display("clamp(2.6rem, 5vw, 3.8rem)")}>
              {usd(PACKAGE.monthly)}
              <span className="text-[#0f172a]/75" style={body("1rem")}> /month</span>
            </p>
            <p className="font-semibold mb-6" style={body("0.96rem", 1.5)}>Six-month agreement · One practice location</p>
            <ul className="list-none m-0 p-0 border-t border-[#0f172a]/20">
              {[
                ["Custom, HIPAA-aware website", `${usd(STANDALONE.websiteBuild)} build fee waived. Forms and tracking are set up so they don’t collect patient health information.`],
                ["Local SEO and Google Business Profile", "Technical, on-page, and local optimization, plus citations."],
                ["Google Ads management", "Setup, keywords, ad copy, conversion tracking. You pay ad spend directly to Google."],
                ["Hosting, maintenance, monthly report", "Security updates, minor edits, and a written report each month."],
              ].map(([title, detail]) => (
                <li key={title} className="flex gap-3 py-3.5 border-b border-[#0f172a]/15">
                  <Check size={18} className="shrink-0 mt-1" style={{ color: GOLD_ON_CREAM }} aria-hidden="true" />
                  <span>
                    <span className="block font-semibold" style={body("0.96rem", 1.45)}>{title}</span>
                    <span className="block text-[#0f172a]/80" style={body("0.9rem", 1.6)}>{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[#0f172a]/80 mt-4 mb-0" style={body("0.88rem", 1.65)}>
              <strong>Optional add-on:</strong> Lead Rescue, our missed-call text-back that replies to a missed caller
              within about 60 seconds. It is quoted separately and is not part of the {usd(PACKAGE.monthly)} package.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="border-2 bg-white/70 p-6 sm:p-8" style={{ borderColor: GOLD_ON_CREAM }}>
              <p className="flex items-center gap-2 mb-3" style={{ ...capsLabel, color: GOLD_ON_CREAM }}>
                <ShieldCheck size={16} aria-hidden="true" />
                {GUARANTEE.bookedNewPatients}-new-patient guarantee
              </p>
              <p className="mb-4" style={display("clamp(1.5rem, 2.8vw, 2.1rem)")}>
                {GUARANTEE.bookedNewPatients} new booked patients from Google Ads in your first {GUARANTEE.periodDays} days,
                or your first {usd(GUARANTEE.refund)} payment back in full.
              </p>
              <p className="text-[#0f172a]/85 mb-3" style={body("0.92rem", 1.7)}>
                The {GUARANTEE.periodDays} days start when your ads start running. It requires a Google Ads budget of at
                least {usd(GUARANTEE.minAdBudget)} for that period, paid to Google, and your first payment made before
                work begins. If we miss, we refund the {usd(GUARANTEE.refund)} within 15 days without you asking, and the
                agreement ends. Ad spend paid to Google is not refunded, and the website and campaigns we built stay
                with us.
              </p>
              <p className="text-[#0f172a]/85 mb-6" style={body("0.92rem", 1.7)}>
                If {GUARANTEE.bookedNewPatients} patients book, the six-month agreement continues. Full conditions are in{" "}
                <a href={AGREEMENT_PATH} className="underline underline-offset-4 font-medium">Section 17 of the agreement</a>.
              </p>
              <Link
                to={contactHref}
                className="flex items-center justify-center gap-3 min-h-[56px] px-6 py-3 bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors font-medium text-center"
                style={{ ...body("0.98rem", 1.35), letterSpacing: "0.02em" }}
              >
                Claim Your Booked Patient Guarantee
                <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
              </Link>
              <p className="text-[#0f172a]/70 mt-3 mb-0 text-center" style={body("0.8rem", 1.55)}>
                Your numbers come with you, so the conversation starts from your practice.
              </p>
              <div className="mt-4 pt-4 border-t border-[#0f172a]/15 flex flex-wrap justify-center gap-x-7 gap-y-1" style={body("0.9rem")}>
                <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] underline underline-offset-4 font-medium">
                  Book 15 minutes
                </a>
                <Link to="/dental-marketing#package" className="inline-flex items-center min-h-[44px] underline underline-offset-4">
                  Pricing and terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </LeadGate>
    </div>
  );
}
