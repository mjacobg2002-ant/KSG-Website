import { Link } from "react-router";
import { ArrowRight, PhoneMissed, Code2, Search, BarChart3 } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const workTypes = [
  {
    icon: PhoneMissed,
    title: "Lead Rescue CRM Systems",
    desc: "Missed-call text-back, speed-to-lead automation, and pipeline tracking — configured, carrier-registered, and live in seven days on the client's existing number.",
  },
  {
    icon: Code2,
    title: "Client-Acquisition Websites",
    desc: "Full rebuilds for trades, practices, and firms — click-to-call in the thumb zone, booking in two taps, and every form wired into automated follow-up.",
  },
  {
    icon: Search,
    title: "SEO & Google Business Profile",
    desc: "Keyword research, service-area pages, and end-to-end GBP buildouts that put businesses in the map pack for the searches that actually book jobs.",
  },
  {
    icon: BarChart3,
    title: "Paid Ads & Growth Campaigns",
    desc: "Google and Meta campaigns with full conversion tracking, pointed into funnels that answer in under 60 seconds instead of leaking into voicemail.",
  },
];

const verticals = [
  "Plumbing & HVAC",
  "Roofing & Home Services",
  "Behavioral Health",
  "Law Firms",
  "Dental Practices",
];

export function CaseStudiesPage() {
  return (
    <div>
      <SEOHead
        title="Our Work | Kind Supply Digital"
        description="Websites, lead rescue CRM systems, SEO, and growth campaigns built by Kind Supply Digital for home services, behavioral health, legal, and dental businesses."
        keywords="Kind Supply Digital work, client acquisition website examples, missed call text back system, local service business marketing results"
        canonical="https://kindsupplydigital.com/case-studies"
      />

      {/* Header */}
      <section className="pt-32 pb-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Our Work
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
              We'd Rather Show You Than Tell You
            </h1>
            <p
              className="text-white/40 max-w-3xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Detailed case studies with real client numbers are on the way &mdash; we publish
              results with permission, not projections. In the meantime, here's what we build,
              and the fastest proof we can offer: book an audit and we'll run the system live
              on your own phone number before you pay for anything.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What we build */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {workTypes.map((w, i) => (
              <AnimatedSection key={w.title} delay={i * 0.1}>
                <div className="bg-[#0f172a] p-10 lg:p-14 group hover:bg-[#162036] transition-colors duration-500 h-full">
                  <w.icon
                    size={28}
                    className="text-blue-400/25 mb-8 group-hover:text-blue-400/60 transition-colors duration-500"
                  />
                  <h3
                    className="text-white mb-4"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.15rem", fontWeight: 500 }}
                  >
                    {w.title}
                  </h3>
                  <p
                    className="text-white/40"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    {w.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
              {verticals.map((v) => (
                <span
                  key={v}
                  className="px-5 py-2.5 border border-blue-400/10 text-blue-200/40"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}
                >
                  {v}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
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
              The Best Case Study Is Your Own Phone Line
            </h2>
            <p
              className="text-white/40 mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Call your business after hours tonight. If nothing texts you back, that's
              what every customer experiences. Book 15 minutes and we'll show you the fix
              running live on your number.
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
