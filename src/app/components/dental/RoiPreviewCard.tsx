import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { RangeField } from "./RoiControls";
import { usd } from "./dentalConfig";
import { DEFAULT_INPUTS, LIMITS, ROI_PATH, compute, present } from "./roiMath";

const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";

/*
 * Preview of the dental ROI calculator for the homepage and /dental-marketing.
 * One live slider (missed calls); everything else stays at the calculator's
 * starting values. The button opens /dental-roi with the chosen number.
 */
export function RoiPreviewCard({ headingId = "roi-preview-title" }: { headingId?: string }) {
  const [missed, setMissed] = useState(DEFAULT_INPUTS.missed);
  const inputs = { ...DEFAULT_INPUTS, missed };
  const d = present(inputs, compute(inputs));

  return (
    <section className="bg-[#0a1120] border-y border-blue-500/30 py-16 lg:py-20 text-white" aria-labelledby={headingId}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="border border-blue-500/60 bg-[#131d32] grid md:grid-cols-2">
          <div className="p-6 sm:p-9 lg:p-11 md:border-r border-white/10">
            <p className="text-blue-300 uppercase mb-5" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" }}>
              For Dental Practices · Free Calculator
            </p>
            <h2 id={headingId} className="text-white mb-4 text-balance" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.16, letterSpacing: "-0.02em" }}>
              How many new patients go to voicemail each month?
            </h2>
            <p className="text-white/75 mb-7" style={{ fontFamily: INTER, fontSize: "0.98rem", lineHeight: 1.7 }}>
              Move the slider to your missed calls. The full calculator adds your website traffic, patient
              value, and ad budget, and shows the source behind every number.
            </p>
            <Link
              to={`${ROI_PATH}?missed=${missed}`}
              className="inline-flex items-center justify-center gap-3 min-h-[54px] px-6 py-3 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              style={{ fontFamily: INTER, fontSize: "0.95rem", lineHeight: 1.35, letterSpacing: "0.02em" }}
            >
              Calculate Your Practice&rsquo;s Patient Leak
              <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <div className="p-6 sm:p-9 lg:p-11">
            <RangeField
              label="Missed calls per week"
              {...LIMITS.missed}
              value={missed}
              valueText={`${missed} missed calls per week`}
              onChange={setMissed}
            />
            <dl className="m-0 mt-6 border-t border-white/15">
              <div className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10">
                <dt className="text-white/75" style={{ fontFamily: INTER, fontSize: "0.9rem" }}>Voicemail leak</dt>
                <dd className="m-0 text-white tabular-nums lining-nums" style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600 }}>{usd(d.callLeak)}/mo</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10">
                <dt className="text-white/75" style={{ fontFamily: INTER, fontSize: "0.9rem" }}>Website conversion leak</dt>
                <dd className="m-0 text-white tabular-nums lining-nums" style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600 }}>{usd(d.siteLeak)}/mo</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-4">
                <dt className="text-amber-300 uppercase" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em" }}>Estimated monthly leak</dt>
                <dd className="m-0 text-red-300 tabular-nums lining-nums" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1 }}>
                  <output>{usd(d.totalLeak)}</output>
                </dd>
              </div>
            </dl>
            <p className="text-white/55 mt-4 mb-0" style={{ fontFamily: INTER, fontSize: "0.78rem", lineHeight: 1.6 }}>
              Estimate using {DEFAULT_INPUTS.visitors} website visitors a month, a {DEFAULT_INPUTS.cvr}% booking rate,
              and {usd(DEFAULT_INPUTS.value)} first-year value per new patient. Change all of them in the calculator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
