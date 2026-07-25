export const SITE_URL = "https://impressionscards.in";
export const BRAND_NAME = "Impressions Wedding Cards";
export const BUSINESS_PHONE = "+919526577999";
export const BUSINESS_PHONE_DISPLAY = "095265 77999";
export const BUSINESS_PHONE_SECONDARY = "+919020077999";
export const INSTAGRAM_URL = "https://www.instagram.com/impressions_wedding_cards/";
export const MAPS_URL = "https://maps.app.goo.gl/ZJTa4s78fDbU1HjF7";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-impressions-wedding-cards.jpg`;

type MetaEntry =
  { title: string } | { name: string; content: string } | { property: string; content: string };

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

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
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: SeoInput) {
  const url = canonicalUrl(path);
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:site_name", content: BRAND_NAME },
    { property: "og:image", content: image },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ] satisfies MetaEntry[];
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: BRAND_NAME,
    alternateName: ["Impressions Cards", "Impressions Castle"],
    description: "Luxury wedding invitation card design and printing studio in Thrissur, Kerala.",
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    image: DEFAULT_OG_IMAGE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Impressions Castle, Paravattani",
      addressLocality: "Thrissur",
      addressRegion: "Kerala",
      postalCode: "680005",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.5276,
      longitude: 76.2144,
    },
    hasMap: MAPS_URL,
    sameAs: [INSTAGRAM_URL],
    areaServed: ["Thrissur", "Kerala", "South India", "India"],
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Invitation card printing" } },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "00:00",
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
    logo: `${SITE_URL}/logo.png`,
    sameAs: [INSTAGRAM_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BUSINESS_PHONE,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "ml", "hi"],
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?category={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export const coreFaqs: FaqItem[] = [
  {
    question: "Where can I print wedding cards in Thrissur?",
    answer:
      "Impressions Wedding Cards prints premium wedding invitation cards from Impressions Castle, Paravattani, Thrissur, Kerala, with support for customised designs and curated card collections.",
  },
  {
    question: "Does Impressions Wedding Cards create customised designs?",
    answer:
      "Yes. Couples can choose from curated wedding card collections or customise invitation details, typography, colours, wording and finishing preferences with the Impressions Wedding Cards team.",
  },
  {
    question: "Do you provide luxury wedding invitations in Kerala?",
    answer:
      "Yes. Impressions Wedding Cards serves Thrissur and Kerala with luxury wedding invitation cards, premium paper choices, refined printing and elegant finishing options.",
  },
  {
    question: "Can I order personalised wedding cards?",
    answer:
      "Yes. Personalised wedding cards can be ordered through the website catalogue, the custom design experience or WhatsApp consultation with the studio.",
  },
];

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
