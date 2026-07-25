import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd, SeoLandingPage } from "@/components/seo";
import { breadcrumbSchema, canonicalLink, coreFaqs, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/custom-wedding-invitations")({
  head: () => ({
    meta: seoMeta({
      title: "Custom Wedding Invitations | Impressions Wedding Cards",
      description:
        "Create custom wedding invitations with Impressions Wedding Cards in Thrissur. Personalise layouts, wording, colours, typography and premium print details.",
      path: "/custom-wedding-invitations",
    }),
    links: [canonicalLink("/custom-wedding-invitations")],
  }),
  component: CustomWeddingInvitationsPage,
});

function CustomWeddingInvitationsPage() {
  return (
    <>
      <SharedHeader />
      <SeoLandingPage
        eyebrow="Custom wedding invitations"
        title="Custom wedding invitation designs"
        intro="Build a wedding invitation that feels personal from the first glance. Impressions Wedding Cards helps couples customise layouts, colours, wording and stationery details."
        image="green"
        sections={[
          {
            title: "Personalised wording and layout",
            copy: "Adjust invitation text, order of details, family names, ceremony timing and reception information with a polished visual structure.",
          },
          {
            title: "Design-your-own experience",
            copy: "Use the online customisation experience to preview names, typefaces, colours and card details before sending the design for consultation.",
          },
          {
            title: "Premium print preparation",
            copy: "The Impressions team prepares custom wedding invitations for clear production, matching paper choices and a refined finished result.",
          },
          {
            title: "Thrissur studio support",
            copy: "Couples can begin online and continue with the local Thrissur team for quantities, pricing, material choices and final ordering.",
          },
        ]}
        faq={coreFaqs}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Custom Wedding Invitations", path: "/custom-wedding-invitations" },
        ])}
      />
    </>
  );
}
