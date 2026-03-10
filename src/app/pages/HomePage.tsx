import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Code2,
  Search,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Shield,
  Heart,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { StatsSection, TestimonialsSection } from "../components/SocialProof";

const services = [
  {
    icon: Code2,
    title: "Website Design & Development",
    desc: "Custom, conversion-optimized websites built specifically for behavioral health providers. HIPAA-aware design, online scheduling integration, and provider profile pages that build patient trust.",
  },
  {
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    desc: "Local and national SEO strategies that get your practice found when people search for the services you offer. Location pages, content strategy, and technical SEO that compounds over time.",
  },
  {
    icon: BarChart3,
    title: "Lead Generation & Paid Advertising",
    desc: "Targeted ad campaigns on Google and social platforms that drive qualified inquiries — not just clicks. Full tracking and reporting so you know exactly what's working.",
  },
  {
    icon: RefreshCw,
    title: "Referral & Growth Systems",
    desc: "Digital referral management tools, partner outreach portals, and growth infrastructure that scale with your organization as you expand.",
  },
];

const processSteps = [
  { num: "01", title: "Discovery & Strategy", desc: "Deep understanding of your organization, patient journey, and competitive landscape." },
  { num: "02", title: "Digital Architecture", desc: "Planning website structure, SEO strategy, and user experience for healthcare audiences." },
  { num: "03", title: "Design & UX Development", desc: "Creating warm, trustworthy visual systems that resonate with patients and families." },
  { num: "04", title: "Technical Development", desc: "Building HIPAA-conscious, scalable, and fast digital platforms." },
  { num: "05", title: "Launch & Optimization", desc: "Deployment, performance testing, and continuous improvement of patient acquisition." },
];

