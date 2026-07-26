export const SITE_URL = "https://impressionscards.in";
export const BRAND_NAME = "Impressions Wedding Cards";
export const BUSINESS_PHONE = "+919526577999";
export const INSTAGRAM_URL = "https://www.instagram.com/impressions_wedding_cards/";
export const MAPS_URL = "https://maps.app.goo.gl/ZJTa4s78fDbU1HjF7";

type MetaEntry =
  { title: string } | { name: string; content: string } | { property: string; content: string };

export function canonicalUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function canonicalLink(path: string) {
  return { rel: "canonical", href: canonicalUrl(path) };
}

export function seoMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = canonicalUrl(path);
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: BRAND_NAME },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ] satisfies MetaEntry[];
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: BRAND_NAME,
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    priceRange: "$$",
    description: "Luxury wedding invitation card design and printing studio in Thrissur, Kerala.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Impressions Castle, Paravattani",
      addressLocality: "Thrissur",
      addressRegion: "Kerala",
      postalCode: "680005",
      addressCountry: "IN",
    },
    hasMap: MAPS_URL,
    sameAs: [INSTAGRAM_URL],
    areaServed: ["Thrissur", "Kerala", "South India", "India"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Wedding card printing in Thrissur" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Custom wedding invitation design" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Luxury wedding invitation cards" },
      },
    ],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    sameAs: [INSTAGRAM_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BUSINESS_PHONE,
        contactType: "customer service",
        areaServed: "IN",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
