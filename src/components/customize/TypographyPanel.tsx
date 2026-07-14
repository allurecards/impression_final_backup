import { useCardDesign, DEFAULT_DESIGN } from "@/hooks/use-card-design";
import { getTemplate } from "@/data/templates";
import { BODY_FONTS, getFont, ensureFontLoaded } from "@/data/fonts";
import { FontPicker } from "./shared/FontPicker";
import { Slider } from "./shared/Slider";
import { Group } from "./shared/Group";

export function TypographyPanel() {
  const { state, setField } = useCardDesign();
  const template = getTemplate(state.templateId);

  const setBodyFont = (id: string) => {
    ensureFontLoaded(getFont(id));
    setField("bodyFontId", id);
  };

  return (
    <Group label="Typography">
      <FontPicker label="Body font" fonts={BODY_FONTS} value={getFont(state.bodyFontId)} onChange={(f) => setBodyFont(f.id)} />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
    </Group>
  );
}
