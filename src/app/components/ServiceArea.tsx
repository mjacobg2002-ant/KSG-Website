import { MapPin } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const areas = [
  { city: "Web Design", note: "Conversion-focused sites · built to book" },
  { city: "Local & National SEO", note: "Get found in any U.S. market" },
  { city: "Google Business Profile", note: "Rank the map · win local search" },
  { city: "Paid Growth", note: "Google & Meta ads that convert" },
  { city: "Lead Rescue CRM", note: "Missed-call text-back · automation" },
  { city: "100% Remote", note: "All 50 states · every time zone" },
];

export function ServiceArea() {
  return (
    <section className="py-32 border-b border-white/5 bg-[#0c1525]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p
            className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
          >
            Nationwide Digital Marketing
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
            Built for Businesses Across the United States.
          </h2>
          <p
            className="text-white/40 mb-20 max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.8 }}
          >
            We help service businesses get found and convert more customers &mdash; anywhere
            in the country. Fully remote, we bring the same conversion websites, local SEO,
            and lead systems to any U.S. market, in every time zone, so wherever your
            customers search, your business is what they find.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {areas.map((a, i) => (
            <AnimatedSection key={a.city} delay={i * 0.08}>
              <div className="bg-[#0f172a] p-8 lg:p-10 h-full group hover:bg-[#131d32] transition-colors duration-500">
                <MapPin
                  size={22}
                  className="text-blue-400/30 mb-6 group-hover:text-blue-400/60 transition-colors duration-500"
                />
                <h3
                  className="text-white mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 500 }}
                >
                  {a.city}
                </h3>
                <p
                  className="text-white/40"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", lineHeight: 1.6 }}
                >
                  {a.note}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
