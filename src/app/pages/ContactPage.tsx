import { ArrowRight, Mail, Calendar, MessageCircle } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const BOOKING_URL = "https://calendar.app.google/SWzpdnhRzBQ5JfPp9";
const EMAIL = "partnerships@kindsupplydigital.com";

export function ContactPage() {
  return (
    <div>
      <SEOHead
        title="Get Your Free Consultation | Kind Supply Digital"
        description="Book a free strategy call with Kind Supply Digital, or text us directly. We build client-acquisition websites, lead-rescue CRM systems, and growth marketing for home services, behavioral health, legal, and dental businesses. Response within 24 hours."
        keywords="contact Kind Supply Digital, book a call, free consultation, website quote, CRM setup, free website audit, Northern Virginia marketing agency"
        canonical="https://kindsupplydigital.com/contact"
        structuredData={{
          "@type": "ContactPage",
          mainEntity: {
            "@type": "Organization",
            name: "Kind Supply Digital",
            email: EMAIL,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              email: EMAIL,
              areaServed: "US",
              availableLanguage: "English",
            },
          },
        }}
      />
      {/* Header */}
      <section className="pt-32 pb-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/50 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Contact
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
              Let's Talk About Your Growth
            </h1>
            <p
              className="text-white/70 max-w-2xl mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Whether you're losing calls after hours, redesigning your website, or ready to scale
              with ads and SEO &mdash; we'd love to hear what you're working on.
            </p>
            <div className="mb-6">
              <p
                className="text-blue-300/30 uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
              >
                What to expect
              </p>
              <ul className="space-y-2">
                {[
                  "A 20–30 minute conversation about your goals and challenges",
                  "An honest assessment of your current digital presence",
                  "Clear recommendations on where to focus first",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-white/50 flex items-start gap-2"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
                  >
                    <span className="text-blue-400/30 mt-1 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="text-white/35"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
            >
              No pressure, no cookie-cutter pitch. Just a real conversation about what growth could
              look like for your organization.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Ways to connect */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Book a call — primary */}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-8 border border-blue-400/40 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400/70 transition-all duration-300 min-h-[240px]"
              >
                <div>
                  <div className="w-12 h-12 mb-6 rounded-full border border-blue-400/40 flex items-center justify-center">
                    <Calendar size={20} className="text-blue-300" />
                  </div>
                  <h2
                    className="text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}
                  >
                    Book a strategy call
                  </h2>
                  <p
                    className="text-white/60"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    Grab a time that works for you. The fastest way to get started.
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-blue-300 mt-6"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.03em" }}
                >
                  Pick a time
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* Text us — chat widget */}
              <div className="flex flex-col justify-between p-8 border border-white/15 bg-white/5 min-h-[240px]">
                <div>
                  <div className="w-12 h-12 mb-6 rounded-full border border-white/20 flex items-center justify-center">
                    <MessageCircle size={20} className="text-blue-300/80" />
                  </div>
                  <h2
                    className="text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}
                  >
                    Text us
                  </h2>
                  <p
                    className="text-white/60"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    Tap the chat bubble in the bottom corner and send us a message — we'll text you
                    right back.
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-white/45 mt-6"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.03em" }}
                >
                  Bottom-right corner ↘
                </span>
              </div>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}`}
                className="group flex flex-col justify-between p-8 border border-white/15 bg-white/5 hover:border-blue-400/40 hover:bg-white/[0.07] transition-all duration-300 min-h-[240px]"
              >
                <div>
                  <div className="w-12 h-12 mb-6 rounded-full border border-white/20 flex items-center justify-center">
                    <Mail size={20} className="text-blue-300/80" />
                  </div>
                  <h2
                    className="text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}
                  >
                    Email us
                  </h2>
                  <p
                    className="text-white/60"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    Prefer email? Send us the details and we'll respond within 24 hours.
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-blue-300/80 mt-6 break-all"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.03em" }}
                >
                  {EMAIL}
                  <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
