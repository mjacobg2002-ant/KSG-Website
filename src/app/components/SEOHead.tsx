import { Head } from "vite-react-ssg";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  /** Extra page-specific JSON-LD (Article, Service, FAQ, Breadcrumb, …). */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

// Canonical host. The site is served on the www subdomain (the apex 301s to
// www), so every canonical / OG / schema URL must use www to stay consistent.
export const SITE = "https://www.kindsupplydigital.com";

// Organization + WebSite schema shared across every page.
const ORG_ID = `${SITE}/#organization`;
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "Kind Supply Digital",
  description:
    "Web design, SEO, local search, paid growth, and lead automation for service businesses across the United States — proven in behavioral health, now serving home services, law firms, and dental. 100% remote.",
  url: `${SITE}/`,
  logo: `${SITE}/og-image.png`,
  image: `${SITE}/og-image.png`,
  email: "partnerships@kindsupplydigital.com",
  priceRange: "$$",
  areaServed: { "@type": "Country", name: "United States" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
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

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Kind Supply Digital",
  url: `${SITE}/`,
  publisher: { "@id": ORG_ID },
};

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
  const canonicalUrl = canonical || `${SITE}/`;
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const pageSchemas = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData]).map(
        (s) => ({ "@context": "https://schema.org", ...s })
      )
    : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <meta name="author" content="Kind Supply Digital" />
      <meta name="publisher" content="Kind Supply Digital" />

      {/* Geo targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Kind Supply Digital" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta
        property="og:image:alt"
        content="Kind Supply Digital — Web Design, SEO & Lead Systems"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      {pageSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
}
