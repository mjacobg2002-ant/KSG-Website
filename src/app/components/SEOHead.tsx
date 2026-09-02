import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
}

const SITE = "https://kindsupplydigital.com";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) {
    el.setAttribute("content", content);
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    el.setAttribute("content", content);
    document.head.appendChild(el);
  }
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (el) {
    el.setAttribute("href", href);
  } else {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("href", href);
    document.head.appendChild(el);
  }
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = `${SITE}/og-image.png`,
  structuredData,
  noIndex = false,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    setMeta("viewport", "width=device-width, initial-scale=1, maximum-scale=5");
    setMeta("theme-color", "#0f172a");

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    setMeta("author", "Kind Supply Digital");
    setMeta("publisher", "Kind Supply Digital");

    // Geo targeting (Northern Virginia / DMV)
    setMeta("geo.region", "US-VA");
    setMeta("geo.placename", "Northern Virginia");

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", "Kind Supply Digital", "property");
    setMeta("og:locale", "en_US", "property");
    if (canonical) setMeta("og:url", canonical, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:type", "image/png", "property");
    setMeta("og:image:alt", "Kind Supply Digital — Web Design, SEO & Lead Systems", "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    if (canonical) setLink("canonical", canonical);

    // Structured Data (JSON-LD)
    document.querySelectorAll("script[data-seo-jsonld]").forEach((s) => s.remove());

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE}/#organization`,
      name: "Kind Supply Digital",
      description:
        "Web design, SEO, local search, paid growth, and lead automation for businesses in Northern Virginia and the DMV — proven in behavioral health, now serving home services, law firms, and dental.",
      url: SITE,
      email: "partnerships@kindsupplydigital.com",
      areaServed: [
        { "@type": "AdministrativeArea", name: "Northern Virginia" },
        { "@type": "City", name: "McLean" },
        { "@type": "City", name: "Tysons" },
        { "@type": "City", name: "Arlington" },
        { "@type": "City", name: "Alexandria" },
        { "@type": "City", name: "Fairfax" },
        { "@type": "City", name: "Vienna" },
        { "@type": "City", name: "Falls Church" },
        { "@type": "City", name: "Reston" },
        { "@type": "City", name: "Ashburn" },
        { "@type": "City", name: "Washington, DC" },
        { "@type": "AdministrativeArea", name: "Maryland" },
        { "@type": "AdministrativeArea", name: "DMV" },
      ],
      serviceType: [
        "Search Engine Optimization (SEO)",
        "Local SEO",
        "Google Ads Management",
        "Meta (Facebook & Instagram) Ads Management",
        "Web Design",
        "Google Business Profile Optimization",
        "Lead Generation & CRM Automation",
        "Behavioral Health Website Development",
        "Law Firm Lead Generation",
        "Dental Practice Marketing",
      ],
    };

    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-seo-jsonld", "org");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);

    const webSiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kind Supply Digital",
      url: SITE,
      publisher: { "@id": `${SITE}/#organization` },
    };
    const siteScript = document.createElement("script");
    siteScript.type = "application/ld+json";
    siteScript.setAttribute("data-seo-jsonld", "site");
    siteScript.textContent = JSON.stringify(webSiteSchema);
    document.head.appendChild(siteScript);

    if (structuredData) {
      const pageScript = document.createElement("script");
      pageScript.type = "application/ld+json";
      pageScript.setAttribute("data-seo-jsonld", "page");
      pageScript.textContent = JSON.stringify({ "@context": "https://schema.org", ...structuredData });
      document.head.appendChild(pageScript);
    }

    return () => {
      document.querySelectorAll("script[data-seo-jsonld]").forEach((s) => s.remove());
    };
  }, [title, description, keywords, canonical, ogType, ogImage, structuredData, noIndex]);

  return null;
}
