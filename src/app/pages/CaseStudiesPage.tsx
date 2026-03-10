import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

const caseStudies = [
  {
    title: "Mental Health Clinic Website Redesign & Local SEO — 12 Locations",
    industry: "Mental Health",
    tags: ["Website Redesign", "Local SEO", "Patient Acquisition"],
    challenge:
      "A multi-location counseling practice with 12 offices was nearly invisible online. The website was outdated, pages weren't ranking for local search terms like \"counseling near me\" or \"therapist in [city],\" and there was no way for patients to book appointments online. New patient inquiries had flatlined.",
    approach:
      "We rebuilt the site from the ground up with a focus on local search performance and patient experience. Each location received its own optimized landing page with location-specific content, Google Business Profile integration, and schema markup. We added a HIPAA-compliant online scheduling system so patients could book directly from search results.",
    tactics: [
      "Location-specific landing pages targeting \"therapist near me\" and city-level keywords",
      "Google Business Profile optimization for all 12 offices",
      "LocalBusiness schema markup on every location page",
      "Online appointment booking integrated into the site",
      "Mobile-first responsive redesign",
    ],
    result:
      "New patient inquiries increased by 340% across all 12 locations within 4 months. The practice now ranks on page one for local therapy-related searches in every market they serve.",
    image:
      "https://images.unsplash.com/photo-1711343777918-6d395c16e37f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY2xpbmljJTIwaGFsbHdheSUyMGJyaWdodCUyMHdlbGNvbWluZ3xlbnwxfHx8fDE3NzMxMTE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Substance Abuse Treatment Center — Website & Lead Generation",
    industry: "Substance Abuse Recovery",
    tags: ["Custom Development", "Lead Generation", "Content Strategy"],
    challenge:
      "A substance abuse treatment facility was struggling to compete online against larger national networks with massive ad budgets. The center had minimal digital presence — no content strategy, no lead tracking, and no way to measure what was actually driving admissions inquiries.",
    approach:
      "We built a custom website designed specifically for addiction treatment marketing. Every page was structured around high-intent search terms like \"drug rehab near me,\" \"alcohol treatment program,\" and \"IOP for substance abuse.\" We created conversion-optimized landing pages for each service line and installed comprehensive analytics so the team could see exactly where inquiries were coming from.",
    tactics: [
      "Addiction-specific content strategy targeting high-intent treatment keywords",
      "Conversion-optimized landing pages for each program (IOP, detox, outpatient)",
      "Call tracking and form analytics to measure cost per inquiry",
      "Blog content targeting long-tail searches like \"signs you need addiction treatment\"",
      "Google Ads integration with landing page A/B testing",
    ],
    result:
      "The facility went from a handful of online inquiries to generating 180+ qualified admissions inquiries per month within 90 days of launch. Cost per lead dropped significantly as organic traffic grew.",
    image:
      "https://images.unsplash.com/photo-1615397987782-c7cb268de9ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3YWxraW5nJTIwdG93YXJkJTIwbGlnaHQlMjBzaWxob3VldHRlJTIwcmVjb3ZlcnklMjBmcmVlZG9tfGVufDF8fHx8MTc3MzEwOTcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "DDA & Assisted Living Facility — Website Redesign & Family Outreach",
    industry: "DDA / Assisted Living",
    tags: ["Full Redesign", "Growth Infrastructure", "Family Outreach"],
    challenge:
      "A family-owned DDA and assisted living provider needed a website that could build trust with families researching care options for loved ones. The existing site felt clinical and impersonal — it wasn't reflecting the warmth and quality of care the facility actually provided. Families were visiting once and leaving without taking action.",
    approach:
      "We designed a warm, trust-centered experience that speaks directly to families. The centerpiece is an interactive virtual tour so families can explore the facility from home before scheduling a visit. We built a family resources hub with guides on topics like \"how to choose an assisted living facility\" and \"understanding DDA services,\" and added a referral partner outreach system to strengthen relationships with case managers and social workers.",
    tactics: [
      "Trust-building design with real photography and family testimonials",
      "Interactive virtual tour embedded on the homepage",
      "Family resources hub targeting informational search queries",
      "Referral partner portal for case managers and discharge planners",
      "Local SEO targeting \"assisted living near me\" and \"DDA services in [state]\"",
    ],
    result:
      "Facility tour bookings doubled and family engagement improved by 210% in the first quarter. The resources hub now drives consistent organic traffic from families in the early research phase.",
    image:
      "https://images.unsplash.com/photo-1589061434060-a05a5335bfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY2FyZWdpdmVyJTIwaG9sZGluZyUyMGVsZGVybHklMjBwZXJzb24lMjBoYW5kJTIwZ2VudGxlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzMxMDk3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Behavioral Health Provider Group — Scalable Platform & Referral System",
    industry: "Behavioral Health",
    tags: ["Platform Architecture", "Multi-Service", "Referral Systems"],
    challenge:
      "A growing behavioral health practice was expanding across multiple service lines — therapy, psychiatry, and specialized programs — but their website couldn't keep up. The brand felt fragmented, and there was no system in place to manage referrals from physicians, hospitals, and community partners.",
    approach:
      "We built a scalable platform that unifies the brand across all service lines while giving each one a dedicated, keyword-optimized landing page. Every therapist and provider received a professional profile page designed to build patient confidence. We integrated a referral management system so partners could submit and track referrals directly through the site.",
    tactics: [
      "Scalable site architecture designed to grow with the practice",
      "Service-specific landing pages (therapy, psychiatry, group programs)",
      "Individual provider profile pages with credentials and specialties",
      "Integrated referral management portal for partner organizations",
      "Structured data markup for healthcare provider schema",
    ],
    result:
      "Qualified referral inquiries increased by 190% and patient acquisition cost decreased by 35%. The platform now supports seamless expansion as the group adds new locations and service lines.",
    image:
      "https://images.unsplash.com/photo-1627909119251-394e3dadeaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMHRoZXJhcHklMjBzZXNzaW9uJTIwY2lyY2xlJTIwc3VwcG9ydGl2ZSUyMGNvbm5lY3Rpb258ZW58MXx8fHwxNzczMTEwMTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const faqs = [
  {
    q: "How long does a behavioral health website redesign take?",
    a: "Most redesign projects take 4–6 weeks from kickoff to launch, depending on the scope. A single-location practice site is faster; multi-location builds with custom integrations like referral portals or online scheduling take longer.",
  },
  {
    q: "What digital marketing strategies work best for treatment centers?",
    a: "A combination of a conversion-optimized website, local SEO, targeted content marketing, and paid search ads tends to produce the strongest results. The key is building a system where every piece works together — not just running isolated campaigns.",
  },
  {
    q: "How can my mental health practice get more patients online?",
    a: "Start with a website that's optimized for local search terms your ideal patients are actually typing into Google. Add online scheduling, make sure your Google Business Profile is fully optimized, and create content that answers the questions people have before they book an appointment.",
  },
  {
    q: "Do you work with practices outside of behavioral health?",
    a: "Our specialty is behavioral health and human services — that includes mental health practices, substance abuse treatment centers, DDA providers, assisted living facilities, and related organizations. This focus means we understand your audience, your compliance needs, and what actually drives growth in your space.",
  },
  {
    q: "What does it cost to work with Kind Supply Digital?",
    a: "Every project is scoped based on your goals, current digital presence, and growth targets. We offer a free consultation to understand your situation and provide a clear proposal. No cookie-cutter packages.",
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span
          className="text-white/70 group-hover:text-white transition-colors pr-8"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500 }}
        >
          {faq.q}
        </span>
        <ChevronDown
          size={18}
          className={`text-blue-300/40 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p
          className="text-white/40"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.8" }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export function CaseStudiesPage() {
  return (
    <div>
      <SEOHead
        title="Behavioral Health Marketing Case Studies | Kind Supply Digital"
        description="See how Kind Supply Digital helps behavioral health providers, treatment centers, and assisted living facilities grow with web design, SEO, and digital marketing. Real results: 340% increase in patient inquiries, 180+ monthly admissions, 210% family engagement growth."
        keywords="behavioral health marketing results, treatment center case studies, mental health clinic website results, patient acquisition case study, DDA website design results, healthcare SEO results, substance abuse center marketing, assisted living website case study"
        canonical="https://kindsupplydigital.com/case-studies"
        structuredData={{
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
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
              Portfolio
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
              Proven Results for Behavioral Health & Human Services Providers
            </h1>
            <p
              className="text-white/40 max-w-3xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Kind Supply Digital partners with behavioral health practices, treatment centers, and
              human services organizations to build digital systems that drive real growth. From full
              website redesigns to local SEO and lead generation, we deliver measurable results — not
              just pretty pages.
            </p>
            <p
              className="text-blue-200/40 mt-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500 }}
            >
              Here's what that looks like in practice.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {caseStudies.map((cs, i) => (
            <AnimatedSection key={cs.title} delay={0.1}>
              <div className={`py-20 ${i < caseStudies.length - 1 ? "border-b border-white/5" : ""}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  <div className="aspect-[4/3] overflow-hidden bg-[#162036] order-2 lg:order-1 rounded-sm">
                    <img
                      src={cs.image}
                      alt={`${cs.title} — ${cs.industry} case study by Kind Supply Digital`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-center order-1 lg:order-2">
                    <span
                      className="text-blue-300/25 uppercase tracking-[0.2em] mb-4"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
                    >
                      {cs.industry}
                    </span>
                    <h2
                      className="text-white mb-6"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {cs.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {cs.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 border border-blue-400/10 text-blue-200/30"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.03em" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Section */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                  <div>
                    <p
                      className="text-blue-300/20 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      The Challenge
                    </p>
                    <p
                      className="text-white/40"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                    >
                      {cs.challenge}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-blue-300/20 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      Our Approach
                    </p>
                    <p
                      className="text-white/40 mb-4"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                    >
                      {cs.approach}
                    </p>
                    <p
                      className="text-blue-300/20 uppercase tracking-[0.15em] mb-2 mt-6"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 600 }}
                    >
                      Key Tactics
                    </p>
                    <ul className="space-y-2">
                      {cs.tactics.map((t) => (
                        <li
                          key={t}
                          className="text-white/35 flex items-start gap-2"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", lineHeight: "1.6" }}
                        >
                          <span className="text-blue-400/30 mt-1 shrink-0">—</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p
                      className="text-blue-300/20 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                    >
                      The Result
                    </p>
                    <p
                      className="text-blue-100/50"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.7" }}
                    >
                      {cs.result}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              FAQ
            </p>
            <h2
              className="text-white mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
              }}
            >
              Frequently Asked Questions
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div>
              {faqs.map((faq) => (
                <FAQItem key={faq.q} faq={faq} />
              ))}
            </div>
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
              Ready to Grow Your Practice?
            </h2>
            <p
              className="text-white/40 mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Let's talk about how Kind Supply Digital can build the digital growth system your
              behavioral health organization needs.
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