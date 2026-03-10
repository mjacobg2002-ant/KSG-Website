import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";

export function NotFoundPage() {
  return (
    <div>
      <SEOHead
        title="Page Not Found | Kind Supply Digital"
        description="The page you're looking for doesn't exist. Return to Kind Supply Digital's homepage to explore our behavioral health marketing services."
        canonical="https://kindsupplydigital.com/404"
        noIndex
      />
      <section className="pt-32 pb-32 min-h-[70vh] flex items-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p
              className="text-blue-300/20 mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(6rem, 15vw, 12rem)",
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              404
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Page Not Found
            </h1>
            <p
              className="text-white/40 mb-12 max-w-lg mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-10 py-4 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group flex items-center justify-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
              >
                Return Home
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border border-blue-400/20 text-blue-200/60 hover:text-white hover:border-blue-400/40 transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 400, letterSpacing: "0.05em" }}
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
