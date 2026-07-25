import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { SeoLandingPage, JsonLd } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Card Collections in Thrissur | Impressions Wedding Cards",
      description:
        "Explore premium wedding card collections in Thrissur from Impressions Wedding Cards, including heritage, floral, minimal and modern invitation designs.",
      path: "/collections",
    }),
    links: [canonicalLink("/collections")],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Collections"
        title="Wedding card collections in Thrissur"
        intro="Browse premium invitation collections designed for families who want refined wedding cards in Thrissur, Kerala, with elegant print finishes and personalised details."
        image="invitations"
        sections={[
          {
            title: "Curated wedding card designs",
            copy: "Our collections are arranged around heritage, floral, minimal and modern design languages so couples can quickly find an invitation style that fits their celebration.",
          },
          {
            title: "Premium paper and finishing",
            copy: "Each card is prepared for quality printing, paper selection, envelope pairing and finishing choices that make the invitation feel considered in hand.",
          },
          {
            title: "Personalised for your wedding",
            copy: "Names, date, venue, wording, colour direction and matching stationery can be adjusted with the Impressions Wedding Cards team.",
          },
          {
            title: "Designed from Thrissur, Kerala",
            copy: "The studio serves local Thrissur families and clients across Kerala and India looking for premium wedding invitations.",
          },
        ]}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
        ])}
      />
    </>
  );
}
