import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { motion, useInView } from "motion/react";

// ── Count-up hook ──
export function useCountUp(end: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return count;
}

type Stat = {
  /** Number to count up to. Use null for static values like "24/7". */
  target: number | null;
  suffix?: string;
  staticValue?: string;
  label: string;
};

const stats: Stat[] = [
  { target: 60, suffix: "s", label: "To Text Back Every Missed Call" },
  { target: 7, suffix: " Days", label: "From Signup to Live System" },
  { target: null, staticValue: "24/7", label: "Coverage — Nights, Weekends, Holidays" },
  { target: 1, suffix: " Job", label: "Guaranteed in 30 Days, or Money Back" },
];

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(stat.target ?? 0, 1800, isInView);

  return (
    <AnimatedSection delay={index * 0.1}>
      <div className="text-center" ref={ref}>
        <motion.p
          className="text-blue-300 mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {stat.target === null ? (
            stat.staticValue
          ) : (
            <>
              {count}
              {stat.suffix}
            </>
          )}
        </motion.p>
        <motion.p
          className="text-white/40"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", lineHeight: "1.5" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.3 }}
        >
          {stat.label}
        </motion.p>
      </div>
    </AnimatedSection>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 border-t border-b border-white/5 bg-[#0c1525]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
