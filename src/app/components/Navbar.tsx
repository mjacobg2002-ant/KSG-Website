import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "./cart";
import { motion, AnimatePresence } from "motion/react";
import logoWhite from "../../imports/kind-supply-digital-logo-white.svg";
import { BOOKING_URL } from "../booking";
import { AGREEMENT_PATH } from "./dental/dentalConfig";
import { DENTAL_TOOLS, DENTAL_TOOL_PATHS } from "../data/dentalTools";

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

function CartLink() {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-white/80 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
      aria-label={count ? `Cart, ${count} item` : "Cart, empty"}
    >
      <ShoppingCart size={21} aria-hidden="true" />
      {count > 0 && (
        <span
          className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-[#0f172a] flex items-center justify-center"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 700 }}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

const SPEED_TO_LEAD_PATH = "/speed-to-lead";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDental =
    location.pathname === DENTAL_URL || DENTAL_TOOL_PATHS.includes(location.pathname) || location.pathname.startsWith("/portal/");
  const onTool = DENTAL_TOOL_PATHS.includes(location.pathname) || location.pathname.startsWith("/portal/");
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close the tools menu on navigation, outside click and Escape.
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!toolsOpen) return;
    const onDown = (e: MouseEvent) => !toolsRef.current?.contains(e.target as Node) && setToolsOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToolsOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);
  const ctaHref = isDental ? AGREEMENT_PATH : BOOKING_URL;
  const ctaLabel = isDental ? "Review & Enroll" : "Free Consultation";
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
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-6 whitespace-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${link.path === "/" || link.path === "/process" ? "lg:hidden! " : link.path === "/insights" ? "max-xl:hidden! " : ""}transition-colors duration-300 hover:text-white ${
                  location.pathname === link.path ? "text-white" : "text-white/50"
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 400 }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={SPEED_TO_LEAD_PATH}
              className={`transition-colors duration-300 ${
                location.pathname.startsWith(SPEED_TO_LEAD_PATH) ? "text-blue-200" : "text-blue-300/90 hover:text-blue-200"
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 500 }}
            >
              Speed to Lead
            </Link>
            <Link
              to={DENTAL_URL}
              className={`transition-colors duration-300 ${
                location.pathname === DENTAL_URL ? "text-blue-200" : "text-blue-300/90 hover:text-blue-200"
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 500 }}
            >
              Dental Marketing
            </Link>
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                aria-expanded={toolsOpen}
                aria-controls="dental-tools-menu"
                onClick={() => setToolsOpen((o) => !o)}
                className={`inline-flex items-center gap-1 min-h-[44px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 ${
                  onTool ? "text-blue-200" : "text-blue-300/90 hover:text-blue-200"
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.08em", fontWeight: 500 }}
              >
                Dental Tools
                <ChevronDown size={14} className={`transition-transform ${toolsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {toolsOpen && (
                <div id="dental-tools-menu" className="absolute right-0 top-full pt-2 z-50">
                  <ul className="w-[340px] bg-[#0f172a] border border-white/10 shadow-2xl py-2 whitespace-normal">
                    {DENTAL_TOOLS.map((t) => (
                      <li key={t.path}>
                        <Link
                          to={t.path}
                          className={`!flex flex-col !items-start px-5 py-3 hover:bg-white/5 transition-colors ${location.pathname === t.path ? "bg-white/5" : ""}`}
                        >
                          <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>{t.label}</span>
                          <span className="text-white/50 mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.76rem", lineHeight: 1.45 }}>{t.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <CartLink />
            <a
              href={ctaHref}
              target={ctaTarget}
              rel={ctaRel}
              className="px-6 py-2.5 bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 transition-all duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em", fontWeight: 500 }}
            >
              {ctaLabel}
            </a>
          </div>

          {/* Mobile: cart + menu toggle */}
          <div className="lg:hidden flex items-center gap-1">
          <CartLink />
          <button
            className={`lg:hidden text-white p-2 ${isDental ? "min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-blue-300" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
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
            <div className="px-6 py-8 flex flex-col gap-4 max-h-[calc(100dvh-5rem)] overflow-y-auto">
              <Link
                to={SPEED_TO_LEAD_PATH}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3.5 border border-blue-400/40 bg-blue-500/10 text-white"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", fontWeight: 600 }}
              >
                <span>Speed to Lead System</span>
                <span className="text-blue-200" style={{ fontWeight: 500 }}>$497/mo &rarr;</span>
              </Link>
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
              <p className="pt-2 text-white/40 uppercase" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", fontWeight: 600 }}>
                Free Dental Tools
              </p>
              {DENTAL_TOOLS.map((t) => (
                <Link
                  key={t.path}
                  to={t.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-1.5 pl-4 border-l border-white/15 ${location.pathname === t.path ? "text-blue-200" : "text-blue-300/90"}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", letterSpacing: "0.03em", fontWeight: 500 }}
                >
                  {t.label}
                </Link>
              ))}
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
