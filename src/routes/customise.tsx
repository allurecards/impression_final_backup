import { createFileRoute } from "@tanstack/react-router";
import { CustomizePage } from "./customize";
import { canonicalLink, seoMeta } from "@/lib/seo";

export const Route = createFileRoute("/customise")({
  head: () => ({
    meta: seoMeta({
      title: "Customise Wedding Invitation Cards | Impressions Wedding Cards",
      description:
        "Customise wedding invitation cards online with Impressions Wedding Cards in Thrissur, Kerala. Personalise names, wording, colours, fonts and layouts.",
      path: "/customise",
    }),
    links: [canonicalLink("/customise")],
  }),
  component: CustomizePage,
});
