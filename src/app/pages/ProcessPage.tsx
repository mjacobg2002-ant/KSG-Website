import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Understanding your business, your customers, and what happens today when someone calls. For Lead Rescue clients, that includes an after-hours test call to your own line.",
  },
  {
    num: "02",
    title: "Digital Architecture",
    desc: "Planning site structure, keyword strategy, and every follow-up workflow. Every page, automation, and pipeline stage is mapped before anything gets built.",
  },
  {
    num: "03",
    title: "Design",
    desc: "Creating trustworthy visual systems aligned with your brand — designed to convert a homeowner in a hurry or a family making a careful decision.",
  },
  {
    num: "04",
    title: "Development",
    desc: "Building fast, scalable sites and systems — HIPAA-conscious for healthcare clients, carrier-registered texting for everyone. Performance and security are never compromised.",
  },
  {
    num: "05",
    title: "Launch",
    desc: "Deployment, optimization, and performance testing. We ensure everything is pixel-perfect and performing at the highest level before going live.",
  },
  {
    num: "06",
    title: "Growth Support",
    desc: "Optional ongoing optimization and digital consulting. We continue to refine and improve your platform based on real-world data and user feedback.",
  },
];

export function ProcessPage() {
  return (
    <div>
      <SEOHead
        title="Our Process — From Audit Call to Live System | Kind Supply Digital"
        description="Our proven process for building client-acquisition websites and lead rescue CRM systems: Discovery, Architecture, Design, Development, Launch, and Growth Support — for home services, behavioral health, legal, and dental businesses."
        keywords="web design process, CRM setup process, missed call text back setup, local service business marketing process, website build methodology"
        canonical="https://kindsupplydigital.com/process"
        structuredData={{
          "@type": "HowTo",
          name: "How Kind Supply Digital Builds Websites and Lead Systems",
          description: "A proven methodology for building client-acquisition websites and CRM lead systems for local service businesses.",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.desc,
          })),
        }}
      />
      {/* Header */}
      <section className="pt-32 pb-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Methodology
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Our Process
            </h1>
            <p
              className="text-white/40 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              A proven methodology refined through years of delivering
              high-performance digital platforms for ambitious organizations.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {steps.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.08}>
              <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6 lg:gap-16 py-16 border-b border-white/5 group">
                <span
                  className="text-white/10 group-hover:text-white/30 transition-colors duration-700"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.5rem",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h2
                    className="text-white/70 group-hover:text-white transition-colors duration-500 mb-4"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.8rem",
                      fontWeight: 400,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className="text-white/30 group-hover:text-white/45 transition-colors duration-500 max-w-2xl"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
              }}
            >
              Ready to Begin?
            </h2>
            <p
              className="text-white/35 mb-12"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Start with a consultation to explore how our process works for your project.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Request Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}