import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { SEOHead, SITE } from "../components/SEOHead";
import { AGREEMENT_PATH, BOOK_CALL_URL, GUARANTEE, PACKAGE, usd } from "../components/dental/dentalConfig";
import { SLOTS_PER_ZIP, TerritoryChecker } from "../components/funnel/TerritoryChecker";
import { Eyebrow, body, buttonText, cleanText, display, focusScope, ghostButton, goldButton, useQueryParams } from "../components/funnel/ui";

const PAGE_URL = `${SITE}/start`;

const STEPS = [
  ["Confirm your territory", `We take ${SLOTS_PER_ZIP} partner practices per ZIP code. Check that yours still has a slot below.`],
  ["Talk it through, or go straight to the agreement", "A 15-minute call with the founder, or read the full terms and check out online."],
  [`Your ${GUARANTEE.periodDays}-day guarantee window`, `Once your ads go live: ${GUARANTEE.bookedNewPatients} booked new patients in ${GUARANTEE.periodDays} days, or your first ${usd(GUARANTEE.refund)} payment is refunded. Conditions are in Section 17.`],
];

export function StartPage() {
  const params = useQueryParams();
  const [practice, setPractice] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    if (!params) return;
    setPractice(cleanText(params.get("practice"), 60));
    const z = params.get("zip") ?? "";
    if (/^\d{5}$/.test(z)) setZip(z);
  }, [params]);

  return (
    <div className={focusScope}>
      <SEOHead
        title="Start Your Dental Growth Package | Kind Supply Digital"
        description={`Check that your ZIP code is open, then enroll in the ${PACKAGE.name}: a new website, local SEO and Google Ads management for one dental location.`}
        canonical={PAGE_URL}
      />
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="start-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14">
          <Eyebrow>{PACKAGE.name}</Eyebrow>
          <h1 id="start-title" className="text-white max-w-3xl" style={display("clamp(2rem, 5vw, 3.2rem)")}>
            {practice ? `Let's get ${practice} started` : "Let's get your practice started"}
          </h1>
          <p className="text-white/65 max-w-2xl mt-5" style={body("1.05rem")}>
            {usd(PACKAGE.monthly)} a month for {PACKAGE.months} months, one location. New website, local SEO and Google Ads management, with a first-month new-patient guarantee.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          <ol className="flex flex-col gap-7">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="w-9 h-9 rounded-full border border-blue-400/50 text-blue-300 flex items-center justify-center shrink-0 tabular-nums" style={{ ...buttonText, fontSize: "0.9rem" }}>{i + 1}</span>
                <div>
                  <p className="text-white" style={{ ...body("1.05rem", 1.4), fontWeight: 600 }}>{title}</p>
                  <p className="text-white/60 mt-1.5" style={body("0.94rem")}>{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-6">
            <TerritoryChecker initialZip={zip} practice={practice} />
            <div className="border border-white/12 p-6 sm:p-8">
              <p className="text-white mb-4" style={{ ...body("1.05rem", 1.4), fontWeight: 600 }}>Ready when you are</p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {["No payment is taken on this page", "The agreement shows every term before checkout", `You pay Google directly for ads (minimum ${usd(GUARANTEE.minAdBudget)} budget)`].map((t) => (
                  <li key={t} className="flex gap-2.5 text-white/70" style={body("0.92rem", 1.5)}>
                    <Check size={16} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className={goldButton} style={buttonText}>
                  Book 15 minutes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <a href={AGREEMENT_PATH} className={ghostButton} style={buttonText}>Review the agreement &amp; check out</a>
              </div>
              <p className="text-white/45 mt-5" style={body("0.84rem")}>
                Not sure yet? <Link to="/dental-marketing" className="underline underline-offset-4 text-white/70 hover:text-white">See everything in the package</Link> or <Link to="/audit" className="underline underline-offset-4 text-white/70 hover:text-white">scan your current site</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
