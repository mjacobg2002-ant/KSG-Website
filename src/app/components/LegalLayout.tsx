import { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

/* ---------- Section heading ---------- */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AnimatedSection>
      <section className="py-10 border-b border-white/5">
        <h2
          className="text-white mb-5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
        <div className="space-y-4">{children}</div>
      </section>
    </AnimatedSection>
  );
}

/* ---------- Body paragraph ---------- */
export function LegalText({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-white/45"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.9" }}
    >
      {children}
    </p>
  );
}

/* ---------- Bulleted list ---------- */
export function LegalList({ items }: { items: (string | ReactNode)[] }) {
  return (
    <ul className="space-y-3 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-blue-400/40 mt-2 w-1 h-1 rounded-full bg-blue-400/40 shrink-0" aria-hidden="true" />
          <span
            className="text-white/45"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.9" }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Page shell ---------- */
export function LegalLayout({
  eyebrow,
  title,
  effectiveDate,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              {eyebrow}
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
            <p
              className="text-white/50 mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.02rem", lineHeight: "1.85" }}
            >
              {intro}
            </p>
            <p
              className="text-white/25"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}
            >
              Effective {effectiveDate}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Body */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">{children}</div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#131d32] to-[#0f172a]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2
              className="text-white mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Questions About This Policy?
            </h2>
            <p
              className="text-white/45 mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "1.8" }}
            >
              We're happy to explain anything here in plain language. Reach out at{" "}
              <a
                href="mailto:partnerships@kindsupplydigital.com"
                className="text-blue-300/80 hover:text-blue-200 transition-colors"
              >
                partnerships@kindsupplydigital.com
              </a>
              .
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Contact Us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
