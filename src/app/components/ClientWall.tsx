import { motion } from "motion/react";
import { AnimatedSection } from "./AnimatedSection";

/* Real client logos on file. */
import dulaney from "../assets/clients/dulaney.png";
import gracePath from "../assets/clients/grace-path.png";
import ltc from "../assets/clients/ltc.png";

/*
 * ── Adding the rest of your client logos ──
 * Drop the file into  src/app/assets/clients/  then add a row below, e.g.:
 *   import abideThrive from "../assets/clients/abide-thrive.png";
 *   ...then add { src: abideThrive, alt: "Abide & Thrive" } to the array.
 * Suggested filenames for the logos you sent:
 *   abide-thrive.png · summit-dental.png · alpine-concrete.png · sn.png
 */
type Client = { src: string; alt: string };

const clients: Client[] = [
  { src: gracePath, alt: "Grace Path Wellness Center" },
  { src: dulaney, alt: "Dulaney" },
  { src: ltc, alt: "LTC" },
];

export function ClientWall() {
  return (
    <section className="py-20 lg:py-24 border-b border-white/5 bg-[#0c1525]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-center text-blue-300/40 uppercase tracking-[0.3em] mb-14"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            Trusted by the practices &amp; businesses we build for
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 items-stretch">
          {clients.map((c, i) => (
            <motion.div
              key={c.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center bg-white/[0.97] rounded-lg px-6 py-8 lg:px-8 lg:py-10 min-h-[120px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <img
                src={c.src}
                alt={c.alt}
                loading="lazy"
                className="max-h-14 lg:max-h-16 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Credibility line — about us, not the clients' accreditations */}
        <AnimatedSection delay={0.15}>
          <p
            className="text-center text-white/40 mt-14 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}
          >
            From behavioral health and wellness to home services &mdash; the same standard,
            the same measurable results, whatever the industry.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
