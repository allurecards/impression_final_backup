import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { SharedHeader } from "@/components/shared-header";
import { SharedFooter } from "@/components/shared-footer";
import { CardDesignProvider, useCardDesign } from "@/hooks/use-card-design";
import { getTemplate } from "@/data/templates";
import { CardSvg } from "@/components/customize/CardSvg";
import { TemplatePicker } from "@/components/customize/TemplatePicker";
import { EssentialDetailsPanel } from "@/components/customize/EssentialDetailsPanel";
import { BackgroundPanel } from "@/components/customize/BackgroundPanel";
import { TypographyPanel } from "@/components/customize/TypographyPanel";
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
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] opacity-70">Interactive designer</p>
        <h1 className="font-serif text-5xl tracking-tight md:text-6xl">Design your wedding card</h1>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-85">
          Pick a template, choose your typography and your story. Everything updates in real time — and autosaves as
          you go.
        </p>
      </section>

      <main className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 md:px-12 lg:grid-cols-[1fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl p-6 shadow-xl md:p-10" style={{ backgroundColor: template.type === "image" ? state.imageBg : template.bg }}>
            <CardSvg ref={svgRef} />
          </div>
          <ExportBar svgRef={svgRef} />
        </div>

        <div className="space-y-10">
          <TemplatePicker />
          <EssentialDetailsPanel />
          <BackgroundPanel />
          <TypographyPanel />
          <ExtrasPanel />
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
