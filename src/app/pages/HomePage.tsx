import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Code2,
  PhoneMissed,
  LayoutDashboard,
  Search,
  BarChart3,
  Star,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { StatsSection } from "../components/SocialProof";
import { LeadRescueDemo } from "../components/LeadRescueDemo";
import { PipelineBoard } from "../components/PipelineBoard";

const services = [
  {
    icon: PhoneMissed,
    title: "Missed-Call Text-Back & Speed-to-Lead",
    desc: "The moment a call goes unanswered, your customer gets a text in under 60 seconds. Routine jobs book themselves. Real emergencies get flagged straight to your phone. Form leads get answered before they finish reading a competitor's homepage.",
  },
  {
    icon: Code2,
    title: "Client-Acquisition Websites",
    desc: "Full rebuilds designed to make the phone ring — not to win design awards. Fast on a phone in a driveway, click-to-call in the thumb zone, booking in two taps, and every form wired straight into your follow-up system.",
  },
  {
    icon: LayoutDashboard,
    title: "CRM & Lead Pipeline",
    desc: "Every call, text, form fill, and ad click lands in one pipeline with a name and a dollar value attached. You see who came in, who booked, who went quiet, and what each job was worth — from your phone, in real time.",
  },
  {
    icon: Search,
    title: "Local SEO & Content",
    desc: "Service-area pages, schema, and Google Business Profile alignment that put you on the map — literally — when someone nearby searches at 11 PM with water on the floor.",
  },
  {
    icon: BarChart3,
    title: "Paid Ads Management",
    desc: "Google and Meta campaigns pointed into a funnel that actually answers. Every dollar of spend is tracked to a booked job, not a click.",
  },
  {
    icon: Star,
    title: "Review Automation",
    desc: "Every completed job triggers a review request automatically. More five-star reviews means more calls — and the flywheel runs without you thinking about it.",
  },
];

const processSteps = [
  { num: "01", title: "The Audit Call", desc: "Fifteen minutes. We call your business line after hours and show you exactly what your customers experience when nobody picks up." },
  { num: "02", title: "Build & Configure", desc: "We map your services, hours, and pricing into the system, then build every workflow around how your business actually runs." },
  { num: "03", title: "Carrier Registration", desc: "Business texting in the US requires carrier approval before messages deliver reliably. We start it the day you sign — it's the part nobody can rush." },
  { num: "04", title: "Test Against Real Scenarios", desc: "Emergency at 2 AM. Routine call at 2 PM. Tire-kicker on a Sunday. Every path gets tested before a single customer touches it." },
  { num: "05", title: "Live & Tracked", desc: "The system goes on. Every lead is captured, every outcome logged, and you get a clear view of what came in, what booked, and what it was worth." },
];

const niches = [
  { name: "Plumbing", hook: "Emergency · After hours", desc: "Burst pipes don't wait for business hours. If you don't answer at 11 PM, the next plumber does." },
  { name: "HVAC", hook: "Seasonal surge", desc: "First 90-degree day, every phone in the county rings at once. The system answers all of them while you're on a roof." },
  { name: "Roofing", hook: "High ticket", desc: "One storm, one week of leads, one shot to answer first. Missed calls here cost five figures." },
  { name: "Law Firms", hook: "Signed cases", desc: "Personal injury and family law callers contact three firms. The one that responds first signs the case." },
  { name: "Dental", hook: "Chair time", desc: "Every unanswered new-patient call is a lifetime of recurring visits walking to the practice down the road." },
  { name: "Home Services", hook: "Everything else", desc: "Electrical, garage doors, landscaping, remodeling — if a stranger calls you needing help today, this works." },
];

