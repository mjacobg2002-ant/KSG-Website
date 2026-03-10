import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { motion, useInView } from "motion/react";
import { Star } from "lucide-react";

// ── Count-up hook ──
function useCountUp(
  end: number,
  duration: number = 2000,
  inView: boolean
) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return count;
}

// ── Animated stat component ──
function AnimatedStat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Parse the stat value to determine animation type
  const getAnimatedValue = useCallback(() => {
    if (value === "2–4x") return { type: "range" as const, from: 2, to: 4 };
    if (value === "50+") return { type: "countup" as const, target: 50, suffix: "+" };
    if (value === "90+") return { type: "countup" as const, target: 90, suffix: "+" };
    if (value === "100%") return { type: "countup" as const, target: 100, suffix: "%" };
    return { type: "static" as const };
  }, [value]);

  const config = getAnimatedValue();

  const countFrom = useCountUp(
    config.type === "range" ? config.from : 0,
    1200,
    isInView
  );
  const countTo = useCountUp(
    config.type === "range" ? config.to : 0,
    1600,
    isInView
  );
  const countMain = useCountUp(
    config.type === "countup" ? config.target : 0,
    config.type === "countup" && config.target === 100 ? 2200 : 1800,
    isInView
  );

  const renderValue = () => {
    if (config.type === "range") {
      return <>{countFrom}–{countTo}x</>;
    }
    if (config.type === "countup") {
      return <>{countMain}{config.suffix}</>;
    }
    return <>{value}</>;
  };

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
          {renderValue()}
        </motion.p>
        <motion.p
          className="text-white/40"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", lineHeight: "1.5" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.3 }}
        >
          {label}
        </motion.p>
      </div>
    </AnimatedSection>
  );
}

const stats = [
  { value: "2–4x", label: "Increase in Patient Inquiries" },
  { value: "50+", label: "Healthcare Projects Delivered" },
  { value: "90+", label: "Avg. Google PageSpeed Score" },
  { value: "100%", label: "HIPAA-Compliant Builds" },
];

const testimonials = [
  {
    quote:
      "Kind Supply Digital completely transformed our online presence. Within 90 days we saw a 340% increase in new patient inquiries. They understand healthcare marketing in a way other agencies simply don't.",
    name: "Dr. Sarah M.",
    role: "Clinical Director",
    org: "Multi-Location Mental Health Practice",
    stars: 5,
  },
  {
    quote:
      "Our treatment center was invisible online. Kind Supply built us a platform that now generates over 180 qualified admissions inquiries per month. The ROI has been extraordinary.",
    name: "James R.",
    role: "Executive Director",
    org: "Substance Abuse Treatment Center",
    stars: 5,
  },
  {
    quote:
      "They took the time to understand our DDA facility, our families, and our mission. The website they built doubled our tour bookings in the first quarter. It pays for itself every single month.",
    name: "Linda K.",
    role: "Owner & Administrator",
    org: "Assisted Living & DDA Facility",
    stars: 5,
  },
];

export function StatsSection() {
  return (
    <section className="py-20 border-t border-b border-white/5 bg-[#0c1525]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-32 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            Client Results
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
            What Our Clients Say
          </h2>
          <p
            className="text-white/40 mb-20 max-w-xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
          >
            Healthcare organizations trust Kind Supply Digital to deliver
            measurable results. Here's what they have to say.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.12}>
              <div className="bg-[#0f172a] p-8 lg:p-10 h-full flex flex-col group hover:bg-[#131d32] transition-colors duration-500">
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      className="text-blue-400 fill-blue-400"
                    />
                  ))}
                </div>
                <blockquote
                  className="text-white/55 flex-1 mb-8"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.8" }}
                >
                  "{t.quote}"
                </blockquote>
                <div>
                  <p
                    className="text-white/80"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-white/30"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
                  >
                    {t.role}, {t.org}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}