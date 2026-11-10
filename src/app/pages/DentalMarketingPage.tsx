import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowDown, Plus, Minus } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead, SITE } from "../components/SEOHead";
import { DevicePreview } from "../components/dental/DevicePreview";
import { IntakeForm, type IntakeField } from "../components/dental/IntakeForm";
import { ResponsivePhoto } from "../components/dental/ResponsivePhoto";
import { StickyAssessmentCTA } from "../components/dental/StickyAssessmentCTA";
import { photos, westparkHomeShots } from "../components/dental/westparkMedia";
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
/* Type system — same families as the rest of the site                 */
/* ------------------------------------------------------------------ */
const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";
const CREAM = "#f4f0e7";
const NAVY = "#0f172a";
/** Gold dark enough for text on cream (5.4:1). */
const GOLD_ON_CREAM = "#7a5c26";

const eyebrowStyle = { fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" } as const;
const display = (size: string) => ({ fontFamily: PLAYFAIR, fontSize: size, fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.015em" }) as const;
const body = (size = "1rem", lh = 1.75) => ({ fontFamily: INTER, fontSize: size, lineHeight: lh }) as const;

function Eyebrow({ children, onCream = false }: { children: ReactNode; onCream?: boolean }) {
  return (
    <p className={`uppercase mb-6 ${onCream ? "" : "text-blue-300/80"}`} style={{ ...eyebrowStyle, color: onCream ? GOLD_ON_CREAM : undefined }}>
      {children}
    </p>
  );
}

const PAGE_URL = `${SITE}/dental-marketing`;
const HERO_ID = "dental-hero";
const ASSESSMENT_ID = "assessment";

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
const results = [
  {
    value: "+46%",
    label: "Online bookings from the practice website",
    detail: "13 in August → 19 in September 2026, the month the new site launched",
  },
  {
    value: "24",
    label: "Non-branded searches averaging page one of Google",
    detail: "Search Console, 7 days ending October 5, 2026",
  },
  {
    value: "2.2×",
    label: "Daily Google impressions in one week",
    detail: "122 on September 26 → 268 on October 2, 2026",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Discovery and onboarding",
    body: "Your practice, location, goals, services, and current presence. You share materials and account access within the first ten business days.",
  },
  {
    n: "02",
    title: "Website design and development",
    body: "Built around your identity, content, and authorized photography. We aim to launch within 30 days of receiving your materials and approvals.",
  },
  {
    n: "03",
    title: "Search and advertising foundations",
    body: "Local SEO, Google Business Profile, conversion tracking, and Google Ads ad groups that land on the matching service pages.",
  },
  {
    n: "04",
    title: "Ongoing optimization",
    body: "We review campaign performance and search visibility every month and keep improving the website and strategy.",
  },
  {
    n: "05",
    title: "Transparent reporting",
    body: "A written monthly report on what actually happened. Estimates are labeled as estimates; nothing is guaranteed that can’t be.",
  },
];

const newPractice = [
  {
    title: "A website ready before opening day",
    body: "Designed, written, and taking appointment requests before the first patient walks in — so early word of mouth has somewhere to land.",
  },
  {
    title: "Local search groundwork",
    body: "Service pages, citations, and your Google Business Profile prepared in advance, so the practice can start building visibility as soon as its address can be verified.",
  },
  {
    title: "Launch advertising, timed to your schedule",
    body: "Google Ads campaigns built ahead of time and switched on when you’re ready to see patients, on a budget you approve and pay to Google directly.",
  },
];

const included = [
  ["Custom dental website", "Up to 20 pages, online booking or appointment requests, analytics, two rounds of revisions"],
  ["Ongoing local SEO", "Technical and on-page SEO, Google Business Profile optimization, local citations"],
  ["Google Ads management", "Setup, keywords and negatives, ad copy, conversion tracking, budget optimization"],
  ["Hosting and maintenance", "Security and platform updates, plus up to five hours of minor edits a month"],
  ["Monthly written report", "Website traffic, search visibility, and Google Ads performance"],
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
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  return (
    <div className="border-b border-white/10">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-start justify-between gap-6 py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <span className="text-white group-hover:text-blue-100 transition-colors" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(1.1rem, 2vw, 1.35rem)", fontWeight: 400, lineHeight: 1.4 }}>
            {q}
          </span>
          <span className="shrink-0 mt-1 text-blue-300" aria-hidden="true">
            {open ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open} className="pb-8 pr-2 sm:pr-16">
        {a.map((p, i) => (
          <p key={i} className="text-white/70 mb-3 last:mb-0" style={body("0.98rem", 1.8)}>
            {p}
          </p>
        ))}
        {refText ? (
          <p className="text-white/45 mt-3" style={body("0.78rem")}>
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
  // Enrollment is the secondary path: collapsed until asked for (or linked to).
  const [enrollOpen, setEnrollOpen] = useState(false);
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#enroll") setEnrollOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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
      <section id={HERO_ID} className="relative overflow-hidden" aria-labelledby="dental-hero-title">
        <div className="lg:grid lg:grid-cols-12 lg:min-h-[calc(100svh-5rem)]">
          <div className="lg:col-span-7 flex items-center">
            <div className="w-full max-w-3xl px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-14 pt-16 sm:pt-20 pb-14 lg:py-24">
              <p className="uppercase mb-8 text-blue-300/80" style={eyebrowStyle}>
                Dental Practice Marketing
              </p>
              <h1 id="dental-hero-title" className="text-white mb-8" style={display("clamp(3rem, 6.6vw, 6.2rem)")}>
                More Booked Patients.
                <span className="block text-blue-200/90">
                  Not Just More Clicks.
                </span>
              </h1>
              <p className="text-white/75 max-w-xl mb-10" style={body("1.15rem", 1.7)}>
                Websites, local search, and Google Ads built to work together for independent dental
                practices&mdash;and measured by appointments, not traffic.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 mb-12">
                <a
                  href={`#${ASSESSMENT_ID}`}
                  className="inline-flex items-center justify-center gap-3 min-h-[52px] px-9 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-colors duration-300 group"
                  style={{ fontFamily: INTER, fontSize: "0.92rem", fontWeight: 500, letterSpacing: "0.04em" }}
                >
                  Get a Free Written Assessment
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <a
                  href="#package"
                  className="inline-flex items-center justify-center sm:justify-start gap-2 min-h-[44px] text-white/80 hover:text-white transition-colors"
                  style={{ fontFamily: INTER, fontSize: "0.92rem", fontWeight: 500, letterSpacing: "0.03em" }}
                >
                  Explore the package
                  <ArrowDown size={15} aria-hidden="true" />
                </a>
              </div>
              <p className="text-white/60 border-t border-white/10 pt-6 max-w-xl" style={body("0.9rem", 1.65)}>
                <span className="text-white">{PACKAGE.name}</span> &middot; {usd(PACKAGE.monthly)}/month &middot; six-month
                agreement &middot; one practice location
              </p>
            </div>
          </div>
          <figure className="relative m-0 lg:col-span-5">
            <div className="aspect-[3/2] lg:aspect-auto lg:absolute lg:inset-0">
              <ResponsivePhoto
                photo={photos.roomWide}
                sizes="100vw"
                eager
                className="w-full h-full object-cover"
                art={{ media: "(min-width: 1024px)", photo: photos.roomPortrait, sizes: "42vw" }}
              />
            </div>
            <figcaption
              className="absolute left-0 bottom-0 m-4 lg:m-6 px-3 py-1.5 bg-[#0f172a]/80 backdrop-blur-sm text-white/85"
              style={body("0.74rem", 1.4)}
            >
              Westpark Dental Studio, Tysons Corner &middot; website by Kind Supply Digital
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============ FEATURED PROJECT (cream) ============ */}
      <section id="work" className="scroll-mt-20 text-[#0f172a]" style={{ background: CREAM }} aria-labelledby="work-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 lg:pt-32">
          <AnimatedSection className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 lg:mb-20">
            <div className="lg:col-span-7">
              <Eyebrow onCream>Featured Project</Eyebrow>
              <h2 id="work-title" style={display("clamp(2.6rem, 5.5vw, 4.6rem)")}>
                Westpark Dental Studio
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p style={{ ...body("1.02rem", 1.75), color: "rgba(15,23,42,0.75)" }}>
                A general and cosmetic practice in Tysons Corner, Virginia. We designed and built a new
                website with a page for each of its 22 services and online booking on every page. It
                launched on September 12, 2026.
              </p>
            </div>
          </AnimatedSection>

          {/* Practice photography */}
          <AnimatedSection className="grid grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
            <div className="relative col-span-2 lg:col-span-5 lg:row-span-2 aspect-[4/5] lg:aspect-auto overflow-hidden">
              <div className="absolute inset-0">
                <ResponsivePhoto photo={photos.exterior} sizes="(min-width: 1024px) 38vw, 100vw" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-7 aspect-[16/9] overflow-hidden">
              <ResponsivePhoto photo={photos.reception} sizes="(min-width: 1024px) 55vw, 100vw" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 lg:col-span-3 aspect-square overflow-hidden">
              <ResponsivePhoto photo={photos.sterilization} sizes="(min-width: 1024px) 24vw, 50vw" className="w-full h-full object-cover" />
            </div>
            <div className="relative col-span-1 lg:col-span-4 aspect-square lg:aspect-auto overflow-hidden">
              <div className="absolute inset-0">
              <ResponsivePhoto photo={photos.cerec} sizes="(min-width: 1024px) 31vw, 50vw" className="w-full h-full object-cover" />
              </div>
            </div>
          </AnimatedSection>
          <p className="mt-4" style={{ ...body("0.8rem"), color: "rgba(15,23,42,0.6)" }}>
            Practice photography from the Westpark Dental Studio website, shown with the practice&rsquo;s permission.
          </p>

          {/* Verified results */}
          <div className="mt-24 lg:mt-32 grid lg:grid-cols-12 gap-10 lg:gap-12">
            <AnimatedSection className="lg:col-span-4">
              <Eyebrow onCream>Verified Results</Eyebrow>
              <h3 className="mb-6" style={display("clamp(2rem, 3.4vw, 2.8rem)")}>
                What changed after launch.
              </h3>
              <p style={{ ...body("0.95rem", 1.75), color: "rgba(15,23,42,0.72)" }}>
                Every number below has a source and a date. Website bookings come from the practice&rsquo;s
                booking platform (its &ldquo;Your website&rdquo; channel) and don&rsquo;t include phone calls.
                September includes 11 days before launch, and seasonality also affects bookings, so we
                present this as what happened &mdash; not as proof the website alone caused it. These are
                not Google Ads figures, and no projections are shown.
              </p>
            </AnimatedSection>
            <div className="lg:col-span-8">
              {results.map((r, i) => (
                <AnimatedSection key={r.label} delay={i * 0.06}>
                  <div className={`grid sm:grid-cols-[minmax(9rem,13rem)_1fr] gap-x-10 gap-y-2 items-baseline py-8 ${i ? "border-t border-[#0f172a]/15" : ""}`}>
                    <p className="whitespace-nowrap" style={{ ...display("clamp(3rem, 5.6vw, 4.6rem)"), lineHeight: 1 }}>
                      {r.value}
                    </p>
                    <div>
                      <p className="mb-1.5" style={{ fontFamily: INTER, fontSize: "1.08rem", fontWeight: 500, lineHeight: 1.45 }}>
                        {r.label}
                      </p>
                      <p style={{ ...body("0.92rem", 1.6), color: "rgba(15,23,42,0.65)" }}>{r.detail}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        {/* Website design — navy band inside the featured project */}
        <div className="mt-24 lg:mt-32 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-14 lg:gap-12 items-center">
            <AnimatedSection className="lg:col-span-4 order-2 lg:order-1">
              <Eyebrow>The Website</Eyebrow>
              <h3 className="text-white mb-8" style={display("clamp(1.9rem, 3vw, 2.5rem)")}>
                Calm, editorial, and built to book.
              </h3>
              <dl className="space-y-6 mb-10">
                {[
                  ["Booking", "Online booking from every page, and a sticky call-and-book bar on phones."],
                  ["Structure", "A dedicated page for each of 22 services, plus billing and financing, technology, and sterilization pages."],
                  ["Design", "A warm palette and serif typography drawn from the practice’s own identity — not a dental template."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-blue-300/85 uppercase mb-1.5" style={{ ...eyebrowStyle, fontSize: "0.66rem", letterSpacing: "0.2em" }}>
                      {k}
                    </dt>
                    <dd className="m-0 text-white/75" style={body("0.95rem", 1.7)}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href="/westpark-case-study"
                className="inline-flex items-center gap-3 min-h-[44px] text-blue-300 hover:text-blue-200 transition-colors group"
                style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.02em" }}
              >
                Read the full case study, with source screenshots
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-8 order-1 lg:order-2" delay={0.08}>
              <DevicePreview
                shots={westparkHomeShots}
                url="westparkdds.com"
                desktopAlt="The Westpark Dental Studio homepage on desktop, designed and built by Kind Supply Digital"
                mobileAlt="The Westpark Dental Studio homepage on a phone, with a sticky call and book bar"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ PROCESS + NEW PRACTICES ============ */}
      <section id="process" className="py-24 lg:py-32 scroll-mt-20" aria-labelledby="process-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <AnimatedSection className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>How the Six Months Work</Eyebrow>
              <h2 id="process-title" className="text-white mb-6" style={display("clamp(2.3rem, 4vw, 3.4rem)")}>
                One plan, clearly sequenced.
              </h2>
              <p className="text-white/65" style={body("1rem", 1.75)}>
                Launch timing depends on receiving your content, access, and approvals. We don&rsquo;t promise a
                patient count, a ranking, or a date for results.
              </p>
            </div>
          </AnimatedSection>
          <ol className="lg:col-span-8 list-none p-0 m-0">
            {processSteps.map((s, i) => (
              <li key={s.n} className={`grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-4 py-8 ${i ? "border-t border-white/10" : "pt-0 lg:pt-2"}`}>
                <span className="text-blue-300/90" style={{ fontFamily: PLAYFAIR, fontSize: "1.9rem", lineHeight: 1 }}>
                  {s.n}
                </span>
                <div>
                  <h3 className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.45rem", fontWeight: 400, lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p className="text-white/68 max-w-2xl" style={body("0.98rem", 1.75)}>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* New practices */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24 lg:mt-32">
          <AnimatedSection>
            <div className="border-t border-blue-400/30 pt-14 grid lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="lg:col-span-4">
                <Eyebrow>Opening a New Practice?</Eyebrow>
                <h2 className="text-white mb-5" style={display("clamp(1.9rem, 3vw, 2.5rem)")}>
                  Ready before your doors open.
                </h2>
                <p className="text-white/65" style={body("0.95rem", 1.75)}>
                  The six-month agreement starts with your first payment, so we plan the start date around
                  your opening.
                </p>
              </div>
              <div className="lg:col-span-8 grid sm:grid-cols-3 gap-10 sm:gap-8">
                {newPractice.map((n) => (
                  <div key={n.title}>
                    <h3 className="text-white mb-3" style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600, lineHeight: 1.45 }}>
                      {n.title}
                    </h3>
                    <p className="text-white/65" style={body("0.92rem", 1.75)}>
                      {n.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ PRICING (cream) ============ */}
      <section id="package" className="scroll-mt-20 text-[#0f172a] py-24 lg:py-32" style={{ background: CREAM }} aria-labelledby="package-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">
            <AnimatedSection className="lg:col-span-5">
              <Eyebrow onCream>Transparent Pricing</Eyebrow>
              <h2 id="package-title" className="mb-10" style={display("clamp(2.4rem, 4.4vw, 3.6rem)")}>
                One package. One published price.
              </h2>
              <p className="mb-3" style={{ fontFamily: INTER, fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_ON_CREAM }}>
                {PACKAGE.name}
              </p>
              <p className="mb-5" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(3.6rem, 7vw, 5.4rem)", fontWeight: 400, lineHeight: 1 }}>
                {usd(PACKAGE.monthly)}
                <span style={{ fontFamily: INTER, fontSize: "1.05rem", color: "rgba(15,23,42,0.6)" }}> /month</span>
              </p>
              <p className="mb-10" style={{ ...body("1rem", 1.7), color: "rgba(15,23,42,0.75)" }}>
                Six-month agreement &middot; {usd(PACKAGE.total)} total initial commitment &middot; one dental practice
                location. Google ad spend is separate and paid directly to Google.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <a
                  href={`#${ASSESSMENT_ID}`}
                  className="inline-flex items-center justify-center gap-3 min-h-[52px] px-8 whitespace-nowrap bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors group"
                  style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.04em" }}
                >
                  Start with a free assessment
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <a
                  href="#enroll"
                  onClick={() => setEnrollOpen(true)}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 min-h-[44px] whitespace-nowrap underline underline-offset-4 decoration-[#0f172a]/30 hover:decoration-[#0f172a]"
                  style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500 }}
                >
                  Or request enrollment
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-7" delay={0.06}>
              <h3 className="mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.6rem", fontWeight: 400 }}>
                Included
              </h3>
              <dl className="m-0">
                {included.map(([k, v]) => (
                  <div key={k} className="grid sm:grid-cols-[14rem_1fr] gap-x-8 gap-y-1 py-5 border-b border-[#0f172a]/12">
                    <dt style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600 }}>{k}</dt>
                    <dd className="m-0" style={{ ...body("0.95rem", 1.65), color: "rgba(15,23,42,0.7)" }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              {SHOW_STANDALONE_COMPARISON ? (
                <p className="mt-6" style={{ ...body("0.9rem", 1.7), color: "rgba(15,23,42,0.68)" }}>
                  Priced separately at our standard rates &mdash; website build {usd(STANDALONE.websiteBuild)}, SEO{" "}
                  {usd(STANDALONE.seoMonthly)}/month, Google Ads management {usd(STANDALONE.adsManagementMonthly)}/month &mdash;
                  the same six months would total {usd(standaloneSixMonthTotal)}.
                </p>
              ) : null}
            </AnimatedSection>
          </div>

          {/* Material terms — all of them, in plain language */}
          <AnimatedSection className="mt-20 lg:mt-24 pt-12 border-t border-[#0f172a]/15">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <h3 className="mb-4" style={display("clamp(1.8rem, 2.8vw, 2.3rem)")}>
                  The terms, plainly.
                </h3>
                <p style={{ ...body("0.92rem", 1.7), color: "rgba(15,23,42,0.68)" }}>
                  A summary of the service agreement. Where this and the agreement differ, the agreement
                  controls.{" "}
                  <a href="#faq" className="underline underline-offset-4 decoration-[#0f172a]/30 hover:decoration-[#0f172a]">
                    Full details in the FAQ
                  </a>
                  .
                </p>
              </div>
              <dl className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-9 m-0">
                {[
                  ["Commitment", `Six monthly payments of ${usd(PACKAGE.monthly)}, charged automatically from your enrollment date. The agreement can’t be cancelled for convenience during those six months.`],
                  ["Google ad spend", "Not included. You pay your ad budget directly to Google from your own account. We never mark it up or bill it."],
                  ["The website", `Provided under license while the agreement is in effect — ownership does not transfer automatically. After the six-month commitment is paid, you may purchase the website files for a one-time ${usd(PACKAGE.websiteFilesPurchase)}.`],
                  ["After six months", `SEO and Google Ads continue month to month at ${usd(PACKAGE.monthly)} unless either side gives 30 days’ written notice. You can instead keep hosting only for ${usd(PACKAGE.hostingOnlyMonthly)}/month, or purchase the files.`],
                  ["Photography and video", "Optional and quoted separately. Travel, lodging, and production affect the quote, and nothing is charged without your written approval."],
                  ["Additional locations", "This package covers one location. Each additional office needs its own agreement, scope, and pricing."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="mb-2" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 600 }}>
                      {k}
                    </dt>
                    <dd className="m-0" style={{ ...body("0.93rem", 1.7), color: "rgba(15,23,42,0.72)" }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="py-24 lg:py-32" aria-labelledby="founder-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <AnimatedSection className="lg:col-span-5">
            {/* Founder portrait goes here (4:5). Until it's added, a typographic placeholder. */}
            <div
              className="aspect-[4/5] max-w-md bg-[#131d32] border border-white/10 flex items-end p-8"
              role="img"
              aria-label="Portrait of Marcel Grisard, coming soon"
            >
              <span className="text-blue-300/80" style={{ fontFamily: PLAYFAIR, fontSize: "6rem", lineHeight: 1 }} aria-hidden="true">
                MG
              </span>
            </div>
          </AnimatedSection>
          <AnimatedSection className="lg:col-span-7" delay={0.06}>
            <Eyebrow>Who You&rsquo;ll Work With</Eyebrow>
            <h2 id="founder-title" className="text-white mb-2" style={display("clamp(2.4rem, 4.4vw, 3.6rem)")}>
              Marcel Grisard
            </h2>
            <p className="text-blue-300/85 mb-8" style={body("0.95rem")}>
              Founder, Kind Supply Digital
            </p>
            <div className="space-y-5 max-w-2xl mb-10">
              <p className="text-white/78" style={body("1.08rem", 1.8)}>
                Kind Supply Digital is a small, founder-led agency. When your practice works with us, you
                have a direct line to the person who oversees your strategy and is accountable for the
                work &mdash; your website, your search visibility, and your advertising, as one plan.
              </p>
              <p className="text-white/68" style={body("1rem", 1.8)}>
                The scope is in writing, the price is on this page, and the monthly report says what actually
                happened. We measure the work by booked patients, not traffic.
              </p>
            </div>
            <p className="flex flex-col sm:flex-row gap-3 sm:gap-8" style={body("0.95rem")}>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-300 hover:text-blue-200 transition-colors break-all min-h-[44px] sm:min-h-0 inline-flex items-center">
                {CONTACT_EMAIL}
              </a>
              <a href={CONTACT_PHONE_HREF} className="text-blue-300 hover:text-blue-200 transition-colors min-h-[44px] sm:min-h-0 inline-flex items-center">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-24 lg:py-32 bg-[#0c1525] scroll-mt-20" aria-labelledby="faq-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <AnimatedSection className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Questions, Answered Plainly</Eyebrow>
              <h2 id="faq-title" className="text-white mb-6" style={display("clamp(2.3rem, 4vw, 3.4rem)")}>
                The details, before you ask.
              </h2>
              <p className="text-white/65" style={body("0.98rem", 1.75)}>
                Each answer summarizes the service agreement and cites the section it comes from. If an answer
                and the agreement ever differ, the agreement controls.
              </p>
            </div>
          </AnimatedSection>
          <div className="lg:col-span-8 border-t border-white/10">
            {dentalFaqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} refText={f.ref} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ ASSESSMENT (primary) + ENROLLMENT (secondary) ============ */}
      <section id={ASSESSMENT_ID} className="scroll-mt-20 py-24 lg:py-32" aria-labelledby="assessment-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16">
          <AnimatedSection className="lg:col-span-5">
            <Eyebrow>Free &middot; Written &middot; No Call Required</Eyebrow>
            <h2 id="assessment-title" className="text-white mb-8" style={display("clamp(2.4rem, 4.6vw, 3.8rem)")}>
              Request a free written practice growth assessment.
            </h2>
            <p className="text-white/75 mb-10" style={body("1.05rem", 1.8)}>
              We review your website, local search presence, and any visible Google Ads, then send a written
              summary of what we&rsquo;d change and why. Read it on your own time.
            </p>
            <ul className="space-y-4 list-none p-0">
              {[
                "No phone number needed, and no sales call",
                "Specific to your practice, not a template",
                "Useful whether or not you work with us",
              ].map((t) => (
                <li key={t} className="flex gap-4 text-white/75" style={body("0.98rem", 1.6)}>
                  <span className="mt-[0.7em] w-5 h-px bg-blue-400 shrink-0" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </AnimatedSection>
          <AnimatedSection className="lg:col-span-7" delay={0.06}>
            <div className="bg-[#131d32] p-7 sm:p-10 lg:p-12">
              <IntakeForm
                kind="assessment"
                fields={assessmentFields}
                submitLabel="Request My Free Assessment"
                successTitle="Thank you. Your assessment request is in."
                successBody="We’ll review your practice’s online presence and send your written assessment to the email you provided."
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Secondary: enrollment */}
        <div id="enroll" className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 scroll-mt-24">
          <div className="border-t border-white/10 pt-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-white mb-4" style={display("clamp(1.8rem, 2.8vw, 2.3rem)")}>
                Ready to enroll?
              </h2>
              <p className="text-white/68 mb-6" style={body("0.98rem", 1.75)}>
                Tell us about your practice. We confirm the package fits, then send the agreement to read
                and accept, with secure Stripe checkout. Nothing is charged until you complete it.
              </p>
              <button
                type="button"
                aria-expanded={enrollOpen}
                aria-controls="enroll-form"
                onClick={() => setEnrollOpen((v) => !v)}
                className="inline-flex items-center gap-3 min-h-[48px] px-7 border border-white/25 text-white hover:border-blue-400/60 transition-colors"
                style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.03em" }}
              >
                {enrollOpen ? "Hide enrollment form" : "Request enrollment"}
                {enrollOpen ? <Minus size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
              </button>
            </div>
            <div id="enroll-form" className="lg:col-span-7" hidden={!enrollOpen}>
              <ol className="list-none p-0 mb-10 grid sm:grid-cols-5 gap-4 sm:gap-3">
                {["Tell us about your practice", "We confirm the fit", "You read and accept the agreement", "Secure Stripe checkout", "Receipt and onboarding"].map((s, i) => (
                  <li key={s} className="text-white/70" style={body("0.82rem", 1.5)}>
                    <span className="block text-blue-300/90 mb-1" style={{ fontFamily: PLAYFAIR, fontSize: "1.2rem" }}>
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
          </div>
        </div>

        <p className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 text-white/55" style={body("0.88rem", 1.7)}>
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
      </section>

      <StickyAssessmentCTA heroId={HERO_ID} targetId={ASSESSMENT_ID} />
    </div>
  );
}
