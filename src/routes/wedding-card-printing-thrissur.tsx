import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd, SeoLandingPage } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, coreFaqs, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/wedding-card-printing-thrissur")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Card Printing Thrissur | Impressions Wedding Cards",
      description:
        "Premium wedding card printing in Thrissur for custom invitations, designer wedding cards and elegant stationery by Impressions Wedding Cards.",
      path: "/wedding-card-printing-thrissur",
    }),
    links: [canonicalLink("/wedding-card-printing-thrissur")],
  }),
  component: WeddingCardPrintingThrissurPage,
});

function WeddingCardPrintingThrissurPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Printing studio in Thrissur"
        title="Wedding card printing in Thrissur"
        intro="For families searching wedding card printing near me or invitation card printing Thrissur, Impressions Wedding Cards offers design-led cards with premium print preparation and finishing."
        image="heritage"
        sections={[
          {
            title: "Print-ready design support",
            copy: "Our team helps convert your selected invitation design into clear artwork for names, dates, venue details, inserts and matching envelopes.",
          },
          {
            title: "Premium card materials",
            copy: "Select textured papers, elegant card stocks and finishing directions suited to traditional, minimal and luxury wedding invitations.",
          },
          {
            title: "Local consultation",
            copy: "The Thrissur studio gives couples and families a physical place to review cards, discuss quantities and confirm production details.",
          },
          {
            title: "Designer wedding cards",
            copy: "Every card is treated as part of the wedding experience, with a premium visual style rather than a generic printing-only approach.",
          },
        ]}
        faq={coreFaqs}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          {
            name: "Wedding Card Printing Thrissur",
            path: "/wedding-card-printing-thrissur",
          },
        ])}
      />
    </>
  );
}
