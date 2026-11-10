import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowDown, Plus, Minus } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead, SITE } from "../components/SEOHead";
import { DevicePreview } from "../components/dental/DevicePreview";
import { IntakeForm, type IntakeField } from "../components/dental/IntakeForm";
import { westparkServicePage, westparkTechnologyPage } from "../components/dental/westparkShots";
import { dentalFaqs } from "../components/dental/dentalFaq";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  PACKAGE,
  SHOW_STANDALONE_COMPARISON,
  STANDALONE,
  standaloneSixMonthTotal,
  usd,
} from "../components/dental/dentalConfig";

/* ------------------------------------------------------------------ */
/* Shared type styles — the same system as the rest of the site.       */
/* ------------------------------------------------------------------ */
const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";
const eyebrow = { fontFamily: INTER, fontSize: "0.7rem", fontWeight: 500 } as const;
const h2Style = { fontFamily: PLAYFAIR, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, lineHeight: 1.2 } as const;
const leadStyle = { fontFamily: INTER, fontSize: "1rem", lineHeight: 1.8 } as const;
const bodySm = { fontFamily: INTER, fontSize: "0.9rem", lineHeight: 1.75 } as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-blue-300/70 uppercase tracking-[0.3em] mb-5" style={eyebrow}>
      {children}
    </p>
  );
}

const PAGE_URL = `${SITE}/dental-marketing`;

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
const indicators = ["Custom Website Included", "Ongoing SEO", "Google Ads Management", "Transparent Monthly Reporting"];

const caseMetrics = [
  {
    value: "13 → 19",
    label: "Online bookings from the practice website",
    detail:
      "August 2026 vs. September 2026 — a 46% month-over-month increase. Calendar months, from the practice’s booking platform (“Your website” channel).",
  },
  {
    value: "24",
    label: "Non-branded searches averaging Page 1",
    detail:
      "Searches such as “tooth extractions near me” and “dentist 22102.” Google Search Console, 7-day window ending October 5, 2026.",
  },
  {
    value: "2.2×",
    label: "Daily Google impressions in one week",
    detail: "From 122 on September 26 to 268 on October 2, 2026. Google Search Console.",
  },
];

const caseNotes = [
  "Website bookings are appointments booked online through the practice’s booking platform and attributed to its website. They don’t include phone calls or bookings from other channels.",
  "September includes 11 days before the new site went live on September 12. Seasonality and the practice’s own efforts also affect bookings, so we present this as what happened — not as proof that the website alone caused it.",
  "These are website-booking and organic search figures. They are not Google Ads results, and we don’t combine them with advertising data.",
  "Search Console positions are averages and vary by searcher location and device. No projections are shown here.",
];

type Included = { title: string; standalone?: string; note?: string; items: string[] };
const included: Included[] = [
  {
    title: "Custom Dental Website",
    standalone: SHOW_STANDALONE_COMPARISON ? `Separately: ${usd(STANDALONE.websiteBuild)} build fee — waived` : undefined,
    items: [
      "Custom, mobile-responsive design",
      "Up to 20 pages, including doctor and individual service pages",
      "Conversion-focused layouts with a clear path to booking",
      "Online appointment-request or booking integration",
      "Technical SEO foundations",
      "Analytics and conversion tracking",
      "Two rounds of design revisions",
    ],
    note: "Provided under license during the agreement — see the website ownership note below.",
  },
  {
    title: "Ongoing Search Engine Optimization",
    standalone: SHOW_STANDALONE_COMPARISON ? `Separately: ${usd(STANDALONE.seoMonthly)}/month` : undefined,
    items: [
      "Technical and on-page SEO",
      "Local SEO for the neighborhoods you serve",
      "Google Business Profile optimization",
      "Local citation management",
      "Indexing monitoring",
      "Ongoing service-page improvements",
    ],
  },
  {
    title: "Google Ads Management",
    standalone: SHOW_STANDALONE_COMPARISON ? `Separately: ${usd(STANDALONE.adsManagementMonthly)}/month management — waived` : undefined,
    items: [
      "Account audit and configuration",
      "Campaign strategy and setup",
      "Keyword and negative-keyword management",
      "Ad groups aligned with your service pages",
      "Search ad copy and ongoing testing",
      "Conversion tracking",
      "Bid and budget optimization within the budget you approve",
    ],
  },
  {
    title: "Reporting, Hosting & Support",
    items: [
      "Monthly written marketing report",
      "SEO and Google Ads performance review",
      "Hosting, security, and platform updates",
      "Minor website edits, up to five hours a month",
      "Lead and appointment tracking where your booking system allows it",
    ],
  },
];

