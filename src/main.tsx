import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./app/routes";
import "./styles/index.css";

// Static-site generation: prerenders real HTML for every route at build time
// (crawlable for SEO) and hydrates into an SPA in the browser.
export const createRoot = ViteReactSSG({ routes });
