import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoWhite from "../../imports/kind-supply-digital-logo-white.svg";
import { BOOKING_URL } from "../booking";

// Dental division page (React route). The Westpark case study stays linked
// from that page and from the footer.
const DENTAL_URL = "/dental-marketing";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Work", path: "/case-studies" },
  { label: "Process", path: "/process" },
  { label: "Insights", path: "/insights" },
  { label: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDental = location.pathname === DENTAL_URL;
  const ctaHref = isDental ? "#assessment" : BOOKING_URL;
  const ctaLabel = isDental ? "Free Assessment" : "Free Consultation";
  const ctaTarget = isDental ? undefined : "_blank";
  const ctaRel = isDental ? undefined : "noopener noreferrer";

  // Transparent over the hero at the very top; fade in the navy background once
  // the visitor scrolls (or when the mobile menu is open, for legibility).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasBackground = scrolled || mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasBackground
          ? "bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent border-b border-transparent"
      } ${isDental ? "[&_a]:inline-flex [&_a]:items-center [&_a]:min-h-[44px] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-blue-300" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center shrink-0" aria-label="Kind Supply Digital - Homepage">
            <img
              src={logoWhite}
              alt="Kind Supply Digital"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 whitespace-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-300 hover:text-white ${
                  location.pathname === link.path ? "text-white" : "text-white/50"
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 400 }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={DENTAL_URL}
              className={`transition-colors duration-300 ${
                location.pathname === DENTAL_URL ? "text-blue-200" : "text-blue-300/90 hover:text-blue-200"
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 500 }}
            >
              Dental Marketing
            </Link>
            <a
              href={ctaHref}
              target={ctaTarget}
              rel={ctaRel}
              className="ml-2 px-6 py-2.5 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em", fontWeight: 500 }}
            >
              {ctaLabel}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden text-white p-2 ${isDental ? "min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-blue-300" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0f172a] border-t border-white/5 overflow-hidden"
          >
            <div className={`px-6 py-8 flex flex-col gap-4 ${isDental ? "max-h-[calc(100dvh-5rem)] overflow-y-auto" : ""}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2 transition-colors ${
                    location.pathname === link.path ? "text-white" : "text-white/50"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={DENTAL_URL}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-blue-300/90"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", letterSpacing: "0.05em", fontWeight: 500 }}
              >
                Dental Marketing
              </Link>
              <a
                href={ctaHref}
                target={ctaTarget}
                rel={ctaRel}
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-6 py-3 bg-blue-500 text-[#0f172a] font-medium text-center justify-center"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
              >
                {ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
