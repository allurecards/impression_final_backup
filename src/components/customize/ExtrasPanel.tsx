import { useState } from "react";
import { useCardDesign } from "@/hooks/use-card-design";
import { getTemplate } from "@/data/templates";
import { VERSES, versesByTradition, TRADITION_LABELS } from "@/data/verses";
import { ICON_DEFS, getIconDef } from "@/data/icons";
import { MONOGRAM_DEFS, getMonogramDef } from "@/data/monograms";
import { normalizeMapsUrl } from "@/lib/qr";
import { contrastRatio, MIN_LEGIBLE_CONTRAST } from "@/lib/contrast";
import type { VerseTradition } from "@/types/card-design";
import { Field } from "./shared/Field";
import { Slider } from "./shared/Slider";
import { Group } from "./shared/Group";

export function ExtrasPanel() {
  const {
    state,
    setField,
    addDecoration,
    updateDecoration,
    removeDecoration,
    setChurchText,
    setScriptText,
  } = useCardDesign();
  const template = getTemplate(state.templateId);
  const [tradition, setTradition] = useState<VerseTradition | "all">("all");

  const isClassic = state.textLayoutId === "classic";

  const populateVerse = (verseId: string) => {
    const v = VERSES.find((vx) => vx.id === verseId);
    setField("verseId", verseId);
    setField("customVerse", "");
    if (!v) return;
    if (isClassic) {
      setChurchText("quoteLine1", v.text);
      setChurchText("quoteLine2", v.ref ? `— ${v.ref}` : "");
    } else {
      setScriptText("quoteLine1", v.text);
      setScriptText("quoteLine2", v.ref ? `— ${v.ref}` : "");
    }
  };

  const populateCustomVerse = (text: string) => {
    setField("customVerse", text);
    if (text) setField("verseId", "");
    if (isClassic) {
      setChurchText("quoteLine1", text || "");
      setChurchText("quoteLine2", "");
    } else {
      setScriptText("quoteLine1", text || "");
      setScriptText("quoteLine2", "");
    }
  };

  const deferredMapsUrl = state.mapsUrl;
  const normalizedMapsUrl = normalizeMapsUrl(deferredMapsUrl);
  const mapsUrlIsInvalid = Boolean(state.showQr && deferredMapsUrl.trim() && !normalizedMapsUrl);

  const inkColor = state.textColor || template.ink || "#000000";
  const bgColor =
    template.type === "image" ? state.imageBg : (template.panel ?? template.bg ?? "#ffffff");
  const ratio = contrastRatio(inkColor, bgColor);
  const lowContrast = ratio !== null && ratio < MIN_LEGIBLE_CONTRAST;

  return (
    <Group label="Extras">
      {lowContrast && (
        <p
          className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          role="status"
        >
          Your text colour is close to the background colour — this may be hard to read once
          printed. Consider adjusting the text colour above.
        </p>
      )}

      {/* Verses */}
      <label className="block text-sm">
        <span className="mb-1 block text-xs opacity-70">Verse or blessing tradition</span>
        <select
          value={tradition}
          onChange={(e) => setTradition(e.target.value as VerseTradition | "all")}
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
        >
          {Object.entries(TRADITION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-xs opacity-70">Verse</span>
        <select
          value={state.verseId}
          onChange={(e) => populateVerse(e.target.value)}
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
        >
          <option value="">— No verse —</option>
          {versesByTradition(tradition).map((v) => (
            <option key={v.id} value={v.id} title={v.ref || v.text}>
              {v.ref || v.text.slice(0, 60)}
              {!v.ref && v.text.length > 60 ? "…" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-xs opacity-70">…or write your own</span>
        <textarea
          value={state.customVerse}
          onChange={(e) => populateCustomVerse(e.target.value)}
          rows={2}
          placeholder="Add a personal quote or blessing"
          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
        />
      </label>

      {/* Icons */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-70">
          <p>Decorative icons</p>
          <p>Drag placed icons on the card</p>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {ICON_DEFS.map((def) => (
            <button
              key={def.id}
              type="button"
              onClick={() => addDecoration("icons", def.id)}
              className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:border-foreground/50"
            >
              + {def.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {state.icons.map((instance) => {
            const def = getIconDef(instance.defId);
            return (
              <DecorationRow
                key={instance.key}
                title={def?.label ?? instance.defId}
                inkFallback={inkColor}
                instance={instance}
                showColor
                onChange={(patch) => updateDecoration("icons", instance.key, patch)}
                onRemove={() => removeDecoration("icons", instance.key)}
              />
            );
          })}
          {state.icons.length === 0 && (
            <p className="text-xs opacity-50">No icons placed yet — add one above.</p>
          )}
        </div>
      </div>

      {/* Monograms */}
      <div className="mt-6">
        <p className="mb-2 text-xs opacity-70">Monograms</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {MONOGRAM_DEFS.map((def) => (
            <button
              key={def.id}
              type="button"
              onClick={() => addDecoration("monograms", def.id)}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs transition-colors hover:border-foreground/50"
            >
              <img src={def.src} alt="" className="h-4 w-4 rounded object-contain" />+ {def.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {state.monograms.map((instance) => {
            const def = getMonogramDef(instance.defId);
            return (
              <DecorationRow
                key={instance.key}
                title={def?.label ?? instance.defId}
                inkFallback={inkColor}
                instance={instance}
                showColor={false}
                onChange={(patch) => updateDecoration("monograms", instance.key, patch)}
                onRemove={() => removeDecoration("monograms", instance.key)}
              />
            );
          })}
          {state.monograms.length === 0 && (
            <p className="text-xs opacity-50">No monograms placed yet — add one above.</p>
          )}
        </div>
      </div>

      {/* Venue QR */}
      <div className="mt-6 rounded-2xl border border-border bg-white p-4">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={state.showQr}
            onChange={(e) => setField("showQr", e.target.checked)}
            className="h-4 w-4 accent-foreground"
          />
          Show venue QR code on card
        </label>
        <Field
          label="Google Maps URL"
          value={state.mapsUrl}
          onChange={(v) => setField("mapsUrl", v)}
          placeholder="https://maps.app.goo.gl/…"
          className="mt-3"
          type="url"
          inputMode="url"
        />
        {mapsUrlIsInvalid && (
          <p className="mt-2 text-xs text-red-800" role="alert">
            Enter a valid website or Google Maps link.
          </p>
        )}
        {state.showQr && normalizedMapsUrl && (
          <p className="mt-2 text-xs opacity-70">
            QR code generated locally — no external service required.
          </p>
        )}
      </div>
    </Group>
  );
}

function DecorationRow({
  title,
  instance,
  inkFallback,
  showColor,
  onChange,
  onRemove,
}: {
  title: string;
  instance: { key: string; scale: number; color?: string; position: { x: number; y: number } };
  inkFallback: string;
  showColor: boolean;
  onChange: (
    patch: Partial<{ scale: number; color: string; position: { x: number; y: number } }>,
  ) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-white transition-[border-color] duration-200">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm capitalize transition-colors ${
          expanded ? "border-b border-border" : ""
        }`}
      >
        <span className="flex-1 font-medium">{title}</span>
        <svg
          className={`h-3 w-3 opacity-40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-4 px-4 pb-4 pt-3">
          <Slider
            label="Size"
            min={0.15}
            max={1}
            value={instance.scale}
            onChange={(v) => onChange({ scale: v })}
            step={0.01}
          />
          {showColor && (
            <label className="block text-sm">
              <span className="mb-1 block text-xs opacity-70">Colour</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={instance.color || inkFallback}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="h-9 w-10 rounded-md border border-input"
                />
                <span className="font-mono text-xs opacity-70">
                  {instance.color || "Template ink"}
                </span>
                {instance.color && (
                  <button
                    type="button"
                    onClick={() => onChange({ color: "" })}
                    className="ml-auto text-xs underline opacity-70"
                  >
                    Reset
                  </button>
                )}
              </div>
            </label>
          )}
          <Slider
            label="X"
            min={20}
            max={380}
            value={instance.position.x}
            onChange={(v) => onChange({ position: { ...instance.position, x: v } })}
          />
          <Slider
            label="Y"
            min={20}
            max={540}
            value={instance.position.y}
            onChange={(v) => onChange({ position: { ...instance.position, y: v } })}
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-red-700 underline underline-offset-4"
          >
            Remove from card
          </button>
        </div>
      )}
    </div>
  );
}
