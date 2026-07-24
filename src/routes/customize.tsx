import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { SharedHeader } from "@/components/shared-header";

import { CardDesignProvider, useCardDesign } from "@/hooks/use-card-design";
import { getTemplate } from "@/data/templates";
import { CardSvg } from "@/components/customize/CardSvg";
import { LayoutPicker } from "@/components/customize/LayoutPicker";
import { BrideGroomTypography } from "@/components/customize/BrideGroomTypography";
import { ContentTogglePanel } from "@/components/customize/ContentTogglePanel";
import { BackgroundPanel } from "@/components/customize/BackgroundPanel";
import { ExtrasPanel } from "@/components/customize/ExtrasPanel";
import { ExportBar } from "@/components/customize/ExportBar";

export const Route = createFileRoute("/customize")({
  head: () => ({
    meta: [
      { title: "Design your wedding card — Impressions Cards" },
      {
        name: "description",
        content:
          "An interactive designer for your wedding invitation: templates, fonts, colors, verses, icons and a venue QR code.",
      },
      { property: "og:title", content: "Design your wedding card — Impressions Cards" },
      { property: "og:description", content: "Design a card that's truly yours." },
    ],
  }),
  component: CustomizePage,
});

function CustomizePage() {
  return (
    <CardDesignProvider>
      <CustomizePageInner />
    </CardDesignProvider>
  );
}

function CustomizePageInner() {
  const { state } = useCardDesign();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const template = getTemplate(state.templateId);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SharedHeader />

      <div className="mx-auto max-w-[1400px] px-6 pt-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/customize" className="hover:underline">
          Customize
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Design your own</span>
      </div>

      <section className="px-6 py-16 text-center md:px-12">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] opacity-70">
          Interactive designer
        </p>
        <h1 className="font-serif text-5xl tracking-tight md:text-6xl">Design your wedding card</h1>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-85">
          Pick a template, choose your typography and your story. Everything updates in real time —
          and autosaves as you go.
        </p>
      </section>

      <main className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 md:px-12 lg:grid-cols-[1fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="rounded-2xl p-6 shadow-xl md:p-10"
            style={{ backgroundColor: template.type === "image" ? state.imageBg : template.bg }}
          >
            <CardSvg ref={svgRef} />
          </div>
          <ExportBar svgRef={svgRef} />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Click any text or motif on the card to select it, then drag to reposition.
          </p>
        </div>

        <div className="space-y-10">
          <LayoutPicker />
          <BrideGroomTypography />
          <ContentTogglePanel />
          <BackgroundPanel />
          <ExtrasPanel />
        </div>
      </main>

      <footer className="bg-zola-ink text-zola-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-12 text-sm md:grid-cols-4">
          <div>
            <h4 className="font-serif text-xl mb-4">Impressions</h4>
            <p className="opacity-70">Wedding cards, made for you.</p>
          </div>
          <div>
            <h5 className="mb-3 font-semibold">Shop</h5>
            <ul className="space-y-2 opacity-70">
              <li>
                <Link to="/shop" className="hover:opacity-60">
                  All cards
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:opacity-60">
                  Customize
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:opacity-60">
                  Design your own
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zola-cream/10">
          <p className="mx-auto max-w-[1400px] px-6 py-6 text-xs opacity-50">
            &copy; {new Date().getFullYear()} Impressions Cards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
