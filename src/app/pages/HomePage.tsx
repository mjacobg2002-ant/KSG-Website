import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Code2,
  Search,
  BarChart3,
  MapPin,
  PhoneMissed,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  EyeOff,
  Clock,
} from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { LeadRescueDemo } from "../components/LeadRescueDemo";
import { PipelineBoard } from "../components/PipelineBoard";
import { ClientWall } from "../components/ClientWall";
import { ProvenResults } from "../components/ProvenResults";
import { ServiceArea } from "../components/ServiceArea";

/* ---------- Reusable CTA with reassurance ---------- */
function CTABlock({ label = "Get Your Free Consultation", center = false }: { label?: string; center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center" : "flex flex-col items-start"}>
      <Link
        to="/contact"
        className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
      >
        {label}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      <p
        className="text-white/30 mt-4"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", letterSpacing: "0.03em" }}
      >
        Free &middot; No pressure, no obligation &middot; Response within 24 hours
      </p>
    </div>
  );
}

/* ---------- Data ---------- */
const pains = [
  {
    icon: EyeOff,
    title: "They can't find you",
    cost: "The search happens without you",
    desc: "Someone nearby is searching for exactly what you do right now. If you're not in the map pack and on page one, that inquiry goes to a competitor who is — every single day, silently.",
  },
  {
    icon: TrendingDown,
    title: "Your site doesn't convert",
    cost: "Traffic you paid for, wasted",
    desc: "Visitors land, scroll for eight seconds, and leave. A site that looks fine but doesn't drive a call or a booking is a brochure — and brochures don't fill pipelines.",
  },
  {
    icon: Clock,
    title: "The calls you do get go unanswered",
    cost: "Roughly 1 in 4 calls, gone",
    desc: "After hours, on weekends, mid-job — the caller doesn't leave a voicemail. They dial the next name on the list. You never even know the lead existed.",
  },
];

const services = [
  {
    icon: Code2,
    title: "Websites Built to Convert",
    desc: "Custom, conversion-engineered sites — HIPAA-aware for healthcare, click-to-call and instant booking for the trades, intake-ready for law and dental. Designed to turn visitors into inquiries, not to win design awards.",
  },
  {
    icon: Search,
    title: "SEO & Local Search",
    desc: "We research exactly what your customers type into Google, then build the pages, content, and technical foundation to win those searches — local rankings that compound month over month. SEO engagements run on 6–12 month terms.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile",
    desc: "For local search, your GBP often matters more than your website. We build it end to end — categories, photos, posts, reviews — so you own the map pack.",
  },
  {
    icon: BarChart3,
    title: "Google & Meta Ads",
    desc: "Google Search and Meta (Facebook & Instagram) campaigns with full conversion tracking. You'll know your cost per lead and your return on every dollar — no vanity metrics.",
  },
];

const objections = [
  {
    q: "\u201CWe already have a website.\u201D",
    a: "Most of our clients did too. The question isn't whether you have one — it's whether it produced an inquiry this week. In your free consultation we'll show you exactly where visitors are dropping off, no strings attached. If your site is genuinely working, we'll tell you that too.",
  },
  {
    q: "\u201CI don't have time for a big project.\u201D",
    a: "You touch almost nothing. The Lead Rescue System goes live in seven days with about 30 minutes of your input. Website builds run on our project management, not yours — you approve, we execute.",
  },
  {
    q: "\u201CHow do I know this pays for itself?\u201D",
    a: "We track everything to revenue \u2014 calls, forms, bookings, and cost per lead across SEO and ads \u2014 and report it in plain language, not vanity metrics. SEO compounds over a 6\u201312 month engagement, so rankings and pipeline build month over month. One recovered HVAC replacement, signed case, or admitted client can cover months of the work.",
  },
  {
    q: "\u201CWe're in healthcare — what about compliance?\u201D",
    a: "That's where we built our name. Every healthcare build is HIPAA-conscious from the ground up — it's not an add-on, it's our default. We've spent years in the most compliance-heavy niche online.",
  },
];

