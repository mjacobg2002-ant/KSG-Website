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
  ogImage,
  structuredData,
  noIndex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // HTML lang attribute
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    // Viewport (critical for mobile SEO)
    setMeta("viewport", "width=device-width, initial-scale=1, maximum-scale=5");

    // Theme color
    setMeta("theme-color", "#0f172a");

    // Core meta
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("author", "Kind Supply Digital");
    setMeta("publisher", "Kind Supply Digital");

    // Geo targeting
    setMeta("geo.region", "US");
    setMeta("geo.placename", "United States");

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", "Kind Supply Digital", "property");
    setMeta("og:locale", "en_US", "property");
    if (canonical) setMeta("og:url", canonical, "property");
    if (ogImage) {
      setMeta("og:image", ogImage, "property");
      setMeta("og:image:width", "1200", "property");
      setMeta("og:image:height", "630", "property");
      setMeta("og:image:type", "image/jpeg", "property");
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // Canonical
    if (canonical) setLink("canonical", canonical);

    // Structured Data (JSON-LD)
    // Remove all existing SEO JSON-LD scripts
    document.querySelectorAll('script[data-seo-jsonld]').forEach(s => s.remove());

    // Base organization schema (always present)
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://kindsupplydigital.com/#organization",
      name: "Kind Supply Digital",
      description:
        "Premium healthcare digital agency specializing in strategic website development, SEO-optimized platforms, and patient acquisition systems for mental health clinics, substance abuse centers, DDA facilities, and assisted living organizations.",
      url: "https://kindsupplydigital.com",
      email: "contact@kindsupplyco.org",
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      serviceType: [
        "Healthcare Website Design",
        "Mental Health Clinic SEO",
        "Substance Abuse Treatment Center Web Development",
        "Assisted Living Website Design",
        "DDA Facility Digital Marketing",
        "Behavioral Health Website Development",
        "Patient Acquisition Strategy",
        "Healthcare Content Marketing",
      ],
      knowsAbout: [
        "Healthcare Web Design",
        "Mental Health SEO",
        "HIPAA-Conscious Development",
        "Patient Acquisition",
        "Behavioral Health Marketing",
        "Treatment Center Web Development",
        "Local SEO for Healthcare",
        "Medical Practice Marketing",
      ],
      priceRange: "$5,000 - $20,000+",
      sameAs: [],
    };

    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-seo-jsonld", "org");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);

    // WebSite schema with search
    const webSiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kind Supply Digital",
      url: "https://kindsupplydigital.com",
      publisher: {
        "@id": "https://kindsupplydigital.com/#organization",
      },
    };

    const siteScript = document.createElement("script");
    siteScript.type = "application/ld+json";
    siteScript.setAttribute("data-seo-jsonld", "site");
    siteScript.textContent = JSON.stringify(webSiteSchema);
    document.head.appendChild(siteScript);

    // Page-specific structured data
    if (structuredData) {
      const pageSchema = {
        "@context": "https://schema.org",
        ...structuredData,
      };
      const pageScript = document.createElement("script");
      pageScript.type = "application/ld+json";
      pageScript.setAttribute("data-seo-jsonld", "page");
      pageScript.textContent = JSON.stringify(pageSchema);
      document.head.appendChild(pageScript);
    }

    // BreadcrumbList schema
    if (canonical && canonical !== "https://kindsupplydigital.com") {
      const pathSegments = canonical.replace("https://kindsupplydigital.com", "").split("/").filter(Boolean);
      const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kindsupplydigital.com",
          },
          ...pathSegments.map((seg, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: seg.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            item: `https://kindsupplydigital.com/${pathSegments.slice(0, i + 1).join("/")}`,
          })),
        ],
      };
      const breadScript = document.createElement("script");
      breadScript.type = "application/ld+json";
      breadScript.setAttribute("data-seo-jsonld", "breadcrumb");
      breadScript.textContent = JSON.stringify(breadcrumbs);
      document.head.appendChild(breadScript);
    }

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach(s => s.remove());
    };
  }, [title, description, keywords, canonical, ogType, ogImage, structuredData, noIndex]);

  return null;
}