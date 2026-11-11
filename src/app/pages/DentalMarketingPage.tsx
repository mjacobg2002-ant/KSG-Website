import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead, SITE } from "../components/SEOHead";
import { IntakeForm, type IntakeField } from "../components/dental/IntakeForm";
import { ResponsivePhoto } from "../components/dental/ResponsivePhoto";
import { StickyEnrollmentCTA } from "../components/dental/StickyEnrollmentCTA";
import { founderPhoto, photos } from "../components/dental/westparkMedia";
import { dentalFaqs } from "../components/dental/dentalFaq";
import {
  AGREEMENT_PATH,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  PACKAGE,
  SHOW_STANDALONE_COMPARISON,
  STANDALONE,
  usd,
} from "../components/dental/dentalConfig";

/* ------------------------------------------------------------------ */
/* Type system — same families as the rest of the site                 */
/* ------------------------------------------------------------------ */
const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";
const CREAM = "#f4f0e7";
/** Gold dark enough for text on cream (5.4:1). */
const GOLD_ON_CREAM = "#7a5c26";

const eyebrowStyle = { fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" } as const;
const display = (size: string) => ({ fontFamily: PLAYFAIR, fontSize: size, fontWeight: 400, lineHeight: 1.14, letterSpacing: "-0.02em" }) as const;
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

const waivedFees = SHOW_STANDALONE_COMPARISON
  ? [
      `${usd(STANDALONE.websiteBuild)} website build fee`,
      `${usd(STANDALONE.adsManagementMonthly)}/month Google Ads management fee`,
    ]
  : ["Website build fee", "Separate Google Ads management fee"];

function MarkerUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 56 9" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-0.5 left-0 h-[7px] w-full text-[#ca4742]" fill="none">
        <path d="M2 6.5C14 3.5 37 3 54 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M7 7.5C21 5.5 39 5.1 51 5.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.65" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
const results = [
  {
    value: "13 → 19 → 25+",
    label: "Website bookings (+46%)",
    detail: "August and September 2026 actuals from the booking platform’s “Your website” channel. 25+ is the monthly website booking target.",
    goal: "30 new patients a month",
  },
  {
    value: "24",
    label: "Non-branded searches averaging page one of Google",
    detail: "Google Search Console, 7 days ending October 5, 2026.",
  },
  {
    value: "122 → 268",
    label: "Daily Google impressions",
    detail: "September 26 to October 2, 2026. Google Search Console.",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Discovery and onboarding",
    body: "We review the services you want to grow and how patients find and book with you today. You share materials and account access within the first ten business days.",
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
    title: "Monthly written reporting",
    body: "See website traffic, local search visibility, Google Ads performance, and appointment requests or bookings where your booking system supports tracking. We label estimates and separate them from measured results.",
  },
];

const included = [
  ["Custom dental website", "Up to 20 pages, online booking or appointment requests, analytics, two rounds of revisions"],
  ["Ongoing local SEO", "Technical and on-page SEO, Google Business Profile optimization, local citations"],
  ["Google Ads management", "Setup, keywords and negatives, ad copy, conversion tracking, budget optimization"],
  ["Hosting and maintenance", "Security and platform updates, plus up to five hours of minor edits a month"],
  ["Monthly written report", "Website traffic, search visibility, Google Ads performance, and bookings where supported"],
];

const practicePhotos = [photos.exterior, photos.reception, photos.sterilization, photos.cerec];

const evidenceLinks = [
  ["August website bookings", "bookings-aug.png"],
  ["September website bookings", "bookings-sep.png"],
  ["Google Search Console rankings", "gsc-screenshot.png"],
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
    <div className="[--dental-link-focus:#dcc07b] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[color:var(--dental-link-focus)]!">
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
        id={HERO_ID}
        className="relative border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]"
        aria-labelledby="dental-hero-title"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Dental Marketing for Independent Practices</Eyebrow>
            <h1 id="dental-hero-title" className="text-white mb-6" style={display("clamp(2.1rem, 4.1vw, 3.75rem)")}>
              <span className="block text-balance">More Booked Patients.</span>{" "}
              <span className="block text-balance text-blue-200">Not Just More Clicks.</span>
            </h1>
            <p className="text-white/78 max-w-lg mb-5" style={body("1.12rem", 1.7)}>
              Custom dental websites, local SEO, and Google Ads management—working together to help
              independent practices attract patients and turn interest into scheduled appointments.
            </p>
            <div className="max-w-lg mb-7 border-l-2 border-blue-500 pl-4 py-1">
              <ul className="list-none m-0 p-0 space-y-1 text-blue-200 font-semibold" style={body("1rem", 1.45)}>
                {waivedFees.map((fee) => <li key={fee}>{fee} <MarkerUnderline>waived</MarkerUnderline></li>)}
              </ul>
              <p className="text-white/70 mt-2 mb-0" style={body("0.88rem", 1.55)}>
                With the {usd(PACKAGE.monthly)}/month package. You pay your ad budget directly to Google.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              <a
                href={AGREEMENT_PATH}
                className="inline-flex items-center justify-center gap-3 min-h-[52px] px-5 sm:px-7 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-colors"
                style={{ ...body("0.94rem", 1.4), letterSpacing: "0.03em" }}
              >
                Review agreement &amp; checkout
                <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
              </a>
              <a href={`#${ASSESSMENT_ID}`} className="inline-flex items-center min-h-[44px] text-white/80 hover:text-white underline underline-offset-4" style={body("0.94rem")}>
                Get a free written assessment
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 mt-2" style={body("0.88rem")}>
              <a href="#work" className="inline-flex items-center min-h-[44px] text-white/70 hover:text-white underline underline-offset-4">
                View a case study
              </a>
              <a href="#package" className="inline-flex items-center min-h-[44px] text-white/70 hover:text-white underline underline-offset-4">
                View pricing and terms
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="py-20 lg:py-24 scroll-mt-20" aria-labelledby="process-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>How the Six Months Work</Eyebrow>
            <h2 id="process-title" className="text-white mb-5" style={display("clamp(2.3rem, 4vw, 3.5rem)")}>
              Start with what already works.
            </h2>
            <p className="text-white/75 max-w-md" style={body()}>
              Before we replace a live site, we review your existing URLs, booking links, and account
              access. We identify which pages need redirects and check the booking path before launch.
              Your domain and Google accounts stay in your name.
            </p>
            <div className="mt-8 pt-6 border-t border-white/15 max-w-md">
              <h3 className="text-white mb-2" style={display("1.45rem")}>Opening a new practice?</h3>
              <p className="text-white/70" style={body("0.93rem")}>
                We plan your website, Google Business Profile, and ad launch around your opening.
                Your six-month term starts with your first payment.
              </p>
            </div>
          </div>
          <ol className="lg:col-span-7 list-none p-0 m-0 border-t border-white/15">
            {processSteps.map((step) => (
              <li key={step.n} className="grid grid-cols-[2.4rem_1fr] sm:grid-cols-[3.5rem_1fr] gap-4 py-5 border-b border-white/15">
                <span className="text-blue-300" style={body("0.88rem")} aria-hidden="true">{step.n}</span>
                <div>
                  <h3 className="text-white mb-1.5" style={display("1.35rem")}>{step.title}</h3>
                  <p className="text-white/72 max-w-xl m-0" style={body("0.95rem", 1.65)}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ CASE STUDY ============ */}
      <section id="work" className="scroll-mt-20 text-[#0f172a] py-20 lg:py-24 [--dental-link-focus:#7a5c26]" style={{ background: CREAM }} aria-labelledby="work-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-12 items-end mb-8">
            <div className="lg:col-span-5">
              <Eyebrow onCream>Case Study · Tysons Corner, Virginia</Eyebrow>
              <h2 id="work-title" style={display("clamp(2.2rem, 4vw, 3.45rem)")}>Westpark Dental Studio</h2>
            </div>
            <p className="lg:col-span-7 text-[#0f172a]/80 max-w-2xl" style={body()}>
              Westpark wanted nearby patients to find specific treatments and book online. We built
              individual pages for 22 services and linked to booking from every page, with a call and
              book bar on mobile. The site launched September 12, 2026.
            </p>
          </div>

          <dl className="grid md:grid-cols-3 m-0 border-y border-[#0f172a]/20">
            {results.map((result, i) => (
              <div key={result.label} className={`py-5 md:px-6 ${i ? "border-t md:border-t-0 md:border-l border-[#0f172a]/20" : "md:pl-0"}`}>
                <dt className="mb-2 md:min-h-[2.8em] font-semibold" style={body("0.95rem", 1.4)}>{result.label}</dt>
                <dd className="m-0">
                  <p className="mb-2" style={display(result.goal ? "clamp(1.7rem, 3.4vw, 3.55rem)" : "clamp(2.3rem, 4vw, 3.55rem)")}>{result.value}</p>
                  <p className="text-[#0f172a]/75 m-0" style={body("0.86rem", 1.55)}>{result.detail}</p>
                  {result.goal && (
                    <p className="text-[#0f172a]/80 mt-3 mb-0" style={body("0.9rem", 1.55)}>
                      <strong>Growth goal</strong> · <MarkerUnderline>{result.goal}</MarkerUnderline>
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mt-9 lg:mt-12">
            <div className="lg:col-span-5">
              <h3 className="mb-3" style={display("1.5rem")}>How to read these numbers</h3>
              <p className="text-[#0f172a]/80 mb-3" style={body("0.91rem", 1.7)}>
                Website bookings exclude phone calls and bookings through other channels. September
                includes 11 days before launch. Seasonality and the practice&rsquo;s own efforts may also
                have affected bookings, so the figures show what happened around launch without isolating
                the website&rsquo;s impact.
              </p>
              <p className="text-[#0f172a]/80 mb-4" style={body("0.91rem", 1.7)}>
                Search positions are averages and vary by device and location. The search and
                impression figures are organic. Google Ads results are outside the scope of this case study.
              </p>
              <details>
                <summary className="min-h-[44px] py-2 cursor-pointer font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a5c26]" style={{ ...body("0.92rem"), color: GOLD_ON_CREAM }}>
                  View source screenshots
                </summary>
                <ul className="list-none m-0 p-0">
                  {evidenceLinks.map(([label, file]) => (
                    <li key={file}>
                      <a href={`/westpark-case-study/assets/${file}`} className="inline-flex items-center min-h-[44px] underline underline-offset-4" style={{ ...body("0.92rem"), color: GOLD_ON_CREAM }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
            <figure className="lg:col-span-7 m-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3">
                {practicePhotos.map((photo) => (
                  <div key={photo.alt} className="aspect-[3/2] overflow-hidden">
                    <ResponsivePhoto photo={photo} sizes="(min-width: 1280px) 300px, (min-width: 1024px) 28vw, (min-width: 640px) 25vw, 50vw" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <figcaption className="mt-3 text-[#0f172a]/75" style={body("0.83rem")}>
                Westpark practice photography, shown with permission.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="package" className="scroll-mt-20 text-[#0f172a] py-20 lg:py-24 border-t border-[#0f172a]/15 [--dental-link-focus:#7a5c26]" style={{ background: CREAM }} aria-labelledby="package-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Eyebrow onCream>Pricing &amp; Terms</Eyebrow>
          <h2 id="package-title" className="mb-9 lg:mb-12" style={display("clamp(2.2rem, 4.4vw, 3.65rem)")}>
            {PACKAGE.name}
          </h2>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-3" style={display("clamp(3.4rem, 6vw, 5.15rem)")}>
                {usd(PACKAGE.monthly)}
                <span className="text-[#0f172a]/75" style={body("1.05rem")}> /month</span>
              </p>
              <p className="font-semibold mb-2" style={body("1rem", 1.55)}>
                Six-month agreement · One practice location
              </p>
              <div className="mt-5 mb-6 border-l-2 border-[#7a5c26] pl-4 py-1">
                <ul className="list-none m-0 p-0 space-y-1 font-semibold" style={{ ...body("0.95rem", 1.5), color: GOLD_ON_CREAM }}>
                  {waivedFees.map((fee) => <li key={fee}>{fee} <MarkerUnderline>waived</MarkerUnderline></li>)}
                </ul>
                <p className="text-[#0f172a]/80 mt-2 mb-0" style={body("0.93rem", 1.6)}>
                  Google ad spend is separate and paid directly to Google from your own account.
                </p>
              </div>

              <dl className="m-0 border-t border-[#0f172a]/20 divide-y divide-[#0f172a]/15">
                <div className="py-4">
                  <dt className="font-semibold mb-1" style={body("0.94rem")}>After six months</dt>
                  <dd className="m-0 text-[#0f172a]/80" style={body("0.92rem", 1.65)}>
                    SEO and Google Ads management continue at {usd(PACKAGE.monthly)}/month unless
                    either side gives written notice at least 30 days before the initial term ends.
                    Once month to month, either side can end services with 30 days&rsquo; written notice.
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="font-semibold mb-1" style={body("0.94rem")}>Website hosting and transfer</dt>
                  <dd className="m-0 space-y-2 text-[#0f172a]/80" style={body("0.92rem", 1.65)}>
                    <p className="m-0">The package includes a website license. If you end marketing services after the initial term, you have two options.</p>
                    <p className="m-0"><strong>Keep your site live with us.</strong> Hosting and maintenance are {usd(PACKAGE.hostingOnlyMonthly)}/month.</p>
                    <p className="m-0"><strong>Move to another host.</strong> After the initial term, once all amounts due are paid, you can purchase the website files for a one-time {usd(PACKAGE.websiteFilesPurchase)}.</p>
                    <p className="m-0">Your domain, content, and Google accounts stay yours.</p>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <h3 className="mb-3" style={display("1.65rem")}>What&rsquo;s included</h3>
              <dl className="m-0 border-t border-[#0f172a]/20">
                {included.map(([title, detail]) => (
                  <div key={title} className="grid sm:grid-cols-[11rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-[#0f172a]/15">
                    <dt className="font-semibold" style={body("0.96rem", 1.5)}>{title}</dt>
                    <dd className="m-0 text-[#0f172a]/80" style={body("0.93rem", 1.65)}>{detail}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="mt-6 mb-3" style={display("1.45rem")}>Billing and additional work</h3>
              <ul className="m-0 ps-5 list-disc space-y-2 text-[#0f172a]/80" style={body("0.92rem", 1.65)}>
                <li>Six payments are charged automatically from enrollment. The initial term can&rsquo;t be cancelled for convenience.</li>
                <li>Photography and video are optional and quoted separately based on production and travel. We get written approval before any charges.</li>
                <li>Each additional location needs its own agreement, scope, and pricing.</li>
              </ul>
            </div>
          </div>

          <div className="mt-7 pt-6 border-t border-[#0f172a]/20 flex flex-col sm:flex-row sm:items-center gap-x-7 gap-y-2">
            <a href={AGREEMENT_PATH} className="inline-flex self-start items-center gap-3 min-h-[52px] px-6 bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors font-medium" style={{ ...body("0.94rem", 1.4), letterSpacing: "0.03em" }}>
              Review agreement &amp; checkout
              <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
            </a>
            <a href={`#${ASSESSMENT_ID}`} className="inline-flex self-start sm:self-auto items-center min-h-[44px] underline underline-offset-4" style={body("0.94rem")}>
              Get a free written assessment
            </a>
            <a href="#faq" className="inline-flex self-start sm:self-auto items-center min-h-[44px] underline underline-offset-4" style={body("0.94rem")}>
              Read the agreement FAQs
            </a>
          </div>
          <p className="mt-3 text-[#0f172a]/75" style={body("0.85rem")}>
            Review the full agreement before paying. Completing Stripe checkout confirms your
            practice&rsquo;s acceptance and starts the six-month term.
          </p>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="py-16 lg:py-20" aria-labelledby="founder-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid sm:grid-cols-[minmax(15rem,2fr)_minmax(0,3fr)] lg:grid-cols-[26rem_1fr] gap-8 sm:gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] w-full max-w-sm lg:max-w-none overflow-hidden">
            <ResponsivePhoto photo={founderPhoto} sizes="(min-width: 1024px) 416px, (min-width: 640px) clamp(240px, calc(40vw - 38px), 384px), (min-width: 432px) 384px, calc(100vw - 48px)" className="w-full h-full object-cover" />
          </div>
          <div>
            <Eyebrow>Your Point of Contact</Eyebrow>
            <h2 id="founder-title" className="text-white mb-2" style={display("clamp(2.15rem, 4vw, 3.3rem)")}>
              Marcel Grisard
            </h2>
            <p className="text-blue-300 mb-4" style={body("0.94rem")}>
              Founder, Kind Supply Digital
            </p>
            <p className="text-white/75 max-w-xl mb-3" style={body()}>
              You work directly with Marcel, who oversees the website, local search, and advertising
              strategy for your practice and is your contact for questions about the work.
            </p>
            <div className="flex flex-wrap gap-x-7 gap-y-1" style={body("0.94rem")}>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-300 hover:text-blue-200 break-all min-h-[44px] inline-flex items-center">
                {CONTACT_EMAIL}
              </a>
              <a href={CONTACT_PHONE_HREF} className="text-blue-300 hover:text-blue-200 min-h-[44px] inline-flex items-center">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 lg:py-24 bg-[#0c1525] scroll-mt-20" aria-labelledby="faq-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <AnimatedSection className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 id="faq-title" className="text-white mb-6" style={display("clamp(2.3rem, 4vw, 3.4rem)")}>
                Common questions
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
      <section id={ASSESSMENT_ID} className="scroll-mt-20 py-20 lg:py-24 [&_form_a]:inline-flex [&_form_a]:items-center [&_form_a]:min-h-[44px] [&_form_a]:[overflow-wrap:anywhere] [&_form_button[type=submit]]:whitespace-normal max-sm:[&_form_button[type=submit]]:px-3" aria-labelledby="assessment-title">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16">
          <AnimatedSection className="lg:col-span-5">
            <Eyebrow>No Call Required</Eyebrow>
            <h2 id="assessment-title" className="text-white mb-5" style={display("clamp(2.4rem, 4.6vw, 3.8rem)")}>
              A free written assessment for your practice.
            </h2>
            <p className="text-white/75 mb-5" style={body("1.05rem", 1.8)}>
              We review your website, local search presence, and any visible Google Ads. You&rsquo;ll get
              an email explaining what we&rsquo;d change first and why.
            </p>
            <p className="text-white/65" style={body("0.94rem")}>No phone number needed.</p>
          </AnimatedSection>
          <AnimatedSection className="lg:col-span-7" delay={0.06}>
            <div className="bg-[#131d32] border-t-2 border-blue-500 p-5 sm:p-9 lg:p-10">
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

        {/* Direct checkout and optional enrollment help */}
        <div id="enroll" className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 scroll-mt-24">
          <div className="border-t border-white/10 pt-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-white mb-4" style={display("clamp(1.8rem, 2.8vw, 2.3rem)")}>
                Ready to enroll?
              </h2>
              <p className="text-white/75 mb-6" style={body("0.98rem", 1.75)}>
                Read the full service agreement, confirm that you&rsquo;re authorized to enroll your practice,
                and accept the terms to unlock secure Stripe checkout.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <a href={AGREEMENT_PATH} className="inline-flex items-center gap-3 min-h-[48px] px-5 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-colors" style={body("0.94rem", 1.4)}>
                  Review agreement &amp; checkout
                  <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  aria-expanded={enrollOpen}
                  aria-controls="enroll-form"
                  onClick={() => setEnrollOpen((v) => !v)}
                  className="inline-flex items-center gap-2 min-h-[44px] text-white/80 hover:text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
                  style={body("0.9rem")}
                >
                  {enrollOpen ? "Hide enrollment form" : "Ask about enrollment"}
                  {enrollOpen ? <Minus size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                </button>
              </div>
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

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8" style={body("0.9rem")}>
          <Link to="/services" className="inline-flex items-center min-h-[44px] text-blue-300 hover:text-blue-200 underline underline-offset-4">
            Explore all Kind Supply Digital services
          </Link>
        </div>
      </section>

      <StickyEnrollmentCTA heroId={HERO_ID} assessmentId={ASSESSMENT_ID} />
    </div>
  );
}
