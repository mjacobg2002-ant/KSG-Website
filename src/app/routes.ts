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
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { articles } from "./data/articles";

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicesPage },
      { path: "case-studies", Component: CaseStudiesPage },
      { path: "process", Component: ProcessPage },
      { path: "insights", Component: InsightsPage },
      {
        path: "insights/:slug",
        Component: InsightArticlePage,
        // Prerender a static page for every article.
        getStaticPaths: () => articles.map((a) => `/insights/${a.slug}`),
      },
      { path: "contact", Component: ContactPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms", Component: TermsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
];