const pricing = [
  {
    name: "Lead Rescue System",
    role: "Most popular · Start here",
    price: "$1,200",
    priceNote: "setup, then $300/mo",
    featured: true,
    features: [
      "Missed-call text-back on your line",
      "Speed-to-lead automation",
      "Emergency flagging to your phone",
      "Full CRM lead tracking",
      "Live in 7 days",
    ],
  },
  {
    name: "Growth Site & System",
    role: "Foundation + system",
    price: "$2,997",
    priceNote: "setup, plus monthly retainer",
    featured: false,
    features: [
      "Everything in Lead Rescue",
      "Full client-acquisition website rebuild",
      "Local SEO foundation",
      "Review automation",
      "Monthly reporting",
    ],
  },
  {
    name: "Growth Partner",
    role: "Full growth partner",
    price: "Custom",
    priceNote: "scoped to your market and goals",
    featured: false,
    features: [
      "Everything in Growth Site & System",
      "Paid ads management",
      "Ongoing content & SEO",
      "Database reactivation campaigns",
      "Quarterly growth strategy",
    ],
  },
];

const trustHighlights = [
  { icon: Zap, label: "Under 60-Second Response" },
  { icon: Clock, label: "Live in Seven Days" },
  { icon: ShieldCheck, label: "No Long-Term Contract" },
  { icon: RefreshCw, label: "You Keep Your Number" },
];

const whyChooseUs = [
  "We only work with local service businesses — we know your buyer, not a template",
  "The whole path is one system: site, follow-up, CRM, and reporting",
  "Live in seven days, and you touch essentially nothing to get there",
  "You keep your existing business number, trucks and listings unchanged",
  "One job in your first 30 days, or we refund the setup fee",
];

