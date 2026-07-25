import { createFileRoute } from "@tanstack/react-router";
import { ExploreSections } from "@/components/explore-sections";
import { canonicalLink, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Invitation Portfolio Thrissur | Impressions Wedding Cards",
      description:
        "View the Impressions Wedding Cards portfolio of luxury wedding invitation designs, custom stationery and premium card collections from Thrissur, Kerala.",
      path: "/portfolio",
    }),
    links: [canonicalLink("/portfolio")],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return <ExploreSections />;
}
