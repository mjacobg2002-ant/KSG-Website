import { Link } from "react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const whatMakesUsDifferent = [
  {
    title: "Behavioral health is all we do.",
    desc: "We understand your audience, your referral sources, and the compliance landscape.",
  },
  {
    title: "We build systems, not just websites.",
    desc: "Every project is designed to generate leads, track results, and scale with your growth.",
  },
  {
    title: "We measure what matters.",
    desc: "Patient inquiries, qualified admissions, referral volume — not vanity metrics.",
  },
];

export function AboutPage() {
  return (
    <div>
      <SEOHead
        title="About Kind Supply Digital | Behavioral Health Marketing Agency Built for Healthcare"
        description="Kind Supply Digital is a marketing agency focused exclusively on behavioral health and human services providers. We build digital systems that drive patient acquisition for mental health clinics, treatment centers, DDA facilities, and assisted living organizations."
        keywords="behavioral health marketing agency, about Kind Supply Digital, mental health website agency, behavioral health digital agency, treatment center web developer, healthcare-focused digital partner"
        canonical="https://kindsupplydigital.com/about"
        structuredData={{
          "@type": "AboutPage",
          mainEntity: {
            "@type": "Organization",
            name: "Kind Supply Digital",
            description: "Premium healthcare digital agency specializing in behavioral health marketing, web design, and patient acquisition.",
            foundingDate: "2023",
            areaServed: "United States",
            knowsAbout: ["Behavioral Health Marketing", "Healthcare Website Design", "Mental Health SEO", "HIPAA-Conscious Development"],
          },
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
              About Us
            </p>
            <h1
              className="text-white mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Why Behavioral Health?
            </h1>
            <div className="w-16 h-px bg-blue-400/20" />
          </AnimatedSection>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <AnimatedSection>
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Our Story
              </p>
              <p
                className="text-blue-100/50 mb-8"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  lineHeight: "1.6",
                  fontWeight: 400,
                }}
              >
                Because the people doing this work deserve a partner who understands it.
              </p>
              <p
                className="text-white/50 mb-8"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "2" }}
              >
                Kind Supply Digital exists to help behavioral health providers, treatment centers,
                and human services organizations grow — so they can reach more people who need care.
                We don't work with every industry. We chose this one because the work matters, and
                because too many great providers are invisible online.
              </p>
              <p
                className="text-white/40"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "2" }}
              >
                We bring the same level of strategy, design, and technical execution you'd expect
                from a top-tier agency — focused entirely on your space.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                What Makes Us Different
              </p>
              <div className="space-y-8">
                {whatMakesUsDifferent.map((item) => (
                  <div key={item.title} className="group">
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle2
                        size={18}
                        className="text-blue-400/50 mt-0.5 shrink-0 group-hover:text-blue-400 transition-colors"
                      />
                      <h3
                        className="text-white/80"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 500 }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p
                      className="text-white/40 pl-[30px]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Foundation
            </p>
            <h2
              className="text-white mb-10"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Our Values
            </h2>
            <p
              className="text-white/50 max-w-3xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "2" }}
            >
              We believe in doing work that serves people well. That means being honest about what
              will and won't work, building things that last, and treating every client's mission
              like it matters — because it does.
            </p>
          </AnimatedSection>
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
              Ready to Work Together?
            </h2>
            <p
              className="text-white/40 mb-12"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Let's discuss how we can elevate your organization's digital presence.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Start a Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}