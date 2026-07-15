import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { ProcessPage } from "./pages/ProcessPage";
import { InsightsPage } from "./pages/InsightsPage";
import { InsightArticlePage } from "./pages/InsightArticlePage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
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
      { path: "insights/:slug", Component: InsightArticlePage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