const trustPoints = [
  "Proven in behavioral health — the most trust-sensitive niche on the internet",
  "SEO built to compound: local rankings, Google Business Profile, and content that climbs month over month",
  "Google & Meta ads with full conversion tracking — you see cost per lead and return on every dollar",
  "A dedicated strategist on every account. You talk to the people doing the work",
  "SEO and our CRM system run on 6–12 month terms — durable rankings and pipeline compound over time, and we commit to the full arc with you",
];

export function HomePage() {
  return (
    <div>
      <SEOHead
        title="Web Design, SEO & Lead Systems in Northern Virginia | Kind Supply Digital"
        description="Kind Supply Digital is a Northern Virginia web design, SEO, and lead-generation agency serving McLean, Tysons, Arlington, Fairfax, Reston, Ashburn, Washington DC, and the DMV. Conversion websites, local SEO, Google Business Profile, and the Lead Rescue System — proven in behavioral health, now serving home services, law firms, and dental."
        keywords="web design Northern Virginia, SEO agency Northern Virginia, lead generation Northern Virginia, website design Fairfax VA, SEO agency McLean VA, digital marketing Northern Virginia, web design Washington DC, local SEO DMV, behavioral health marketing agency, HVAC marketing, law firm lead generation, dental marketing, missed call text back, lead rescue system, Google Business Profile"
        canonical="https://kindsupplydigital.com"
        structuredData={{
          "@type": "ProfessionalService",
          name: "Kind Supply Digital",
          areaServed: [
            "Northern Virginia",
            "McLean",
            "Tysons",
            "Arlington",
            "Alexandria",
            "Fairfax",
            "Vienna",
            "Reston",
            "Ashburn",
            "Washington, DC",
            "Maryland",
            "DMV",
          ],
        }}
      />

      {/* ============ HERO — name the pain ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]" />
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(96,165,250,0.15) 0%, transparent 60%)",
            }}
            animate={{
              background: [
                "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(96,165,250,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.25) 0%, transparent 60%), radial-gradient(ellipse at 50% 70%, rgba(96,165,250,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.2) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(96,165,250,0.15) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-blue-300/50 uppercase tracking-[0.3em] mb-8 lg:mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Behavioral Health &middot; HVAC & Home Services &middot; Law Firms &middot; Dental
            </p>
          </motion.div>

          {/* Mobile headline — unchanged */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-white mb-8 lg:hidden"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)",
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            Your Next Customer Is Searching
            <br />
            Right Now. <span className="text-blue-200/50">Will They Find You &mdash;
            <br />
            or the Competitor Who Answers?</span>
          </motion.h1>

          {/* Desktop headline — sentence-per-line, balanced measure */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-white hidden lg:block mb-10 mx-auto max-w-[62rem]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "4rem",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Your Next Customer Is Searching Right&nbsp;Now.
            <br />
            <span className="text-blue-200/50">Will They Find You &mdash; or the Competitor Who&nbsp;Answers?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/50 max-w-2xl lg:max-w-[44rem] mx-auto mb-10 lg:mb-12"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "1.8" }}
          >
            You're great at the work. But the patients, jobs, and cases you never hear
            about are going to businesses with a stronger site, better search presence,
            and a phone that always answers. We build all three &mdash; websites, SEO, and
            the system that catches every call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <CTABlock center />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
        </motion.div>
      </section>

      {/* ============ CLIENT WALL — social proof up front ============ */}
      <ClientWall />

      {/* ============ AGITATE — the cost of doing nothing ============ */}
      <section className="py-32 border-b border-white/5 bg-[#0c1525]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              The Real Cost of &ldquo;Fine&rdquo;
            </p>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              You Don't See the Leads You're Losing. That's the Problem.
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Lost leads don't send a report. They just quietly become someone else's
              customer. Three leaks drain almost every service business we audit:
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {pains.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1}>
                <div className="bg-[#0f172a] p-10 h-full group hover:bg-[#131d32] transition-colors duration-500">
                  <p.icon size={26} className="text-blue-400/30 mb-8 group-hover:text-blue-400/60 transition-colors duration-500" />
                  <p
                    className="text-blue-300/50 uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                  >
                    {p.cost}
                  </p>
                  <h3
                    className="text-white mb-4"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 500 }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-white/40"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                  >
                    {p.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2}>
            <p
              className="text-white/50 mt-16 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
            >
              Each leak feels small because you never see it happen. But one HVAC
              replacement, one signed case, one admitted client can be worth $5,000
              to $50,000 &mdash; so losing even a few leads a month quietly costs more
              than fixing all three leaks ever would.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ POSITION — the way out ============ */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              The Way Out
            </p>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              One Partner. One System. Every Leak Sealed.
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              We built this playbook over years in behavioral health &mdash; the hardest
              niche online to earn trust in &mdash; and now we run it for HVAC, home
              services, law firms, and dental practices. Get found. Convert the visit.
              Answer every call.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <Link to="/services" className="block h-full">
                  <div className="bg-[#0f172a] p-10 lg:p-14 group hover:bg-[#162036] transition-colors duration-500 h-full cursor-pointer">
                    <s.icon
                      size={28}
                      className="text-blue-400/25 mb-8 group-hover:text-blue-400/60 transition-colors duration-500"
                    />
                    <h3
                      className="text-white mb-4"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.15rem", fontWeight: 500 }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-white/40"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICE AREA — local NoVA / DMV SEO ============ */}
      <ServiceArea />

      {/* ============ LEAD RESCUE — flagship offer + risk reversal ============ */}
      <section className="py-32 border-b border-white/5 bg-[#0c1525]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <AnimatedSection>
              <p
                className="text-blue-300/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                <Sparkles size={12} className="text-blue-300/60" />
                New &middot; The Lead Rescue System
              </p>
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                Every Missed Call, Texted Back in 60 Seconds
              </h2>
              <p
                className="text-white/40 mb-8"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
              >
                Routine appointments book themselves. Real emergencies get flagged
                straight to your phone. Every lead lands in one pipeline with a dollar
                value attached. It runs on your existing number, goes live in seven
                days, and asks about 30 minutes of your time &mdash; total.
              </p>

              <div className="border border-blue-400/25 bg-[#0f172a] p-7 mb-10 flex items-start gap-4">
                <ShieldCheck size={22} className="text-blue-300/70 shrink-0 mt-1" />
                <div>
                  <p
                    className="text-white mb-1"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    Runs on Your Line. Live in 7 Days.
                  </p>
                  <p
                    className="text-white/45"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: "1.7" }}
                  >
                    It installs on your existing number and goes live in about a week.
                    Every missed call, form, and message lands in one pipeline with a
                    dollar value attached &mdash; nothing slips through again.
                  </p>
                </div>
              </div>

              <CTABlock label="See It Run on Your Own Number" />
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <LeadRescueDemo />
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <p
              className="text-white/40 mb-12 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              And nothing disappears into a voicemail box again &mdash; you see every lead,
              every stage, every dollar:
            </p>
          </AnimatedSection>
          <PipelineBoard />
        </div>
      </section>

      {/* ============ PROVEN RESULTS — real client outcomes ============ */}
      <ProvenResults />

      {/* ============ TRUST STACK ============ */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <AnimatedSection>
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Why Trust Us
              </p>
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                Real Work. Clear Terms. Measurable Results.
              </h2>
              <p
                className="text-white/40"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
              >
                Honest timelines, reporting you can actually read, and a senior team on
                every account. SEO and our CRM system run on 6&ndash;12 month terms because
                real rankings and pipeline take time to build. We earned our name in
                behavioral health, where trust is everything and shortcuts end careers
                &mdash; and we run every industry we serve to that same standard.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="space-y-5 pt-4">
                {trustPoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <CheckCircle2 size={18} className="text-blue-400/50 mt-0.5 shrink-0 group-hover:text-blue-400 transition-colors" />
                    <p
                      className="text-white/55 group-hover:text-white/75 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.6" }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ OBJECTIONS — answered before asked ============ */}
      <section className="py-32 border-b border-white/5 bg-[#0c1525]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Fair Questions
            </p>
            <h2
              className="text-white mb-20"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              What You're Probably Thinking Right Now
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {objections.map((o, i) => (
              <AnimatedSection key={o.q} delay={i * 0.08}>
                <div className="py-10 border-b border-white/5 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 lg:gap-16">
                  <h3
                    className="text-white/80"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 400, lineHeight: 1.4 }}
                  >
                    {o.q}
                  </h3>
                  <p
                    className="text-white/45"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.85" }}
                  >
                    {o.a}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Pricing
            </p>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Straightforward Pricing, Structured for Results.
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Website builds are project-based. SEO and our CRM / Lead Rescue system run on
              6&ndash;12 month terms, priced to your industry, so every engagement is quoted
              for your business. Want everything? The full package is bundled at
              better-than-piecemeal pricing.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
            {[
              {
                name: "Lead Rescue CRM System",
                role: "New · Quoted per industry · 6–12 mo term",
                price: "Get a Quote",
                priceNote: "priced to your industry — installed on your existing line, live in 7 days",
                featured: true,
                cta: "Get a Quote",
                features: [
                  "Missed-call text-back on your line",
                  "Speed-to-lead automation",
                  "Emergency flagging to your phone",
                  "Full CRM lead tracking",
                  "Live in 7 days",
                ],
              },
              {
                name: "Client-Acquisition Website",
                role: "The foundation",
                price: "Get a Quote",
                priceNote: "every build is scoped to your business — book a call",
                featured: false,
                cta: "Get a Quote",
                features: [
                  "Full custom design & build",
                  "Conversion-centered UX for your industry",
                  "Local SEO foundation & schema",
                  "Google Business Profile buildout",
                  "HIPAA-conscious builds for healthcare",
                ],
              },
              {
                name: "Full Growth Package",
                role: "Everything, bundled",
                price: "Custom",
                priceNote: "site + CRM + growth, bundled pricing",
                featured: false,
                cta: "Book a Call",
                features: [
                  "Website and Lead Rescue CRM together",
                  "Keyword analytics & ongoing SEO",
                  "Google & Meta ads management",
                  "Review & reactivation automation",
                  "Quarterly growth strategy",
                ],
              },
            ].map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 0.12}>
                <div
                  className={`p-10 h-full flex flex-col transition-colors duration-500 ${
                    p.featured ? "bg-[#162036]" : "bg-[#0f172a] hover:bg-[#131d32]"
                  }`}
                >
                  <p
                    className={`uppercase tracking-[0.2em] mb-4 ${p.featured ? "text-blue-300/70" : "text-blue-300/30"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500 }}
                  >
                    {p.role}
                  </p>
                  <h3
                    className="text-white mb-5"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400 }}
                  >
                    {p.name}
                  </h3>
                  <p
                    className="text-blue-300 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 400, lineHeight: 1 }}
                  >
                    {p.price}
                  </p>
                  <p
                    className="text-white/30 mb-8"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", lineHeight: "1.6" }}
                  >
                    {p.priceNote}
                  </p>

                  <div className="space-y-4 flex-1 mb-10">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-blue-400/50 mt-0.5 shrink-0" />
                        <p
                          className="text-white/50"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: "1.6" }}
                        >
                          {f}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className={`px-8 py-3.5 text-center transition-all duration-300 ${
                      p.featured
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "border border-blue-400/20 text-blue-200/60 hover:text-white hover:border-blue-400/40"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em" }}
                  >
                    {p.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CLOSE ============ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#131d32] to-[#0f172a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p
              className="text-blue-300/40 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Limited Availability
            </p>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              The Leads You Lost This Week Aren't Coming Back.
              <br />
              <span className="text-blue-200/50">Next Week's Still Can.</span>
            </h2>
            <p
              className="text-white/45 mb-10 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              We take on a limited number of clients each quarter so every project
              gets our full attention. One free conversation &mdash; we'll look at your
              site, your search presence, and what happens when someone calls you
              after hours. If we're not the right fit, we'll tell you.
            </p>
            <CTABlock center />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