const optionalServices = [
  {
    title: "Practice photography",
    body: "Original photographs of your office, treatment rooms, and reception — so patients see your actual practice, not stock images.",
  },
  {
    title: "Dentist & team portraits",
    body: "Consistent, professional portraits for your doctor and team pages.",
  },
  {
    title: "Office video & brand content",
    body: "Short videos for your website, Google Business Profile, and social channels.",
  },
];

const optionalTerms = [
  "On-site work may require travel. Travel, lodging, and production needs are part of the quote.",
  "Every additional charge is approved by you in writing before any work begins.",
  "Additional office locations are scoped and priced under their own agreement.",
  "Large custom functionality — patient portals, e-commerce, custom software — is quoted separately.",
];

const principles = [
  { title: "A direct line", body: "You talk to the person accountable for your results, not an account manager relaying messages." },
  { title: "Scope in writing", body: "What’s included, what isn’t, and what happens after six months are all in the agreement — and on this page." },
  { title: "Reporting you can read", body: "A monthly written report in plain language, with actual numbers and estimates clearly labeled." },
  { title: "One integrated plan", body: "Your website, search, and Google Ads are built to work together — ad groups land on the matching service pages." },
  { title: "Your practice’s brand", body: "We design around your identity and your real office, not a template with your logo dropped in." },
  { title: "Measured by booked patients", body: "Traffic matters only when it turns into appointment requests. That’s what we track and report." },
];

const processSteps = [
  {
    n: "01",
    title: "Discovery and Onboarding",
    body: "We learn your practice, location, goals, services, current digital presence, and the resources available. You share materials and account access within the first ten business days.",
  },
  {
    n: "02",
    title: "Website Design and Development",
    body: "We build the approved website around your practice’s identity, content, and authorized imagery. We aim to launch within 30 days of receiving your materials and approvals.",
  },
  {
    n: "03",
    title: "Search and Advertising Foundations",
    body: "Local SEO, Google Business Profile, conversion tracking, and a Google Ads structure that matches your service pages.",
  },
  {
    n: "04",
    title: "Ongoing Optimization",
    body: "We review campaign performance and search visibility and keep improving the website and acquisition strategy throughout the agreement.",
  },
  {
    n: "05",
    title: "Transparent Reporting",
    body: "A monthly report on what actually happened — never estimates presented as outcomes, and never guarantees we can’t keep.",
  },
];

