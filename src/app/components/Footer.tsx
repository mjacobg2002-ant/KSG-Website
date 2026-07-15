import { Link } from "react-router";
import { Mail, MapPin } from "lucide-react";
import logoWhite from "../../imports/kind-supply-digital-logo-white.svg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Process", path: "/process" },
  { label: "Insights", path: "/insights" },
];

const serviceLinks = [
  { label: "Missed-Call Text-Back", path: "/services" },
  { label: "Speed-to-Lead Automation", path: "/services" },
  { label: "CRM & Lead Tracking", path: "/services" },
  { label: "Client-Acquisition Websites", path: "/services" },
  { label: "Local SEO & Paid Ads", path: "/services" },
];

const industryLinks = [
  "Behavioral Health",
  "HVAC & Home Services",
  "Plumbing & Roofing",
  "Law Firms",
  "Dental",
];

export function Footer() {
  return (
    <footer className="bg-[#0a1120] border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="Kind Supply Digital - Homepage">
              <img
                src={logoWhite}
                alt="Kind Supply Digital"
                className="h-9 w-auto mb-6"
              />
            </Link>
            <p
              className="text-white/40 max-w-xs mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", lineHeight: "1.7" }}
            >
              Strategic web design, SEO, and growth systems — proven in behavioral
              health, now serving HVAC, home services, law firms, and dental
              practices. Home of the Lead Rescue System.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:partnerships@kindsupplydigital.com"
                className="flex items-center gap-2 text-white/40 hover:text-blue-300 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
              >
                <Mail size={13} />
                partnerships@kindsupplydigital.com
              </a>
              <span
                className="flex items-center gap-2 text-white/30"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
              >
                <MapPin size={13} />
                United States
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="text-white/60 uppercase tracking-[0.15em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
            >
              Navigation
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <p
              className="text-white/60 uppercase tracking-[0.15em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
            >
              Services
            </p>
            <div className="flex flex-col gap-3">
              {serviceLinks.map((s) => (
                <Link
                  key={s.label}
                  to={s.path}
                  className="text-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Industries & CTA */}
          <div>
            <p
              className="text-white/60 uppercase tracking-[0.15em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
            >
              Industries We Serve
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {industryLinks.map((s) => (
                <span
                  key={s}
                  className="text-white/35"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
                >
                  {s}
                </span>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-block px-6 py-2.5 bg-blue-500 text-white hover:bg-blue-400 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em", fontWeight: 500 }}
            >
              Free Consultation
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
            &copy; 2026 Kind Supply Digital. All rights reserved.
          </p>
          <p className="text-white/20" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
            Northern Virginia &middot; Home Services &middot; Behavioral Health &middot; Legal &middot; Dental
          </p>
        </div>
      </div>
    </footer>
  );
}