import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Understanding your organization's goals, patient population, and digital strategy. We immerse ourselves in your healthcare niche to identify opportunities.",
  },
  {
    num: "02",
    title: "Digital Architecture",
    desc: "Planning website structure, healthcare SEO strategy, and patient-centered user experience. Every page and flow is mapped before design begins.",
  },
  {
    num: "03",
    title: "Design",
    desc: "Creating warm, trustworthy visual systems aligned with your brand. Our design process focuses on interfaces that inspire confidence in patients and families.",
  },
  {
    num: "04",
    title: "Development",
    desc: "Building HIPAA-conscious, scalable, fast websites using cutting-edge technology. Performance, accessibility, and security are never compromised.",
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
        title="Our 6-Step Healthcare Web Design Process | Kind Supply Digital"
        description="Our proven 6-step process for building high-performance healthcare websites: Discovery, Architecture, Design, Development, Launch, and Growth Support. HIPAA-conscious development for mental health clinics, treatment centers, and behavioral health facilities."
        keywords="healthcare website design process, behavioral health web development methodology, mental health clinic web development, HIPAA website development, treatment center website process, healthcare digital project management"
        canonical="https://kindsupplydigital.com/process"
        structuredData={{
          "@type": "HowTo",
          name: "How Kind Supply Digital Builds Healthcare Websites",
          description: "A proven 6-step methodology for building high-performance digital platforms for behavioral health organizations.",
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