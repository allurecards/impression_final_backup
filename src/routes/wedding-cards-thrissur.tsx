import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd, SeoLandingPage } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, coreFaqs, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/wedding-cards-thrissur")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Cards Thrissur | Luxury Invitations by Impressions Wedding Cards",
      description:
        "Impressions Wedding Cards creates luxury wedding cards in Thrissur with premium paper, refined design, personalised wording and elegant printing.",
      path: "/wedding-cards-thrissur",
    }),
    links: [canonicalLink("/wedding-cards-thrissur")],
  }),
  component: WeddingCardsThrissurPage,
});

function WeddingCardsThrissurPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Wedding cards Thrissur"
        title="Luxury wedding cards in Thrissur"
        intro="Impressions Wedding Cards is a premium wedding card studio in Thrissur for families looking for elegant invitation designs, personalised stationery and careful print finishing."
        image="wedding"
        sections={[
          {
            title: "Premium invitation collections",
            copy: "Choose from refined wedding card collections built around heritage, floral, minimal and modern design styles for celebrations in Kerala and across India.",
          },
          {
            title: "Personalised wedding cards",
            copy: "Names, venue details, dates, wording, inserts and envelopes can be personalised so the final invitation feels specific to your family and ceremony.",
          },
          {
            title: "Wedding card shop in Thrissur",
            copy: "Visit Impressions Castle in Paravattani to discuss paper, finishes, artwork and timelines with a local team that understands wedding invitation printing.",
          },
          {
            title: "Made for Kerala celebrations",
            copy: "Our work supports Hindu, Christian, Muslim and contemporary weddings with premium design choices and practical production guidance.",
          },
        ]}
        faq={coreFaqs}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Wedding Cards Thrissur", path: "/wedding-cards-thrissur" },
        ])}
      />
    </>
  );
}