const enrollmentSteps = [
  "Tell us about your practice and the location you want covered.",
  "We review it personally and confirm the package is the right fit.",
  "You receive the agreement to read in full and accept explicitly.",
  "You pay securely through Stripe — card details never touch our site.",
  "You get a receipt and our onboarding checklist, and we begin.",
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const enrollmentFields: IntakeField[] = [
  { name: "practiceName", label: "Practice name", type: "text", required: true, autoComplete: "organization", half: true },
  { name: "contactName", label: "Your name", type: "text", required: true, autoComplete: "name", half: true },
  { name: "email", label: "Business email", type: "email", required: true, autoComplete: "email", half: true },
  {
    name: "practiceStatus",
    label: "Practice status",
    type: "select",
    required: true,
    options: ["Existing practice", "Opening soon"],
    half: true,
  },
  {
    name: "location",
    label: "Location to be covered",
    type: "text",
    required: true,
    placeholder: "Street address, city, state",
    hint: "The one office this package would cover.",
    autoComplete: "street-address",
  },
  { name: "website", label: "Current website", type: "url", placeholder: "yourpractice.com", autoComplete: "url", half: true },
  {
    name: "locations",
    label: "Total locations",
    type: "select",
    required: true,
    options: ["1", "2", "3 or more"],
    half: true,
  },
  {
    name: "notes",
    label: "Anything we should know",
    type: "textarea",
    maxLength: 800,
    placeholder: "Timing, current marketing, questions about the agreement…",
  },
];

const assessmentFields: IntakeField[] = [
  { name: "practiceName", label: "Practice name", type: "text", required: true, autoComplete: "organization" },
  { name: "website", label: "Website URL", type: "url", placeholder: "yourpractice.com", autoComplete: "url" },
  { name: "city", label: "City", type: "text", required: true, autoComplete: "address-level2", half: true },
  { name: "state", label: "State", type: "select", required: true, options: STATES, half: true },
  { name: "email", label: "Business email", type: "email", required: true, autoComplete: "email" },
  {
    name: "practiceStatus",
    label: "Existing practice or opening soon?",
    type: "select",
    required: true,
    options: ["Existing practice", "Opening soon"],
  },
  {
    name: "concern",
    label: "Main marketing concern",
    type: "select",
    required: true,
    options: [
      "Not enough new patients",
      "Not showing up in local Google searches",
      "Google Ads cost too much for the results",
      "Website is outdated or hard to book from",
      "Preparing to open a new practice",
      "Something else",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQ item                                                             */
/* ------------------------------------------------------------------ */
function FaqItem({ q, a, refText, index }: { q: string; a: string[]; refText?: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const id = `faq-${index}`;
  return (
    <div className="border-b border-white/[0.07]">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-start justify-between gap-6 py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <span
            className="text-white group-hover:text-blue-100 transition-colors"
            style={{ fontFamily: PLAYFAIR, fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 400, lineHeight: 1.4 }}
          >
            {q}
          </span>
          <span className="shrink-0 mt-1 w-7 h-7 border border-white/15 flex items-center justify-center text-blue-300" aria-hidden="true">
            {open ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open} className="pb-7 pr-2 sm:pr-14">
        {a.map((p, i) => (
          <p key={i} className="text-white/65 mb-3 last:mb-0" style={{ ...bodySm, fontSize: "0.94rem" }}>
            {p}
          </p>
        ))}
        {refText ? (
          <p className="text-white/40 mt-3" style={{ fontFamily: INTER, fontSize: "0.72rem", letterSpacing: "0.04em" }}>
            {refText} of the service agreement
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export function DentalMarketingPage() {
  return (
    <div>
      <SEOHead
        title="Dental Marketing Agency: Websites, Dental SEO & Google Ads | Kind Supply Digital"
        description="Dental website design, dental SEO, and Google Ads management for independent practices — one package at $2,000/month on a six-month agreement, with pricing, terms, and real results published up front."
        keywords="dental marketing agency, dental SEO services, dental website design, Google Ads management for dentists, dental practice marketing, new dental practice marketing"
        canonical={PAGE_URL}
        structuredData={[
          {
            "@type": "Service",
            "@id": `${PAGE_URL}#service`,
            name: PACKAGE.name,
            serviceType: "Dental practice marketing",
            description:
              "Custom dental website, ongoing local SEO, Google Ads management, hosting and maintenance, and monthly reporting for one dental practice location.",
            provider: { "@id": `${SITE}/#organization` },
            areaServed: { "@type": "Country", name: "United States" },
            audience: { "@type": "BusinessAudience", audienceType: "Independent dental practices" },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              priceCurrency: "USD",
              price: "2000.00",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "2000.00",
                priceCurrency: "USD",
                unitText: "month",
                billingDuration: { "@type": "QuantitativeValue", value: 6, unitCode: "MON" },
              },
              description: "Six-month agreement for one practice location. Google ad spend is paid directly to Google and is not included.",
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: dentalFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
              { "@type": "ListItem", position: 3, name: "Dental Marketing", item: PAGE_URL },
            ],
          },
        ]}
      />

      {/* ============ HERO ============ */}
      <section
        className="relative pt-16 sm:pt-24 pb-24 lg:pb-32 border-b border-white/5 overflow-hidden"
        aria-labelledby="dental-hero-title"
        style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(202,163,78,0.09) 0%, transparent 60%)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-16 lg:gap-14 items-center">
          <div>
            <Eyebrow>Dental Practice Marketing</Eyebrow>
            <h1
              id="dental-hero-title"
              className="text-white mb-7"
              style={{ fontFamily: PLAYFAIR, fontSize: "clamp(2.6rem, 5.6vw, 4.5rem)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.01em" }}
            >
              More Booked Patients. <span className="text-blue-200/90">Not Just More Clicks.</span>
            </h1>
            <p className="text-white/70 max-w-xl mb-10" style={{ fontFamily: INTER, fontSize: "1.08rem", lineHeight: 1.8 }}>
              Custom dental websites, local SEO, and Google Ads management&mdash;working together to help
              independent practices attract patients and turn interest into scheduled appointments.
            </p>

            <div className="border border-white/10 bg-[#0c1525]/80 mb-10 max-w-xl">
              <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.07]">
                <div>
                  <p className="text-blue-300/75 uppercase tracking-[0.2em] mb-2" style={{ ...eyebrow, fontSize: "0.66rem" }}>
                    {PACKAGE.name}
                  </p>
                  <p className="text-white/65" style={{ fontFamily: INTER, fontSize: "0.86rem", lineHeight: 1.6 }}>
                    Six-month agreement. One dental practice location.
                  </p>
                </div>
                <p className="text-white whitespace-nowrap" style={{ fontFamily: PLAYFAIR, fontSize: "2.4rem", fontWeight: 400, lineHeight: 1 }}>
                  {usd(PACKAGE.monthly)}
                  <span className="text-white/55" style={{ fontFamily: INTER, fontSize: "0.9rem" }}>
                    {" "}
                    /month
                  </span>
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06]" aria-label="Included in the package">
                {indicators.map((t) => (
                  <li key={t} className="bg-[#0c1525] px-6 py-3.5 flex items-center gap-2.5 text-white/75" style={{ fontFamily: INTER, fontSize: "0.8rem" }}>
                    <span className="w-1 h-1 bg-blue-400 shrink-0" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <a
                href="#package"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-all duration-300 group"
                style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
              >
                Explore the Package
                <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/15 text-white/85 hover:border-blue-400/50 hover:text-white transition-all duration-300 group"
                style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
              >
                View Our Dental Work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>

          <figure className="m-0">
            <DevicePreview
              shots={westparkServicePage}
              url="westparkdds.com/services/dental-implants"
              desktopAlt="Westpark Dental Studio's dental implants page on desktop, designed and built by Kind Supply Digital"
              mobileAlt="The same Westpark Dental Studio service page on a phone, with a sticky call and book bar"
              eager
            />
            <figcaption className="text-white/50 mt-2" style={{ fontFamily: INTER, fontSize: "0.76rem", letterSpacing: "0.02em" }}>
              Westpark Dental Studio, Tysons, VA &middot; website by Kind Supply Digital, launched September 2026 &middot; hero photo updated for this preview
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============ CASE STUDY ============ */}
      <section id="work" className="py-28 lg:py-32 border-b border-white/5 scroll-mt-20" aria-labelledby="case-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>Case Study &middot; Westpark Dental Studio &middot; Tysons, VA</Eyebrow>
            <h2 id="case-title" className="text-white mb-6 max-w-3xl" style={h2Style}>
              Real Dental Work. Measurable Results.
            </h2>
            <p className="text-white/60 max-w-2xl mb-16" style={leadStyle}>
              A general and cosmetic practice in Tysons Corner, Virginia. The new website went live on
              September 12, 2026. Here is what changed, with the source and dates for every number.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 mb-px">
            <AnimatedSection className="bg-[#0f172a] p-8 lg:p-10">
              <p className="text-blue-300/70 uppercase tracking-[0.2em] mb-4" style={{ ...eyebrow, fontSize: "0.64rem" }}>
                The challenge
              </p>
              <p className="text-white/70" style={bodySm}>
                Patients rarely search for a practice by name. They search for a treatment and a
                place &mdash; &ldquo;tooth extractions near me,&rdquo; &ldquo;dentist 22102.&rdquo; The goal was
                to make Westpark findable for the services it offers in Tysons and McLean, and to make
                booking the obvious next step on every page.
              </p>
            </AnimatedSection>
            <AnimatedSection className="bg-[#0f172a] p-8 lg:p-10" delay={0.08}>
              <p className="text-blue-300/70 uppercase tracking-[0.2em] mb-4" style={{ ...eyebrow, fontSize: "0.64rem" }}>
                What we built
              </p>
              <ul className="space-y-2.5">
                {[
                  "A new custom website with a dedicated page for each of 22 services",
                  "Online booking linked from every page, plus a sticky call-and-book bar on phones",
                  "Billing, financing, technology, and sterilization pages that answer patients’ questions",
                  "Technical SEO foundations and Google Search Console indexing from day one",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-white/70" style={bodySm}>
                    <span className="text-blue-400/60 shrink-0" aria-hidden="true">&mdash;</span>
                    {t}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-12">
            {caseMetrics.map((m, i) => (
              <AnimatedSection key={m.label} delay={i * 0.08} className="bg-[#0c1525] p-8 lg:p-10">
                <p className="text-blue-300/60 uppercase tracking-[0.15em] mb-4" style={{ fontFamily: INTER, fontSize: "0.62rem", fontWeight: 600 }}>
                  Actual
                </p>
                <p className="text-blue-200 mb-4 whitespace-nowrap" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(2.4rem, 4.4vw, 3.2rem)", fontWeight: 400, lineHeight: 1 }}>
                  {m.value}
                </p>
                <p className="text-white/85 mb-3" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 500, lineHeight: 1.4 }}>
                  {m.label}
                </p>
                <p className="text-white/55" style={{ fontFamily: INTER, fontSize: "0.8rem", lineHeight: 1.65 }}>
                  {m.detail}
                </p>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
            <AnimatedSection>
              <h3 className="text-white mb-5" style={{ fontFamily: PLAYFAIR, fontSize: "1.45rem", fontWeight: 400 }}>
                What these numbers are &mdash; and aren&rsquo;t
              </h3>
              <ul className="space-y-4 mb-10">
                {caseNotes.map((n) => (
                  <li key={n} className="flex gap-3 text-white/60" style={{ ...bodySm, fontSize: "0.86rem" }}>
                    <span className="text-blue-400/60 shrink-0" aria-hidden="true">&mdash;</span>
                    {n}
                  </li>
                ))}
              </ul>
              <a
                href="/westpark-case-study"
                className="inline-flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors group"
                style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.03em" }}
              >
                Read the complete case study, with source screenshots
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <figure className="m-0">
                <DevicePreview
                  shots={westparkTechnologyPage}
                  url="westparkdds.com/technology"
                  desktopAlt="Westpark Dental Studio technology page on desktop"
                  mobileAlt="Westpark Dental Studio technology page on a phone"
                />
              </figure>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ PORTFOLIO ============ */}
      <section id="portfolio" className="py-28 lg:py-32 border-b border-white/5 bg-[#0c1525] scroll-mt-20" aria-labelledby="portfolio-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>Dental Website Work</Eyebrow>
            <h2 id="portfolio-title" className="text-white mb-6 max-w-3xl" style={h2Style}>
              Built for the way patients choose a dentist.
            </h2>
            <p className="text-white/60 max-w-2xl mb-16" style={leadStyle}>
              Every page answers a specific question a patient is asking, and every page makes booking
              easy. This is completed client work.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <article className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-px bg-white/5 border border-white/5">
              <div className="bg-[#0f172a] p-6 sm:p-10 flex items-center">
                <div className="w-full">
                <DevicePreview
                  shots={westparkServicePage}
                  url="westparkdds.com/services/dental-implants"
                  desktopAlt="Westpark Dental Studio service page design on desktop"
                  mobileAlt="Westpark Dental Studio service page design on mobile"
                />
                </div>
              </div>
              <div className="bg-[#0f172a] p-8 sm:p-10 flex flex-col">
                <p className="inline-flex self-start items-center gap-2 border border-blue-400/30 text-blue-200 px-3 py-1 mb-6 uppercase tracking-[0.18em]" style={{ fontFamily: INTER, fontSize: "0.62rem", fontWeight: 600 }}>
                  Client project
                </p>
                <h3 className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.9rem", fontWeight: 400, lineHeight: 1.2 }}>
                  Westpark Dental Studio
                </h3>
                <p className="text-white/55 mb-8" style={{ fontFamily: INTER, fontSize: "0.85rem" }}>
                  General &amp; cosmetic dentistry &middot; Tysons Corner, VA &middot; Launched September 2026
                </p>
                <dl className="space-y-5 mb-8">
                  {[
                    ["Services", "Website design and development, local SEO"],
                    ["Site", "Homepage, 22 service pages, doctor, billing & financing, technology, and sterilization pages"],
                    ["Booking", "Online booking from every page; a sticky call-and-book bar on phones; financing options surfaced on each service page"],
                    ["Design", "A warm, editorial palette and serif typography drawn from the practice’s own identity — not a dental template"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-blue-300/70 uppercase tracking-[0.18em] mb-1.5" style={{ fontFamily: INTER, fontSize: "0.62rem", fontWeight: 600 }}>
                        {k}
                      </dt>
                      <dd className="m-0 text-white/70" style={{ ...bodySm, fontSize: "0.88rem" }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="/westpark-case-study"
                  className="mt-auto inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors group"
                  style={{ fontFamily: INTER, fontSize: "0.86rem", fontWeight: 500, letterSpacing: "0.03em" }}
                >
                  View the case study
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-white/50 mt-8 max-w-3xl" style={{ fontFamily: INTER, fontSize: "0.82rem", lineHeight: 1.75 }}>
              We also design concept sites for practices we&rsquo;re in conversation with. Those belong to
              practices that aren&rsquo;t clients, so we show them privately rather than here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ PACKAGE & PRICING ============ */}
      <section id="package" className="py-28 lg:py-32 border-b border-white/5 scroll-mt-20" aria-labelledby="package-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>Transparent Pricing</Eyebrow>
            <h2 id="package-title" className="text-white mb-6 max-w-3xl" style={h2Style}>
              One package. One price. Published.
            </h2>
            <p className="text-white/60 max-w-2xl mb-16" style={leadStyle}>
              You shouldn&rsquo;t need a sales call to find out what dental marketing costs. Here is
              everything that&rsquo;s included, what isn&rsquo;t, and the terms behind it.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-14 items-start">
            {/* Price panel */}
            <AnimatedSection className="lg:sticky lg:top-28">
              <div className="border border-blue-400/25 bg-[#0c1525]">
                <div className="p-8 sm:p-10 border-b border-white/[0.07]">
                  <p className="text-blue-300/80 uppercase tracking-[0.2em] mb-5" style={{ ...eyebrow, fontSize: "0.66rem" }}>
                    {PACKAGE.name}
                  </p>
                  <p className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(3rem, 6vw, 3.8rem)", fontWeight: 400, lineHeight: 1 }}>
                    {usd(PACKAGE.monthly)}
                    <span className="text-white/55" style={{ fontFamily: INTER, fontSize: "1rem" }}>
                      {" "}
                      /month
                    </span>
                  </p>
                  <p className="text-white/60 mb-0" style={{ fontFamily: INTER, fontSize: "0.88rem" }}>
                    Google ad spend is paid directly to Google, separately.
                  </p>
                </div>
                <dl className="divide-y divide-white/[0.07]">
                  {[
                    ["Agreement", "Six months"],
                    ["Total initial commitment", usd(PACKAGE.total)],
                    ["Scope", "One dental practice location"],
                    ["Billing", "Monthly, from your enrollment date"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6 px-8 sm:px-10 py-4">
                      <dt className="text-white/55" style={{ fontFamily: INTER, fontSize: "0.84rem" }}>
                        {k}
                      </dt>
                      <dd className="m-0 text-white text-right" style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500 }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="p-8 sm:p-10 border-t border-white/[0.07]">
                  <a
                    href="#get-started"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-all duration-300 group"
                    style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
                  >
                    Get Started
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                  <p className="text-white/55 mt-4 text-center" style={{ fontFamily: INTER, fontSize: "0.78rem", lineHeight: 1.6 }}>
                    We confirm the package fits your practice before you see an agreement or pay anything.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* What's included */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-10">
                {included.map((block, i) => (
                  <AnimatedSection key={block.title} delay={(i % 2) * 0.06} className="bg-[#0f172a] p-7 lg:p-8">
                    <h3 className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.3rem", fontWeight: 400, lineHeight: 1.3 }}>
                      {block.title}
                    </h3>
                    {block.standalone ? (
                      <p className="text-white/45 mb-5" style={{ fontFamily: INTER, fontSize: "0.74rem", letterSpacing: "0.02em" }}>
                        {block.standalone}
                      </p>
                    ) : (
                      <p className="text-white/45 mb-5" style={{ fontFamily: INTER, fontSize: "0.74rem", letterSpacing: "0.02em" }}>
                        Included
                      </p>
                    )}
                    <ul className="space-y-2">
                      {block.items.map((it) => (
                        <li key={it} className="flex gap-3 text-white/70" style={{ fontFamily: INTER, fontSize: "0.85rem", lineHeight: 1.6 }}>
                          <span className="mt-[0.6em] w-1 h-1 bg-blue-400/80 shrink-0" aria-hidden="true" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    {block.note ? (
                      <p className="text-white/50 mt-5" style={{ fontFamily: INTER, fontSize: "0.76rem", lineHeight: 1.6 }}>
                        {block.note}
                      </p>
                    ) : null}
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection>
                <div className="border-l-2 border-blue-400/60 bg-blue-500/[0.05] px-6 py-5 mb-10">
                  <p className="text-white mb-1.5" style={{ fontFamily: INTER, fontSize: "0.92rem", fontWeight: 600 }}>
                    Google&rsquo;s advertising charges are not included.
                  </p>
                  <p className="text-white/65" style={{ fontFamily: INTER, fontSize: "0.86rem", lineHeight: 1.7 }}>
                    You pay your ad budget directly to Google from your own account. We set the budget with you
                    and manage it &mdash; we never mark it up or bill it through us.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="border border-white/10 p-7 lg:p-8 mb-10">
                  <h3 className="text-white mb-3" style={{ fontFamily: PLAYFAIR, fontSize: "1.25rem", fontWeight: 400 }}>
                    About website ownership
                  </h3>
                  <p className="text-white/65 mb-3" style={{ fontFamily: INTER, fontSize: "0.86rem", lineHeight: 1.75 }}>
                    The website is provided to you under license while the agreement is in effect; it is not
                    transferred to you automatically. After the six-month commitment is paid, you can keep it
                    hosted with us for {usd(PACKAGE.hostingOnlyMonthly)}/month, continue SEO and Ads month to month,
                    or purchase the website files for a one-time {usd(PACKAGE.websiteFilesPurchase)}. Your domain,
                    content, and Google accounts are always yours.
                  </p>
                  <a href="#faq" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors" style={{ fontFamily: INTER, fontSize: "0.82rem", fontWeight: 500 }}>
                    Ownership, renewal, and transfer details
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </AnimatedSection>

              {SHOW_STANDALONE_COMPARISON ? (
                <AnimatedSection>
                  <h3 className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.25rem", fontWeight: 400 }}>
                    The same services, priced separately
                  </h3>
                  <p className="text-white/55 mb-6" style={{ fontFamily: INTER, fontSize: "0.84rem", lineHeight: 1.7 }}>
                    Over the same six months, at our standard standalone rates.
                  </p>
                  <table className="w-full border-collapse" style={{ fontFamily: INTER, fontSize: "0.88rem" }}>
                    <caption className="sr-only">Standalone pricing compared with the six-month package</caption>
                    <tbody>
                      {[
                        ["Website build", usd(STANDALONE.websiteBuild)],
                        [`SEO (${usd(STANDALONE.seoMonthly)} × 6 months)`, usd(STANDALONE.seoMonthly * PACKAGE.months)],
                        [`Google Ads management (${usd(STANDALONE.adsManagementMonthly)} × 6 months)`, usd(STANDALONE.adsManagementMonthly * PACKAGE.months)],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-white/[0.07]">
                          <th scope="row" className="text-left font-normal text-white/65 py-3 pr-4">
                            {k}
                          </th>
                          <td className="text-right text-white/80 py-3 whitespace-nowrap">{v}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-white/[0.07]">
                        <th scope="row" className="text-left font-normal text-white/65 py-3 pr-4">
                          Separately, six months
                        </th>
                        <td className="text-right text-white/80 py-3 whitespace-nowrap">{usd(standaloneSixMonthTotal)}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-left font-medium text-white py-4 pr-4">
                          {PACKAGE.name}, six months
                        </th>
                        <td className="text-right text-white font-medium py-4 whitespace-nowrap">{usd(PACKAGE.total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </AnimatedSection>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ============ OPTIONAL SERVICES ============ */}
      <section className="py-24 lg:py-28 border-b border-white/5 bg-[#0c1525]" aria-labelledby="optional-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
          <AnimatedSection>
            <Eyebrow>Optional &middot; Quoted Separately</Eyebrow>
            <h2 id="optional-title" className="text-white mb-6" style={{ ...h2Style, fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)" }}>
              Original photography and video, when you want it.
            </h2>
            <p className="text-white/60 mb-8" style={leadStyle}>
              The package doesn&rsquo;t require new photography. For practices that want original, branded
              imagery of their real office and team, we can add it.
            </p>
            <ul className="space-y-3">
              {optionalTerms.map((t) => (
                <li key={t} className="flex gap-3 text-white/60" style={{ ...bodySm, fontSize: "0.86rem" }}>
                  <span className="text-blue-400/60 shrink-0" aria-hidden="true">&mdash;</span>
                  {t}
                </li>
              ))}
            </ul>
          </AnimatedSection>
          <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 self-start">
            {optionalServices.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.06} className="bg-[#0f172a] p-7 lg:p-8">
                <h3 className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.25rem", fontWeight: 400 }}>
                  {s.title}
                </h3>
                <p className="text-white/60" style={{ ...bodySm, fontSize: "0.88rem" }}>
                  {s.body}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="py-28 lg:py-32 border-b border-white/5 scroll-mt-20" aria-labelledby="process-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>How the Six Months Work</Eyebrow>
            <h2 id="process-title" className="text-white mb-16 max-w-3xl" style={h2Style}>
              A clear process, start to finish.
            </h2>
          </AnimatedSection>
          <AnimatedSection>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5 border border-white/5 list-none p-0 m-0">
            {processSteps.map((s) => (
                <li key={s.n} className="bg-[#0f172a] p-7 lg:p-6 xl:p-7">
                  <p className="text-blue-300/80 mb-6" style={{ fontFamily: PLAYFAIR, fontSize: "1.6rem", fontWeight: 400 }}>
                    {s.n}
                  </p>
                  <h3 className="text-white mb-3" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600, lineHeight: 1.4 }}>
                    {s.title}
                  </h3>
                  <p className="text-white/60" style={{ fontFamily: INTER, fontSize: "0.84rem", lineHeight: 1.7 }}>
                    {s.body}
                  </p>
                </li>
            ))}
          </ol>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-white/50 mt-8 max-w-3xl" style={{ fontFamily: INTER, fontSize: "0.8rem", lineHeight: 1.7 }}>
              Launch timing depends on receiving your content, access, and approvals. We don&rsquo;t promise a
              specific patient count, ranking, or date by which results will appear.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ FOUNDER / AGENCY ============ */}
      <section className="py-28 lg:py-32 border-b border-white/5 bg-[#0c1525]" aria-labelledby="founder-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-16">
          <AnimatedSection>
            <Eyebrow>Who You&rsquo;ll Work With</Eyebrow>
            <h2 id="founder-title" className="text-white mb-6" style={{ ...h2Style, fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)" }}>
              An accountable agency, not an account queue.
            </h2>
            <p className="text-white/65 mb-6" style={leadStyle}>
              Kind Supply Digital is led by its founder, Marcel Grisard. When your practice works with us,
              you have a direct line to the person who oversees your strategy and is responsible for the
              work &mdash; your website, your search visibility, and your advertising, as one plan.
            </p>
            <div className="border-t border-white/[0.07] pt-6 mt-8">
              <p className="text-white mb-1" style={{ fontFamily: PLAYFAIR, fontSize: "1.3rem", fontWeight: 400 }}>
                Marcel Grisard
              </p>
              <p className="text-white/55 mb-4" style={{ fontFamily: INTER, fontSize: "0.84rem" }}>
                Founder, Kind Supply Digital
              </p>
              <p className="flex flex-col sm:flex-row sm:gap-6 gap-1" style={{ fontFamily: INTER, fontSize: "0.84rem" }}>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-300 hover:text-blue-200 transition-colors break-all">
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_HREF} className="text-blue-300 hover:text-blue-200 transition-colors">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5 self-start">
            {principles.map((p, i) => (
              <AnimatedSection key={p.title} delay={(i % 2) * 0.06} className="bg-[#0f172a] p-7">
                <h3 className="text-white mb-2" style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600 }}>
                  {p.title}
                </h3>
                <p className="text-white/60" style={{ fontFamily: INTER, fontSize: "0.84rem", lineHeight: 1.7 }}>
                  {p.body}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-28 lg:py-32 border-b border-white/5 scroll-mt-20" aria-labelledby="faq-title">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>Questions, Answered Plainly</Eyebrow>
            <h2 id="faq-title" className="text-white mb-6" style={h2Style}>
              The details, before you ask.
            </h2>
            <p className="text-white/60 mb-12 max-w-2xl" style={leadStyle}>
              Each answer summarizes the service agreement and notes the section it comes from. If an
              answer and the agreement ever differ, the agreement controls.
            </p>
          </AnimatedSection>
          <div className="border-t border-white/[0.07]">
            {dentalFaqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} refText={f.ref} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEXT STEPS ============ */}
      <section id="get-started" className="py-28 lg:py-32 scroll-mt-20" aria-labelledby="next-title">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Eyebrow>Next Steps</Eyebrow>
            <h2 id="next-title" className="text-white mb-6 max-w-3xl" style={h2Style}>
              Two ways to begin. Neither requires a sales call.
            </h2>
            <p className="text-white/60 max-w-2xl mb-16" style={leadStyle}>
              Ready to enroll? Tell us about your practice. Still deciding? Ask for a written assessment
              and read it on your own time.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <AnimatedSection className="bg-[#0f172a] p-7 sm:p-10">
              <div>
                <p className="text-blue-300/75 uppercase tracking-[0.2em] mb-4" style={{ ...eyebrow, fontSize: "0.64rem" }}>
                  Get Started
                </p>
                <h3 className="text-white mb-5" style={{ fontFamily: PLAYFAIR, fontSize: "1.7rem", fontWeight: 400, lineHeight: 1.25 }}>
                  Enroll in the {PACKAGE.name}
                </h3>
                <ol className="space-y-2.5 mb-9 list-none p-0">
                  {enrollmentSteps.map((s, i) => (
                    <li key={s} className="flex gap-4 text-white/65" style={{ fontFamily: INTER, fontSize: "0.86rem", lineHeight: 1.6 }}>
                      <span className="text-blue-300/80 shrink-0 w-5" style={{ fontFamily: PLAYFAIR }}>
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <IntakeForm
                  kind="enrollment"
                  fields={enrollmentFields}
                  submitLabel="Request Enrollment"
                  successTitle="Thank you. We have your request."
                  successBody="We’ll review your practice and reply by email to confirm the package is the right fit. If it is, you’ll receive the service agreement to read and accept, with a secure Stripe checkout. Nothing is charged until you complete that checkout."
                />
              </div>
            </AnimatedSection>

            <AnimatedSection className="bg-[#0f172a] p-7 sm:p-10" delay={0.08}>
              <div id="assessment" className="scroll-mt-28">
                <p className="text-blue-300/75 uppercase tracking-[0.2em] mb-4" style={{ ...eyebrow, fontSize: "0.64rem" }}>
                  No call required
                </p>
                <h3 className="text-white mb-5" style={{ fontFamily: PLAYFAIR, fontSize: "1.7rem", fontWeight: 400, lineHeight: 1.25 }}>
                  Request a Written Practice Growth Assessment
                </h3>
                <p className="text-white/65 mb-9" style={{ fontFamily: INTER, fontSize: "0.88rem", lineHeight: 1.75 }}>
                  We&rsquo;ll review your website, local search presence, and any visible Google Ads, then send
                  a written summary of what we&rsquo;d change and why. No phone number needed.
                </p>
                <IntakeForm
                  kind="assessment"
                  fields={assessmentFields}
                  submitLabel="Request My Assessment"
                  successTitle="Thank you. Your assessment request is in."
                  successBody="We’ll review your practice’s online presence and send your written assessment to the email you provided."
                />
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <p className="text-white/50 mt-10" style={{ fontFamily: INTER, fontSize: "0.82rem", lineHeight: 1.7 }}>
              Prefer to talk it through? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-300 hover:text-blue-200 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>{" "}
              or see{" "}
              <Link to="/services" className="text-blue-300 hover:text-blue-200 underline underline-offset-2">
                all of our services
              </Link>
              .
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
