import { AnimatedSection } from "./AnimatedSection";

/* Real client logos — backgrounds removed, tuned for the dark theme. */
import gracePath from "../assets/clients/grace-path.png";
import dulaney from "../assets/clients/dulaney.png";
import ltc from "../assets/clients/ltc.png";
import abideThrive from "../assets/clients/abide-thrive.png";
import summitDental from "../assets/clients/summit-dental.png";
import alpineConcrete from "../assets/clients/alpine-concrete.png";
import sn from "../assets/clients/sn.png";

/*
 * To add another client: drop a background-free PNG into
 * src/app/assets/clients/, import it above, and add a row here.
 */
type Client = { src: string; alt: string; scale?: number };

const clients: Client[] = [
  { src: gracePath, alt: "Grace Path Wellness Center" },
  { src: dulaney, alt: "Dulaney" },
  { src: ltc, alt: "LTC" },
  { src: abideThrive, alt: "Abide & Thrive", scale: 1.7 },
  { src: summitDental, alt: "Summit Dental" },
  { src: alpineConcrete, alt: "Alpine Concrete Co." },
  { src: sn, alt: "sn." },
];

/* Seconds for one full loop. Lower = faster. */
const LOOP_SECONDS = 32;

export function ClientWall() {
  // Two copies of the list so the scroll can loop seamlessly.
  const track = [...clients, ...clients];

  return (
    <section className="py-20 lg:py-24 border-b border-white/5 bg-[#0c1525] overflow-hidden">
      <style>{`
        .ksg-marquee-viewport { --logo-h: 2.5rem; }
        @media (min-width: 1024px) { .ksg-marquee-viewport { --logo-h: 3rem; } }
        @keyframes ksg-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ksg-marquee-track {
          display: flex;
          width: max-content;
          animation: ksg-marquee ${LOOP_SECONDS}s linear infinite;
          will-change: transform;
        }
        .ksg-marquee-viewport:hover .ksg-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ksg-marquee-track { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-center text-blue-300/40 uppercase tracking-[0.3em] mb-14"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            Trusted by the practices &amp; businesses we build for
          </p>
        </AnimatedSection>
      </div>

      {/* Edge-faded marquee viewport (full-bleed) */}
      <div
        className="ksg-marquee-viewport relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="ksg-marquee-track">
          {track.map((c, i) => (
            <div
              key={`${c.alt}-${i}`}
              className="flex items-center justify-center shrink-0 px-8 lg:px-12"
              aria-hidden={i >= clients.length}
            >
              <img
                src={c.src}
                alt={i < clients.length ? c.alt : ""}
                loading="lazy"
                className="w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                style={{ height: `calc(var(--logo-h) * ${c.scale ?? 1})` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
