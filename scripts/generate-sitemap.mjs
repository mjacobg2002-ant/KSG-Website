// Generates public/sitemap.xml (with <lastmod>) and public/robots.txt at build
// time. Article URLs + dates are parsed from src/app/data/articles.ts so new
// posts are picked up automatically — no manual sitemap editing.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SITE = "https://www.kindsupplydigital.com";
const today = new Date().toISOString().slice(0, 10);

// --- Parse articles (slug + dateISO) straight from the data file ---
const articlesSrc = readFileSync(
  resolve(root, "src/app/data/articles.ts"),
  "utf8"
);
const articles = [];
const blockRe = /slug:\s*"([^"]+)"[\s\S]*?dateISO:\s*"([^"]+)"/g;
let m;
while ((m = blockRe.exec(articlesSrc)) !== null) {
  articles.push({ slug: m[1], dateISO: m[2] });
}

// --- Static routes ---
const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/services", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/case-studies", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/process", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/about", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/contact", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/insights", changefreq: "weekly", priority: "0.7", lastmod: articles[0]?.dateISO || today },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3", lastmod: today },
  { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: today },
];

const articleRoutes = articles.map((a) => ({
  path: `/insights/${a.slug}`,
  changefreq: "monthly",
  priority: "0.6",
  lastmod: a.dateISO,
}));

const urls = [...staticRoutes, ...articleRoutes]
  .map(
    (r) =>
      `  <url><loc>${SITE}${r.path}</loc><lastmod>${r.lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
writeFileSync(resolve(root, "public/robots.txt"), robots);
console.log(
  `[sitemap] wrote ${staticRoutes.length + articleRoutes.length} URLs (${articles.length} articles) + robots.txt`
);