const caseStudies = [
  {
    title: "Mental Health Clinic Network",
    tags: ["Website Redesign", "SEO Architecture", "Patient Acquisition"],
    result: "Increased new patient inquiries by 340% and improved search visibility across 12 locations.",
    image: "https://images.unsplash.com/photo-1711343777918-6d395c16e37f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY2xpbmljJTIwaGFsbHdheSUyMGJyaWdodCUyMHdlbGNvbWluZ3xlbnwxfHx8fDE3NzMxMTE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Substance Abuse Treatment Center",
    tags: ["Custom Development", "Lead Generation", "Content Strategy"],
    result: "Generated 180+ qualified admissions inquiries per month within 90 days of launch.",
    image: "https://images.unsplash.com/photo-1615397987782-c7cb268de9ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3YWxraW5nJTIwdG93YXJkJTIwbGlnaHQlMjBzaWxob3VldHRlJTIwcmVjb3ZlcnklMjBmcmVlZG9tfGVufDF8fHx8MTc3MzEwOTcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "DDA & Assisted Living Facility",
    tags: ["Full Redesign", "Growth Infrastructure", "Family Outreach"],
    result: "Doubled facility tour bookings and improved family engagement by 210%.",
    image: "https://images.unsplash.com/photo-1589061434060-a05a5335bfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY2FyZWdpdmVyJTIwaG9sZGluZyUyMGVsZGVybHklMjBwZXJzb24lMjBoYW5kJTIwZ2VudGxlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzMxMDk3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const clients = [
  "Mental health and counseling practices",
  "Substance abuse and addiction treatment centers",
  "DDA and assisted living providers",
  "Behavioral health provider groups",
  "Psychiatric and outpatient programs",
  "Community mental health organizations",
];

const trustHighlights = [
  { icon: Shield, label: "HIPAA-Conscious Development" },
  { icon: Search, label: "Healthcare SEO Architecture" },
  { icon: Heart, label: "Patient-Centered UX Strategy" },
  { icon: Layers, label: "Scalable Infrastructure" },
];

const whyChooseUs = [
  "100% focused on healthcare & behavioral health organizations",
  "Clients consistently see a 2–4x increase in patient inquiries",
  "Every build is 100% HIPAA-compliant from the ground up",
  "Dedicated strategist assigned to every project",
  "SEO architecture built into every page from day one",
];

export function HomePage() {
  return (
    <div>
      <SEOHead
        title="Kind Supply Digital | Marketing & Web Design for Behavioral Health Providers"
        description="Kind Supply Digital builds websites, SEO strategies, and digital growth systems for behavioral health practices, treatment centers, and human services organizations."
        keywords="behavioral health marketing agency, mental health web design, treatment center website, DDA facility website, assisted living web design, behavioral health website development, HIPAA website design, patient acquisition, healthcare SEO agency"
        canonical="https://kindsupplydigital.com"
        structuredData={{
          "@type": "ProfessionalService",
          name: "Kind Supply Digital",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "47",
          },
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
              The #1 Digital Agency for Healthcare & Behavioral Health
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
            We Build Websites That
            <br />
            <span className="text-blue-200/50">Fill Your Patient Pipeline</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/50 max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "1.8" }}
          >
            Kind Supply Digital designs and develops high-performance websites
            for mental health clinics, substance abuse centers, DDA facilities,
            and assisted living organizations &mdash; turning your website into
            your most powerful patient acquisition tool.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-blue-300/60 mb-10"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500 }}
          >
            Trusted by 50+ healthcare organizations &middot; 100% HIPAA-compliant builds
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
              Get Your Free Consultation
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/case-studies"
              className="px-10 py-4 border border-blue-400/20 text-blue-200/60 hover:text-white hover:border-blue-400/40 transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400, letterSpacing: "0.05em" }}
            >
              See Our Results
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

      {/* Stats Social Proof */}
      <StatsSection />

      {/* Trust Positioning Section */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-white/50 max-w-3xl mx-auto text-center mb-16"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "2" }}
            >
              We partner exclusively with healthcare organizations that require more than a
              template website. Our work focuses on building digital platforms
              that drive patient trust, referral growth, and long-term
              scalability for clinics and facilities.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustHighlights.map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-blue-400/15 flex items-center justify-center group-hover:border-blue-400/40 transition-colors duration-500">
                    <item.icon size={20} className="text-blue-300/40 group-hover:text-blue-300/80 transition-colors duration-500" />
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
        </div>
      </section>

      {/* Services Preview */}
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
              Strategic Digital Services for Healthcare
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              Every service is designed with one goal: getting more qualified patients
              and families to your door.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <Link to="/services" className="block">
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

      {/* Case Study Preview */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Proven Results
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
              Real Results for Real Organizations
            </h2>
            <p
              className="text-white/40 mb-20 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              We don't just build beautiful websites. We build platforms that generate
              measurable patient acquisition results.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs, i) => (
              <AnimatedSection key={cs.title} delay={i * 0.15}>
                <Link to="/case-studies" className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#162036] rounded-sm">
                    <img
                      src={cs.image}
                      alt={`${cs.title} — behavioral health marketing case study by Kind Supply Digital showing measurable patient acquisition results`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <h3
                    className="text-white mb-3"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 500 }}
                  >
                    {cs.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  <p
                    className="text-white/40"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", lineHeight: "1.6" }}
                  >
                    {cs.result}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3} className="mt-12">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-blue-300/50 hover:text-blue-200 transition-colors group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", letterSpacing: "0.05em" }}
            >
              View All Case Studies
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Process Section */}
      <section className="py-32 border-t border-white/5">
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
              Our Strategic Process
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

      {/* Why Choose Kind Supply */}
      <section className="py-32 border-t border-white/5">
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
                Why Healthcare Organizations Choose Kind Supply Digital
              </h2>
              <p
                className="text-white/40"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.9" }}
              >
                We're not a generalist agency. We focus exclusively on healthcare
                and behavioral health &mdash; which means we understand your patients,
                your compliance requirements, and your growth challenges.
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

      {/* Client Qualification */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p
                className="text-blue-300/30 uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Our Focus
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
                Industries We Serve
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px p-px bg-white/5 max-w-3xl mx-auto">
            {clients.map((c, i) => (
              <AnimatedSection key={c} delay={i * 0.08}>
                <div className="bg-[#0f172a] p-8 text-center group hover:bg-[#162036] transition-colors duration-500">
                  <p
                    className="text-white/40 group-hover:text-blue-200/70 transition-colors duration-500"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
                  >
                    {c}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
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
              Ready to Fill Your Patient Pipeline?
            </h2>
            <p
              className="text-white/45 mb-4 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              We take on a limited number of healthcare clients each quarter to
              ensure every project receives our full strategic attention.
            </p>
            <p
              className="text-blue-300/50 mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Free consultation &middot; No obligation &middot; Response within 24 hours
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