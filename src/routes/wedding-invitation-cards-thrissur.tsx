import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd, SeoLandingPage } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, coreFaqs, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/wedding-invitation-cards-thrissur")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Invitation Cards Thrissur | Impressions Wedding Cards",
      description:
        "Order wedding invitation cards in Thrissur from Impressions Wedding Cards, a premium studio for designer wedding cards and customised invitations.",
      path: "/wedding-invitation-cards-thrissur",
    }),
    links: [canonicalLink("/wedding-invitation-cards-thrissur")],
  }),
  component: WeddingInvitationCardsThrissurPage,
});

function WeddingInvitationCardsThrissurPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Wedding invitation cards Thrissur"
        title="Wedding invitation cards in Thrissur"
        intro="Impressions Wedding Cards designs and prints wedding invitation cards in Thrissur for couples who want premium materials, graceful typography and a personal ordering experience."
        image="invitations"
        sections={[
          {
            title: "Invitation cards for every ceremony",
            copy: "The collection supports traditional and modern wedding formats with wording and layouts suitable for Kerala families.",
          },
          {
            title: "Customised invitation details",
            copy: "Personalise names, dates, venues, inserts, envelopes and colour preferences while keeping the design elegant and production-ready.",
          },
          {
            title: "Premium Thrissur card studio",
            copy: "The studio in Paravattani helps families searching for wedding card printers near me find a refined local option.",
          },
          {
            title: "Designed for keepsake value",
            copy: "Every invitation is approached as the first formal impression of the wedding, with careful attention to paper, hierarchy and finish.",
          },
        ]}
        faq={coreFaqs}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          {
            name: "Wedding Invitation Cards Thrissur",
            path: "/wedding-invitation-cards-thrissur",
          },
        ])}
      />
    </>
  );
}
