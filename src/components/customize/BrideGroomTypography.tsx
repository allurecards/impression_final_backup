import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCardDesign, DEFAULT_DESIGN } from "@/hooks/use-card-design";
import { getTemplate } from "@/data/templates";
import { NAME_FONTS, BODY_FONTS, getFont, ensureFontLoaded } from "@/data/fonts";
import { FontPicker } from "./shared/FontPicker";
import { Slider } from "./shared/Slider";

const FONT_TABS = [
  { id: "name", label: "Name font", description: "Decorative font for couple names." },
  { id: "body", label: "Body font", description: "Readable font for all other text." },
] as const;

export function BrideGroomTypography() {
  const { state, setChurchText, setScriptText, setField } = useCardDesign();
  const [tab, setTab] = useState<"name" | "body">("name");
  const template = getTemplate(state.templateId);

  const isClassic = state.textLayoutId === "classic";

  const groomName = isClassic
    ? state.classicChurch.text.groomName
    : state.scriptLayout.text.groomName;

  const brideName = isClassic
    ? state.classicChurch.text.brideName
    : state.scriptLayout.text.brideName;

  const setGroom = (value: string) => {
    if (isClassic) setChurchText("groomName", value);
    else setScriptText("groomName", value);
  };

  const setBride = (value: string) => {
    if (isClassic) setChurchText("brideName", value);
    else setScriptText("brideName", value);
  };

  const handleFontChange = (id: string) => {
    ensureFontLoaded(getFont(id));
    setField(tab === "name" ? "nameFontId" : "bodyFontId", id);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Bride &amp; Groom</h2>
          <p className="text-sm text-muted-foreground">Enter the names that will appear on your card.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Groom</label>
          <input
            type="text"
            value={groomName}
            onChange={(e) => setGroom(e.target.value)}
            placeholder="Groom's name"
            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-xl shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-2xl"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Bride</label>
          <input
            type="text"
            value={brideName}
            onChange={(e) => setBride(e.target.value)}
            placeholder="Bride's name"
            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-xl shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-2xl"
          />
        </div>
      </div>

      <hr className="my-6 border-border" />

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1">
        {FONT_TABS.map((t) => {
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

      <div className="mt-2">
        <FontPicker
          label={tab === "name" ? "Name font" : "Body font"}
          fonts={tab === "name" ? NAME_FONTS : BODY_FONTS}
          value={getFont(tab === "name" ? state.nameFontId : state.bodyFontId)}
          onChange={(f) => handleFontChange(f.id)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-xs opacity-70">Text colour</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={state.textColor || template.ink}
              onChange={(e) => setField("textColor", e.target.value)}
              className="h-10 w-12 rounded-md border border-input"
            />
            <button type="button" onClick={() => setField("textColor", "")} className="text-xs underline opacity-70">
              Reset to template
            </button>
          </div>
        </label>
        <div />
        <label className="block text-sm">
          <div className="flex items-center gap-2">
            <Slider label="Name size" min={28} max={72} value={state.nameSize} onChange={(v) => setField("nameSize", v)} />
            {state.nameSize !== DEFAULT_DESIGN.nameSize && (
              <button type="button" onClick={() => setField("nameSize", DEFAULT_DESIGN.nameSize)} className="shrink-0 text-xs underline opacity-70">
                Reset
              </button>
            )}
          </div>
        </label>
      </div>
    </section>
  );
}
