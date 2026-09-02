import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { useCountUp } from "./SocialProof";

/*
 * Real, documented client outcomes — these mirror the numbers on the
 * Case Studies page. Keep the two in sync if either changes.
 */
type Result = {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  detail: string;
};

const results: Result[] = [
  {
    target: 340,
    suffix: "%",
    label: "More new-patient inquiries",
    detail: "12-location counseling practice, within 4 months of relaunch",
  },
  {
    target: 180,
    suffix: "+",
    label: "Admissions inquiries / month",
    detail: "Substance-abuse treatment center, within 90 days of launch",
  },
  {
    target: 2,
    suffix: "x",
    label: "Facility tour bookings",
    detail: "Assisted-living provider, in the first quarter",
  },
  {
    target: 35,
    suffix: "%",
    label: "Lower patient-acquisition cost",
    detail: "Behavioral-health provider group, alongside +190% referrals",
  },
];

function ResultStat({ r, index }: { r: Result; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(r.target, 1800, inView);

  return (
    <AnimatedSection delay={index * 0.1}>
      <div ref={ref} className="border-l border-white/10 pl-6 lg:pl-8 h-full">
        <motion.p
          className="text-blue-300 mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
            fontWeight: 400,
            lineHeight: 1,
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {r.prefix}
          {count}
          {r.suffix}
        </motion.p>
        <p
          className="text-white/80 mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.98rem", fontWeight: 500, lineHeight: 1.4 }}
        >
          {r.label}
        </p>
        <p
          className="text-white/35"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", lineHeight: 1.6 }}
        >
          {r.detail}
        </p>
      </div>
    </AnimatedSection>
  );
}

export function ProvenResults() {
  return (
    <section className="py-32 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            The Receipts
          </p>
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            We Don't Ask You to Take Our Word for It.
          </h2>
          <p
            className="text-white/40 mb-20 max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.8 }}
          >
            Real outcomes from real engagements &mdash; the kind of numbers that show up
            in a schedule and a bank account, not a vanity dashboard.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-20">
          {results.map((r, i) => (
            <ResultStat key={r.label} r={r} index={i} />
          ))}
        </div>

        {/* Credibility bar — our discipline, not the clients' accreditations */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 border border-white/10 bg-[#0c1525] p-8 lg:p-10">
            <div>
              <p
                className="text-white mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 600 }}
              >
                We earned our name in the hardest niche online to build trust in.
              </p>
              <p
                className="text-white/45 max-w-2xl"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", lineHeight: 1.75 }}
              >
                Behavioral health is where a single misstep on privacy or messaging isn't an
                inconvenience &mdash; it's a liability. That discipline is baked into every build
                we ship, in every industry we serve.
              </p>
            </div>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 transition-colors group shrink-0"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.04em" }}
            >
              Read the full case studies
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
