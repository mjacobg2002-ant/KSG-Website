import { Link } from "react-router";
import { ArrowRight, Code2, Search, BarChart3, RefreshCw, FileText, PhoneMissed, MapPin } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const services = [
  {
    icon: Code2,
    title: "Client-Acquisition Websites",
    desc: "Your website is your front door — whether the visitor is a homeowner with a burst pipe or a family researching treatment options. We build custom, mobile-first sites designed to convert: click-to-call in the thumb zone, booking in two taps, and every form wired straight into follow-up. For healthcare clients, every build is HIPAA-conscious from the ground up.",
    bestFor:
      "Businesses launching a new site, companies with outdated websites that don't convert, multi-location organizations needing a unified platform.",
  },
  {
    icon: PhoneMissed,
    title: "CRM & Lead Rescue System",
    desc: "The moment a call goes unanswered, your customer gets a text back in under 60 seconds. Routine jobs book themselves, emergencies get flagged to your phone, and every call, text, and form fill lands in one pipeline with a dollar value attached. Live in seven days — you keep your number and touch essentially nothing.",
    bestFor:
      "Any business that lives by the phone: after-hours emergency trades, law firms where the first responder signs the case, practices losing new-patient calls to voicemail.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile Buildout",
    desc: "For local search, your GBP is often more important than your website. We build and optimize your profile end to end — categories, services, photos, posts, Q&A, and review strategy — so you show up in the map pack when someone nearby searches for what you do.",
    bestFor:
      "Businesses invisible in the local map pack, companies with unclaimed or half-finished profiles, multi-location brands needing consistent listings.",
  },
  {
    icon: Search,
    title: "Keyword Analytics & SEO",
    desc: "We research exactly what your customers type into Google — and what it costs to win those terms — then build the pages, content, and technical foundation to rank for them. Location pages, service pages, schema, and monthly reporting that shows movement, not vanity metrics.",
    bestFor:
      "Businesses not ranking for their core local terms, organizations competing against bigger networks, anyone investing in growth that compounds.",
  },
  {
    icon: BarChart3,
    title: "Google & Meta Ads Management",
    desc: "Targeted campaigns that drive qualified inquiries — not just clicks. Every campaign points into a funnel that actually answers, with full conversion tracking so you know your cost per lead and the return on every dollar.",
    bestFor:
      "Trades needing jobs this month, treatment centers needing admissions inquiries, practices filling new provider schedules, businesses entering new markets.",
  },
  {
    icon: FileText,
    title: "Content Strategy & SEO Blogging",
    desc: "Educational content that ranks on Google and builds trust with the people searching for you. We research what your audience actually asks and create content that answers it — organic traffic that compounds over time.",
    bestFor:
      "Businesses investing in long-term organic growth, organizations competing on high-value keywords, brands building authority in their market.",
  },
  {
    icon: RefreshCw,
    title: "Review & Referral Automation",
    desc: "Every completed job or discharged client triggers the right follow-up automatically — review requests, referral touchpoints, and reactivation campaigns that turn your existing contact list back into booked work.",
    bestFor:
      "Businesses with great work but few reviews, provider groups with referral-based growth, companies sitting on a customer list nobody has called in a year.",
  },
];

export function ServicesPage() {
  return (
    <div>
      <SEOHead
        title="Services — Websites, CRM, SEO, GBP & Ads for Service Businesses | Kind Supply Digital"
        description="Client-acquisition websites, missed-call text-back CRM systems, Google Business Profile buildout, keyword analytics, SEO, and paid ads management for home services, behavioral health, legal, and dental businesses."
        keywords="client acquisition website, missed call text back, CRM for home services, Google Business Profile optimization, keyword analytics, local SEO agency, Google Ads management, behavioral health marketing, HVAC marketing, law firm lead generation, dental marketing"
        canonical="https://kindsupplydigital.com/services"
        structuredData={{
          "@type": "Service",
          provider: { "@type": "Organization", name: "Kind Supply Digital" },
          serviceType: "Digital Marketing & Lead System Services",
          areaServed: { "@type": "Country", name: "United States" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Kind Supply Digital Services",
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
              The Services That Built Our Name, Now for Every Niche We Serve
            </h1>
            <p
              className="text-white/40 max-w-3xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Everything we've delivered for behavioral health providers &mdash; websites, SEO,
              Google Business Profiles, paid ads, content &mdash; now available to HVAC, home
              services, law firms, and dental practices. Plus our newest offering: the
              Lead Rescue System.
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
              Book a free consultation and we'll audit your current site, your Google presence,
              and what happens when someone calls you after hours &mdash; then recommend a clear path forward.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Get Your Free Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}