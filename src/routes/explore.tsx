import { createFileRoute } from "@tanstack/react-router";
import { ExploreSections } from "@/components/explore-sections";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Impressions Wedding Cards — Handcrafted Invitations & Custom Design" },
      {
        name: "description",
        content:
          "Explore our signature invitation collections, design your own card, and discover luxury wedding stationery — all designed in our Thrissur atelier.",
      },
      { property: "og:title", content: "Impressions Wedding Cards — Bespoke Wedding Invitations" },
      {
        property: "og:description",
        content:
          "Heritage, minimal, floral, modern collections. Customise your card with live preview.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <ExploreSections />;
}
