import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { useCountUp } from "./SocialProof";
import { BOOKING_URL } from "../booking";

/*
 * Featured dental case study — Westpark Dental Studio (Tysons/McLean, VA).
 * Source: the practice's booking dashboard ("Your website" channel) and Google
 * Search Console; full write-up lives at /westpark-case-study.
 *   Aug 2026: 13 website bookings → Sep 2026: 19 (+46%), new site launched Sep 12.
 *   95% is a PROJECTION for month two (~25 bookings vs. the 13 baseline) — keep
 *   it labeled as projected until the month closes.
 */
type Stat = {
  target: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  label: string;
  detail: string;
  projected?: boolean;
};

const stats: Stat[] = [
  {
    target: 46,
    prefix: "+",
    suffix: "%",
    label: "More booked patients in under a month",
    detail: "Website bookings rose from 13 to 19 the month the new site launched",
  },
  {
    target: 95,
    prefix: "+",
    suffix: "%",
    label: "Projected growth by month two",
    detail: "On pace for ~25 booked patients a month from the website, vs. 13 before",
    projected: true,
  },
  {
    target: 3,
    suffix: " wks",
    label: "To Page 1 of Google",
    detail: "24 non-branded patient searches averaging Page 1, like “tooth extractions near me”",
  },
  {
    target: 2.2,
    suffix: "×",
    decimals: 1,
    label: "Google visibility in one week",
    detail: "Daily search impressions grew from 122 to 268",
  },
];

function SpotlightStat({ s, index }: { s: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const scale = s.decimals ? 10 ** s.decimals : 1;
  const count = useCountUp(Math.round(s.target * scale), 1800, inView);
  const shown = s.decimals ? (count / scale).toFixed(s.decimals) : count;

  return (
    <AnimatedSection delay={index * 0.1}>
      <div ref={ref} className="bg-[#0f172a] p-8 lg:p-10 h-full">
        <p
          className="text-blue-300/50 uppercase tracking-[0.15em] mb-4 h-4"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", fontWeight: 600 }}
        >
          {s.projected ? "Projected" : "Actual"}
        </p>
        <motion.p
          className={s.projected ? "text-blue-200/70 mb-3" : "text-blue-300 mb-3"}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 5vw, 3.4rem)",
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {s.prefix}
          {shown}
          {s.suffix}
        </motion.p>
        <p
          className="text-white/80 mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.98rem", fontWeight: 500, lineHeight: 1.4 }}
        >
          {s.label}
        </p>
        <p
          className="text-white/35"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", lineHeight: 1.6 }}
        >
          {s.detail}
        </p>
      </div>
    </AnimatedSection>
  );
}

export function DentalSpotlight({ eyebrow = "Featured Case Study · Dental" }: { eyebrow?: string }) {
  return (
    <section className="py-32 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-blue-300/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            <TrendingUp size={12} className="text-blue-300/60" />
            {eyebrow}
          </p>
          <h2
            className="text-white mb-6 max-w-4xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            We Helped a Dental Office Grow Booked Patients 46% in Under a Month.
          </h2>
          <p
            className="text-white/40 mb-16 max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.8 }}
          >
            Westpark Dental Studio in Tysons, VA launched its new Kind Supply website on
            September 12. Within the first month, patients booking straight from the site
            jumped 46% &mdash; and at the current pace the practice is projected to hit 95%
            growth in booked patients by month two.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-10">
          {stats.map((s, i) => (
            <SpotlightStat key={s.label} s={s} index={i} />
          ))}
        </div>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <a
              href="/westpark-case-study"
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Read the Full Dental Case Study
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 transition-colors group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.04em" }}
            >
              Run a free rank check on your practice
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p
            className="text-white/25 mt-8 max-w-3xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.74rem", lineHeight: 1.7 }}
          >
            Actual figures: bookings from the practice&rsquo;s own website, August vs. September
            2026, and Google Search Console data. The 95% figure is a projection based on the
            current pace, not a guarantee of future results.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
