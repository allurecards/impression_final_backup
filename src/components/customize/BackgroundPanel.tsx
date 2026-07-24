import { useCardDesign, DEFAULT_DESIGN } from "@/hooks/use-card-design";
import { Slider } from "./shared/Slider";
import { Group } from "./shared/Group";

export function BackgroundPanel() {
  const { state, setField } = useCardDesign();

  return (
    <Group label="Background">
      <label className="block text-sm">
        <span className="mb-1 block text-xs opacity-70">Card base colour</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={state.imageBg}
            onChange={(e) => setField("imageBg", e.target.value)}
            className="h-10 w-12 rounded-md border border-input"
          />
          <span className="font-mono text-xs opacity-70">{state.imageBg}</span>
          <button
            type="button"
            onClick={() => setField("imageBg", DEFAULT_DESIGN.imageBg)}
            className="ml-auto text-xs underline opacity-70"
          >
            Reset
          </button>
        </div>
      </label>
      <div className="mt-4">
        <Slider
          label="Text Y offset"
          min={-100}
          max={100}
          value={state.textOffset}
          onChange={(v) => setField("textOffset", v)}
        />
      </div>
    </Group>
  );
}
