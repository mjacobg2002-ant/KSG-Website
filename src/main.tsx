import { ViteReactSSG } from "vite-react-ssg";
import type { RouteRecord } from "vite-react-ssg";
import { routes } from "./app/routes";
import { articles } from "./app/data/articles";
import "./styles/index.css";

// vite-react-ssg statically generates real HTML (with a fully-populated <head>)
// for every route at build time, then hydrates the same React tree on the client.
export const createRoot = ViteReactSSG({ routes });

// Expand the dynamic /insights/:slug route into one static page per article, and
// keep every crawlable static route. Anything with a param placeholder or the
// catch-all ("*") is dropped from the prerender list.
// NOTE: vite-react-ssg reads this as a NAMED export from the entry module.
export function includedRoutes(paths: string[], _routes: Readonly<RouteRecord[]>) {
  const staticPaths = paths.filter((p) => !p.includes(":") && !p.includes("*"));
  const articlePaths = articles.map((a) => `/insights/${a.slug}`);
  // "/404" is matched by the catch-all route and renders NotFoundPage, so this
  // emits dist/404.html — which Vercel serves (with a real 404 status) for any
  // unmatched URL, avoiding soft-404s.
  return Array.from(new Set([...staticPaths, ...articlePaths, "/404"]));
}