export function HomePage() {
  return (
    <div>
      <SEOHead
        title="Kind Supply Digital | Websites & Lead Systems for Local Service Businesses"
        description="Kind Supply Digital builds client-acquisition websites, missed-call text-back, speed-to-lead automation, and CRM lead tracking for plumbing, HVAC, roofing, legal, and dental businesses in Northern Virginia."
        keywords="missed call text back, speed to lead, plumbing marketing agency, HVAC lead generation, roofing marketing, local service business CRM, Northern Virginia marketing agency, GoHighLevel agency, home services website design, contractor lead system"
        canonical="https://kindsupplydigital.com"
        structuredData={{
          "@type": "ProfessionalService",
          name: "Kind Supply Digital",
          areaServed: "Northern Virginia",
        }}
      />

      {/* Hero Section */}
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
              className="text-blue-300/50 uppercase tracking-[0.3em] mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500 }}
            >
              Growth Systems for Northern Virginia Service Businesses
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-white mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            You Don't Lose Jobs to Bad Work.
            <br />
            <span className="text-blue-200/50">You Lose Them to Voicemail.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/50 max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "1.8" }}
          >
            Kind Supply Digital builds the whole machine for plumbing, HVAC, roofing,
            legal, and dental businesses &mdash; the website that turns clicks into calls,
            the automation that answers in under 60 seconds, and the CRM that tracks
            every lead to the dollar.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-blue-300/60 mb-10"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500 }}
          >
            Live in 7 days &middot; You touch nothing &middot; No long-term contract
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="px-10 py-4 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group flex items-center justify-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Book a 15-Minute Audit
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="px-10 py-4 border border-blue-400/20 text-blue-200/60 hover:text-white hover:border-blue-400/40 transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400, letterSpacing: "0.05em" }}
            >
              See the System
            </Link>
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

      {/* Stats */}
      <StatsSection />

      {/* The Leak + Live Demo */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                The Leak
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
                Every Missed Call Is a Customer Calling Your Competitor
              </h2>
              <p
                className="text-white/40 mb-10"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
              >
                Roughly a quarter of calls to local service businesses go unanswered &mdash;
                nights, weekends, or while you're under a sink with both hands full. The
                caller doesn't leave a voicemail. They dial the next name on Google.
                One recovered job can pay for this system for a year.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trustHighlights.map((item, i) => (
                  <AnimatedSection key={item.label} delay={i * 0.1}>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full border border-blue-400/15 flex items-center justify-center shrink-0 group-hover:border-blue-400/40 transition-colors duration-500">
                        <item.icon size={16} className="text-blue-300/40 group-hover:text-blue-300/80 transition-colors duration-500" />
                      </div>
                      <p
                        className="text-white/50 group-hover:text-white/70 transition-colors duration-500"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", letterSpacing: "0.03em" }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <LeadRescueDemo />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              What We Do
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
              One System. Every Lead Captured, Answered, and Tracked.
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Most agencies sell you a piece. We build the whole path a customer walks &mdash;
              from the search that finds you to the invoice that closes.
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

          <AnimatedSection delay={0.2} className="mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-blue-300/50 hover:text-blue-200 transition-colors group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", letterSpacing: "0.05em" }}
            >
              Explore All Services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CRM Pipeline */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              The CRM
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
              Stop Guessing Where Your Leads Went
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Every call, text, form fill, and ad click lands in one pipeline. You see who
              came in, who booked, who went quiet, and what each job was worth &mdash; on your
              phone, in real time.
            </p>
          </AnimatedSection>

          <PipelineBoard />
        </div>
      </section>

      {/* Process */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              How We Work
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
              Live in Seven Days. You Touch Nothing.
            </h2>
          </AnimatedSection>

          <div className="space-y-0">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.1}>
                <div className="flex gap-8 lg:gap-16 py-8 border-b border-white/5 group hover:bg-white/[0.02] transition-colors duration-500 px-4 -mx-4">
                  <span
                    className="text-blue-400/15 group-hover:text-blue-400/40 transition-colors duration-500 shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      className="text-white/70 group-hover:text-white transition-colors duration-500 mb-2"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 500 }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-white/30 group-hover:text-white/45 transition-colors duration-500"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Niches */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Who We Serve
              </p>
              <h2
                className="text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                Built for Businesses That Live and Die by the Phone
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {niches.map((n, i) => (
              <AnimatedSection key={n.name} delay={i * 0.08}>
                <div className="bg-[#0f172a] p-10 h-full group hover:bg-[#162036] transition-colors duration-500">
                  <p
                    className="text-blue-300/40 uppercase tracking-[0.2em] mb-4"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500 }}
                  >
                    {n.hook}
                  </p>
                  <h3
                    className="text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}
                  >
                    {n.name}
                  </h3>
                  <p
                    className="text-white/40"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: "1.7" }}
                  >
                    {n.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
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
              Straightforward Pricing. No Surprise Line Items.
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Start with the system that stops the bleeding. Add the site and the growth
              engine when the phone is already ringing.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
            {pricing.map((p, i) => (
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
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
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
                    Book a Call
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Guarantee */}
          <AnimatedSection delay={0.2}>
            <div className="mt-px bg-[#0c1525] border border-blue-400/20 p-10 lg:p-14 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-full border border-blue-400/25 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-blue-300/70" />
              </div>
              <div>
                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400 }}
                >
                  The One-Job Guarantee
                </h3>
                <p
                  className="text-white/45 max-w-3xl"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.9" }}
                >
                  If the Lead Rescue System doesn't catch you at least one job in your first
                  30 days, we refund your setup fee. One recovered call usually covers the
                  system for months &mdash; and if it doesn't, you shouldn't be paying for it.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <AnimatedSection>
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Why Us
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
                Why Service Businesses Choose Kind Supply Digital
              </h2>
              <p
                className="text-white/40"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
              >
                We're not a generalist agency chasing every industry. We build for
                businesses where a stranger picks up the phone with a problem that
                needs solving today &mdash; which means we understand your customer,
                your hours, and where your money actually leaks out.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="space-y-5 pt-4">
                {whyChooseUs.map((item, i) => (
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

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#131d32] to-[#0f172a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p
              className="text-blue-300/40 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Try It Yourself
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
              Call Your Own Business After Hours Tonight
            </h2>
            <p
              className="text-white/45 mb-4 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              If nothing texts you back, that's exactly what every customer experiences.
              Book 15 minutes and we'll show you the fix running live on your number &mdash;
              before you pay for anything.
            </p>
            <p
              className="text-blue-300/50 mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
            >
              No contract &middot; Live in 7 days &middot; One-job guarantee
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Book a 15-Minute Audit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
