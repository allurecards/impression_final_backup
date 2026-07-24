import type { FontDef } from "@/types/card-design";

export function FontPicker({
  label,
  value,
  onChange,
  fonts,
  scriptFilter,
}: {
  label: string;
  value: FontDef;
  onChange: (f: FontDef) => void;
  fonts: FontDef[];
  /** When provided, only fonts covering this script are shown (plus the current selection). */
  scriptFilter?: FontDef["scripts"][number];
}) {
  const options = scriptFilter
    ? fonts.filter((f) => f.scripts.includes(scriptFilter) || f.id === value.id)
    : fonts;

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs opacity-70">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.length === 0 ? (
          <p className="col-span-full text-center text-xs opacity-50">
            No fonts available for this script.
          </p>
        ) : (
          options.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => onChange(f)}
              aria-pressed={value.id === f.id}
              className={`rounded-xl border p-3 text-left transition-[transform,border-color] duration-150 active:scale-[0.97] ${
                value.id === f.id ? "border-foreground" : "border-border"
              }`}
            >
              <span
                className="block text-2xl"
                style={{ fontFamily: f.family, fontStyle: f.italic ? "italic" : "normal" }}
              >
                Aa
              </span>
              <span className="mt-1 block text-[11px] opacity-70">{f.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
