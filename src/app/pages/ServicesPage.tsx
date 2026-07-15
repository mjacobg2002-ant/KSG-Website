import { Link } from "react-router";
import { ArrowRight, Code2, Search, BarChart3, RefreshCw, FileText } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const services = [
  {
    icon: Code2,
    title: "Website Design & Development",
    desc: "Your website is the front door to your practice. We build custom, mobile-first websites designed to convert visitors into patients — with HIPAA-aware design, online scheduling, and provider profiles that build trust.",
    bestFor:
      "Practices launching a new site, organizations with outdated websites, multi-location groups needing a unified platform.",
  },
  {
    icon: Search,
    title: "Local & National SEO",
    desc: "We make sure your practice shows up when people search for the services you offer — in your city, your state, and beyond. Location-optimized pages, Google Business Profile management, content strategy, and technical SEO.",
    bestFor:
      "Practices not ranking for local search terms, multi-location organizations, treatment centers competing with national networks.",
  },
  {
    icon: BarChart3,
    title: "Lead Generation & Paid Advertising",
    desc: "Targeted Google Ads and social media campaigns that drive qualified inquiries — not just traffic. We set up full conversion tracking so you know your cost per lead and your return on every dollar.",
    bestFor:
      "Treatment centers needing admissions inquiries, practices looking to fill new provider schedules, organizations launching in new markets.",
  },
  {
    icon: RefreshCw,
    title: "Referral Management & Growth Systems",
    desc: "Digital tools to manage referral relationships with hospitals, physicians, and community partners. Partner portals, automated follow-ups, and referral tracking that keeps your pipeline visible.",
    bestFor:
      "Provider groups with referral-based growth, organizations expanding to new locations, practices building partner networks.",
  },
  {
    icon: FileText,
    title: "Content Strategy & SEO Blogging",
    desc: "Educational content that ranks on Google and builds trust with potential patients and families. We research what your audience is searching for and create content that answers those questions — driving organic traffic that compounds over time.",
    bestFor:
      "Practices investing in long-term organic growth, treatment centers competing on high-value keywords, organizations building thought leadership.",
  },
];

export function ServicesPage() {
  return (
    <div>
      <SEOHead
        title="Behavioral Health Marketing Services — Web Design, SEO & Growth | Kind Supply Digital"
        description="Website design, SEO, lead generation, content strategy, and referral systems built specifically for behavioral health providers, treatment centers, DDA facilities, and assisted living organizations. HIPAA-conscious development with measurable results."
        keywords="behavioral health marketing services, mental health clinic SEO, substance abuse center website, DDA facility web design, assisted living website development, HIPAA website design, patient acquisition, healthcare digital marketing, treatment center lead generation"
        canonical="https://kindsupplydigital.com/services"
        structuredData={{
          "@type": "Service",
          provider: { "@type": "Organization", name: "Kind Supply Digital" },
          serviceType: "Behavioral Health Marketing Services",
          areaServed: { "@type": "Country", name: "United States" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Behavioral Health Marketing Services",
            itemListElement: services.map((s, i) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: s.title,
                description: s.desc,
              },
            })),
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
              Services
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
              Services Built for Behavioral Health Growth
            </h1>
            <p
              className="text-white/40 max-w-3xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Every service we offer is designed for one thing: helping behavioral health providers
              reach more people who need care. Here's how we do it.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={0.1}>
              <div
                className={`py-20 ${i < services.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                  <div>
                    <s.icon size={32} className="text-blue-400/25 mb-8" />
                    <h2
                      className="text-white mb-6"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {s.title}
                    </h2>
                    <p
                      className="text-white/40"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full p-8 border border-blue-400/8 hover:border-blue-400/20 transition-colors duration-500">
                      <p
                        className="text-blue-300/30 uppercase tracking-[0.15em] mb-3"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        Best For
                      </p>
                      <p
                        className="text-white/50"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.7" }}
                      >
                        {s.bestFor}
                      </p>
                    </div>
                  </div>
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
              Not Sure Where to Start?
            </h2>
            <p
              className="text-white/40 mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Book a free consultation and we'll audit your current digital presence, identify the
              biggest opportunities, and recommend a clear path forward.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Book a Free Behavioral Health Marketing Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}