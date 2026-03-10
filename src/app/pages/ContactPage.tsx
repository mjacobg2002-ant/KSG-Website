import { useState, useRef } from "react";
import { ArrowRight, Check, Mail, Loader2 } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-88bd143f`;

const budgetOptions = [
  "$5,000 - $10,000",
  "$10,000 - $20,000",
  "$20,000+",
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: nameRef.current?.value || "",
      email: emailRef.current?.value || "",
      company: companyRef.current?.value || "",
      industry: industryRef.current?.value || "",
      website: websiteRef.current?.value || "",
      budget: selectedBudget || "Not selected",
      details: detailsRef.current?.value || "",
    };

    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Inquiry submission error:", data);
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      console.log("Inquiry submitted successfully:", data);
      setSubmitted(true);
    } catch (err) {
      console.error("Network error submitting inquiry:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SEOHead
        title="Get a Free Behavioral Health Marketing Consultation | Kind Supply Digital"
        description="Schedule a free consultation with Kind Supply Digital. We help behavioral health providers, mental health clinics, treatment centers, and assisted living facilities grow with premium web design, SEO, and digital marketing. Response within 24 hours."
        keywords="behavioral health marketing consultation, contact Kind Supply Digital, mental health clinic website quote, treatment center web design inquiry, healthcare digital marketing consultation, free website audit"
        canonical="https://kindsupplydigital.com/contact"
        structuredData={{
          "@type": "ContactPage",
          mainEntity: {
            "@type": "Organization",
            name: "Kind Supply Digital",
            email: "contact@kindsupplyco.org",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              email: "contact@kindsupplyco.org",
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
              Whether you're launching a new practice, redesigning your website, or looking to scale
              patient volume — we'd love to hear what you're working on.
            </p>
            <div className="mb-6">
              <p
                className="text-blue-300/30 uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
              >
                What to expect
              </p>
              <ul className="space-y-2">
                <li
                  className="text-white/50 flex items-start gap-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
                >
                  <span className="text-blue-400/30 mt-1 shrink-0">—</span>
                  A 20–30 minute conversation about your goals and challenges
                </li>
                <li
                  className="text-white/50 flex items-start gap-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
                >
                  <span className="text-blue-400/30 mt-1 shrink-0">—</span>
                  An honest assessment of your current digital presence
                </li>
                <li
                  className="text-white/50 flex items-start gap-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
                >
                  <span className="text-blue-400/30 mt-1 shrink-0">—</span>
                  Clear recommendations on where to focus first
                </li>
              </ul>
            </div>
            <p
              className="text-white/35 mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.6" }}
            >
              No pressure, no cookie-cutter pitch. Just a real conversation about what growth could
              look like for your organization.
            </p>
            <div className="flex items-center gap-2 text-blue-300/60">
              <Mail size={15} />
              <a
                href="mailto:contact@kindsupplyco.org"
                className="hover:text-blue-200 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
              >
                contact@kindsupplyco.org
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {submitted ? (
            <AnimatedSection>
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-blue-400/30 flex items-center justify-center">
                  <Check size={28} className="text-blue-300" />
                </div>
                <h2
                  className="text-white mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                  }}
                >
                  Inquiry Received
                </h2>
                <p
                  className="text-white/70 mb-6"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
                >
                  Thank you for reaching out. We've received your inquiry and will
                  get back to you within 24 hours.
                </p>
                <p
                  className="text-white/45"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                >
                  In the meantime, feel free to reach us directly at{" "}
                  <a
                    href="mailto:contact@kindsupplyco.org"
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    contact@kindsupplyco.org
                  </a>
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="p-4 border border-red-400/30 bg-red-500/10 rounded">
                    <p
                      className="text-red-300"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                    >
                      {error}
                    </p>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label
                      className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                    >
                      Name *
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      required
                      className="w-full bg-white/5 border-b border-white/20 pb-3 px-2 pt-2 text-white focus:border-blue-400/70 focus:outline-none transition-colors placeholder:text-white/35"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                    >
                      Email *
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      className="w-full bg-white/5 border-b border-white/20 pb-3 px-2 pt-2 text-white focus:border-blue-400/70 focus:outline-none transition-colors placeholder:text-white/35"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                      placeholder="email@company.com"
                    />
                  </div>
                </div>

                {/* Company & Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label
                      className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                    >
                      Company *
                    </label>
                    <input
                      ref={companyRef}
                      type="text"
                      required
                      className="w-full bg-white/5 border-b border-white/20 pb-3 px-2 pt-2 text-white focus:border-blue-400/70 focus:outline-none transition-colors placeholder:text-white/35"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                      placeholder="Your organization name"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                    >
                      Industry *
                    </label>
                    <input
                      ref={industryRef}
                      type="text"
                      required
                      className="w-full bg-white/5 border-b border-white/20 pb-3 px-2 pt-2 text-white focus:border-blue-400/70 focus:outline-none transition-colors placeholder:text-white/35"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                      placeholder="e.g. Mental Health, Substance Abuse, DDA"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label
                    className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                  >
                    Current Website (optional)
                  </label>
                  <input
                    ref={websiteRef}
                    type="url"
                    className="w-full bg-white/5 border-b border-white/20 pb-3 px-2 pt-2 text-white focus:border-blue-400/70 focus:outline-none transition-colors placeholder:text-white/35"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label
                    className="block text-white/70 uppercase tracking-[0.15em] mb-5"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                  >
                    Project Budget *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBudget(b)}
                        className={`px-6 py-3 border transition-all duration-300 ${
                          selectedBudget === b
                            ? "border-blue-400/70 text-white bg-blue-500/20"
                            : "border-white/20 text-white/60 hover:border-blue-400/40 hover:text-white/80"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label
                    className="block text-white/70 uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
                  >
                    Project Details *
                  </label>
                  <textarea
                    ref={detailsRef}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/20 p-4 text-white focus:border-blue-400/60 focus:outline-none transition-colors resize-none placeholder:text-white/35"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.7" }}
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
                  >
                    {submitting ? (
                      <>
                        Submitting...
                        <Loader2 size={18} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}