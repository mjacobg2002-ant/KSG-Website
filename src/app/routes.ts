import type { RouteRecord } from "vite-react-ssg";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { ProcessPage } from "./pages/ProcessPage";
import { InsightsPage } from "./pages/InsightsPage";
import { InsightArticlePage } from "./pages/InsightArticlePage";
import { ContactPage } from "./pages/ContactPage";
import { DentalMarketingPage } from "./pages/DentalMarketingPage";
import { DentalRoiPage } from "./pages/DentalRoiPage";
import { AuditPage } from "./pages/AuditPage";
import { DemoCallPage } from "./pages/DemoCallPage";
import { MapGapPage } from "./pages/MapGapPage";
import { PortalPage } from "./pages/PortalPage";
import { StartPage } from "./pages/StartPage";
import { SpeedToLeadPage } from "./pages/SpeedToLeadPage";
import { SpeedToLeadWelcomePage } from "./pages/SpeedToLeadWelcomePage";
import { CartPage } from "./pages/CartPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Plain route records consumed by vite-react-ssg (which builds the router
// internally for both static generation and client hydration).
export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicesPage },
      { path: "dental-marketing", Component: DentalMarketingPage },
      { path: "dental-roi", Component: DentalRoiPage },
      { path: "audit", Component: AuditPage },
      { path: "demo-call", Component: DemoCallPage },
      { path: "map-gap", Component: MapGapPage },
      { path: "start", Component: StartPage },
      { path: "speed-to-lead", Component: SpeedToLeadPage },
      { path: "speed-to-lead/welcome", Component: SpeedToLeadWelcomePage },
      { path: "cart", Component: CartPage },
      { path: "portal/:slug", Component: PortalPage },
      { path: "case-studies", Component: CaseStudiesPage },
      { path: "process", Component: ProcessPage },
      { path: "insights", Component: InsightsPage },
      { path: "insights/:slug", Component: InsightArticlePage },
      { path: "contact", Component: ContactPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms", Component: TermsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
];
