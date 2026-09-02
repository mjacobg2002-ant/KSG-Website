import { Head } from "vite-react-ssg";

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
  // Base organization schema (always present)
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

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kind Supply Digital",
    url: SITE,
    publisher: { "@id": `${SITE}/#organization` },
  };

  const pageSchema = structuredData
    ? { "@context": "https://schema.org", ...structuredData }
    : null;

  let breadcrumbSchema: Record<string, unknown> | null = null;
  if (canonical && canonical !== SITE && canonical !== `${SITE}/`) {
    const segments = canonical.replace(SITE, "").split("/").filter(Boolean);
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        ...segments.map((seg, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          item: `${SITE}/${segments.slice(0, i + 1).join("/")}`,
        })),
      ],
    };
  }

  return (
    <Head>
      <html lang="en" dir="ltr" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="author" content="Kind Supply Digital" />
      <meta name="publisher" content="Kind Supply Digital" />

      {/* Local / geo targeting */}
      <meta name="geo.region" content="US-VA" />
      <meta name="geo.placename" content="Northern Virginia" />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Kind Supply Digital" />
      <meta property="og:locale" content="en_US" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content="Kind Supply Digital — Web Design, SEO & Lead Systems" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      {pageSchema && (
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Head>
  );
}
