import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { IntakeForm, type IntakeField } from "./IntakeForm";
import { BOOK_CALL_URL, GUARANTEE, usd } from "./dentalConfig";
import {
  ROI_CONTACT_SOURCE,
  ROI_PATH,
  compute,
  parseRoiParams,
  present,
  roiQuery,
  roiSummary,
  type RoiInputs,
} from "./roiMath";

const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";

const fields: IntakeField[] = [
  { name: "practiceName", label: "Practice name", type: "text", required: true, autoComplete: "organization" },
  { name: "contactName", label: "Your name", type: "text", required: true, autoComplete: "name", half: true },
  { name: "email", label: "Business email", type: "email", required: true, autoComplete: "email", half: true },
];

/*
 * Shown at the top of /contact when someone arrives from the dental ROI
 * calculator (?source=dental-roi&missed=...). It repeats their numbers and
 * sends them to us with their name and email, so the first conversation
 * starts from their practice. Results are recalculated here from the inputs
 * in the link; totals passed in the URL are never trusted for display.
 */
export function RoiHandoff() {
  const [state, setState] = useState<{ inputs: RoiInputs; practice: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("source") === ROI_CONTACT_SOURCE) setState(parseRoiParams(params));
  }, []);

  if (!state) return null;
  const { inputs, practice } = state;
  const r = compute(inputs);
  const d = present(inputs, r);
  const summary = roiSummary(inputs, {
    leak: d.totalLeak.toLocaleString("en-US"),
    patients: r.totalAddedPatients.toFixed(1),
    gross: d.gross.toLocaleString("en-US"),
    net: d.net.toLocaleString("en-US"),
  });

  const rows: [string, string][] = [
    ["Missed calls per week", String(inputs.missed)],
    ["Website visitors per month", inputs.visitors.toLocaleString("en-US")],
    ["Visitor-to-booking rate", `${inputs.cvr.toFixed(1)}%`],
    ["New patient value", `${usd(inputs.value)} (${inputs.basis === "ltv" ? "5-year" : "first-year"})`],
    ["Google Ads budget", `${usd(inputs.adspend)}/mo`],
    ["Estimated monthly leak", `${usd(d.totalLeak)}/mo`],
    ["Projected production", `+${usd(d.gross)}/mo`],
  ];

  return (
    <section className="pt-12 pb-16 border-b border-white/10 bg-[#0c1525]" aria-labelledby="roi-handoff-title">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-blue-300/80 uppercase mb-5" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" }}>
            From the Dental ROI Calculator
          </p>
          <h1 id="roi-handoff-title" className="text-white mb-5 text-balance" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(2rem, 4vw, 2.9rem)", fontWeight: 400, lineHeight: 1.14 }}>
            {practice ? `${practice}: send us your numbers` : "Send us your numbers"}
          </h1>
          <p className="text-white/75 mb-6" style={{ fontFamily: INTER, fontSize: "1rem", lineHeight: 1.7 }}>
            We&rsquo;ll reply by email with how the {GUARANTEE.bookedNewPatients}-new-patient guarantee would apply
            to your practice. No phone number needed.
          </p>
          <dl className="m-0 border-t border-white/15">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-white/10">
                <dt className="text-white/65" style={{ fontFamily: INTER, fontSize: "0.88rem" }}>{label}</dt>
                <dd className="m-0 text-white tabular-nums lining-nums text-right" style={{ fontFamily: INTER, fontSize: "0.92rem", fontWeight: 600 }}>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-x-6 mt-3" style={{ fontFamily: INTER, fontSize: "0.9rem" }}>
            <Link to={`${ROI_PATH}?${roiQuery(inputs, practice).toString()}`} className="inline-flex items-center min-h-[44px] text-white/70 hover:text-white underline underline-offset-4">
              Change these numbers
            </Link>
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-[44px] text-blue-300 hover:text-blue-200 underline underline-offset-4">
              Or book 15 minutes
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="bg-[#131d32] border-t-2 border-blue-500 p-5 sm:p-9">
            <IntakeForm
              kind="roi"
              fields={fields}
              initialValues={{ practiceName: practice }}
              extras={[{ name: "calculator", label: "Calculator inputs and results", value: summary }]}
              submitLabel="Send My Numbers"
              successTitle="Thank you. We have your numbers."
              successBody="We’ll review them and reply to the email you gave us. If you’d like to talk sooner, you can book 15 minutes any time."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
