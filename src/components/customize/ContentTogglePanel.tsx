import { useState } from "react";
import { cn } from "@/lib/utils";
import { EssentialDetailsPanel } from "./EssentialDetailsPanel";
import { TemplatePicker } from "./TemplatePicker";

const CONTENT_TABS = [
  { id: "details", label: "Your Details", description: "Edit all text fields for your card." },
  { id: "templates", label: "Templates", description: "Pick a different card template." },
] as const;

export function ContentTogglePanel() {
  const [tab, setTab] = useState<"details" | "templates">("details");

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">
            {tab === "details" ? "Your Details" : "Templates"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tab === "details"
              ? "Edit each section — text updates the card in real time."
              : "Choose a different template and colour scheme."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1">
        {CONTENT_TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-left transition-colors",
                active ? "bg-background shadow-sm" : "hover:bg-background/60",
              )}
            >
              <span className="block text-sm font-medium">{t.label}</span>
              <span className="block text-xs text-muted-foreground">{t.description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {tab === "details" ? <EssentialDetailsPanel /> : <TemplatePicker />}
      </div>
    </section>
  );
}
