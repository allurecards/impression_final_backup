import { createFileRoute } from "@tanstack/react-router";
import { ExploreSections } from "@/components/explore-sections";
import { canonicalLink, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: seoMeta({
      title: "Wedding Invitation Portfolio Thrissur | Impressions Wedding Cards",
      description:
        "Explore Impressions Wedding Cards collections, custom stationery, and luxury wedding invitation designs from Thrissur, Kerala.",
      path: "/explore",
    }),
    links: [canonicalLink("/explore")],
  }),
  component: Index,
});

function Index() {
  return <ExploreSections />;
}
