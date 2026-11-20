import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";

/**
 * Hide the LeadConnector chat bubble on the buy flow (/speed-to-lead, /cart):
 * its bubble and greeting popup cover the Add to cart / Checkout buttons on
 * phones. Those pages carry their own "Questions?" links.
 */
function HideChatOnCheckout() {
  const { pathname } = useLocation();
  useEffect(() => {
    const hide = pathname === "/cart" || pathname.startsWith("/speed-to-lead");
    document.documentElement.classList.toggle("hide-chat-widget", hide);
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ScrollToTop />
      <HideChatOnCheckout />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
      <Analytics />
    </div>
  );
}
