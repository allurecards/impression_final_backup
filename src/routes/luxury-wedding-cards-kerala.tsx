import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd, SeoLandingPage } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, coreFaqs, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/luxury-wedding-cards-kerala")({
  head: () => ({
    meta: seoMeta({
      title: "Luxury Wedding Cards Kerala | Premium Invitations India",
      description:
        "Luxury wedding cards in Kerala by Impressions Wedding Cards, a Thrissur studio for premium invitations, custom stationery and designer wedding cards.",
      path: "/luxury-wedding-cards-kerala",
    }),
    links: [canonicalLink("/luxury-wedding-cards-kerala")],
  }),
  component: LuxuryWeddingCardsKeralaPage,
});

function LuxuryWeddingCardsKeralaPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Luxury wedding cards Kerala"
        title="Luxury wedding invitation cards in Kerala"
        intro="Impressions Wedding Cards creates premium wedding cards for Kerala celebrations, combining refined artwork, elegant materials and custom invitation details."
        image="floral"
        sections={[
          {
            title: "Premium wedding cards India",
            copy: "Families across India can explore Impressions for premium invitations that feel considered, polished and worthy of a major celebration.",
          },
          {
            title: "Designer stationery details",
            copy: "Invitation suites can include inserts, envelopes, venue directions, wording refinements and visual details matched to the wedding tone.",
          },
          {
            title: "Kerala wedding expertise",
            copy: "From traditional ceremonies to modern destination celebrations, the studio understands regional expectations while keeping the design elevated.",
          },
          {
            title: "Luxury without excess",
            copy: "The design language stays elegant and tactile, with premium papers and finishes used to support the invitation rather than overwhelm it.",
          },
        ]}
        faq={coreFaqs}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Luxury Wedding Cards Kerala", path: "/luxury-wedding-cards-kerala" },
        ])}
      />
    </>
  );
}
