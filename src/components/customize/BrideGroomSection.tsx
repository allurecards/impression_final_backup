import { useCardDesign } from "@/hooks/use-card-design";
import { NAME_FONTS, getFont, ensureFontLoaded } from "@/data/fonts";
import { FontPicker } from "./shared/FontPicker";

export function BrideGroomSection() {
  const { state, setChurchText, setScriptText, setField } = useCardDesign();

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

  const setNameFont = (font: { id: string }) => {
    ensureFontLoaded(getFont(font.id));
    setField("nameFontId", font.id);
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

        <div className="relative grid gap-1.5">
          <div className="absolute -top-2 left-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            &amp;
          </div>
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

      <FontPicker
        label="Name font"
        fonts={NAME_FONTS}
        value={getFont(state.nameFontId)}
        onChange={setNameFont}
      />
    </section>
  );
}
