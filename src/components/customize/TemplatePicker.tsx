import { useMemo, useState } from "react";
import { TEMPLATES, TEMPLATE_CATEGORY_LABELS } from "@/data/templates";
import { useCardDesign } from "@/hooks/use-card-design";

const CATEGORY_ORDER = Object.keys(TEMPLATE_CATEGORY_LABELS) as Array<keyof typeof TEMPLATE_CATEGORY_LABELS>;

export function TemplatePicker() {
  const { state, setTemplate } = useCardDesign();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const availableCategories = useMemo(() => {
    const present = new Set(TEMPLATES.flatMap((t) => t.categories));
    return CATEGORY_ORDER.filter((c) => present.has(c as never));
  }, []);

  const filtered = useMemo(
    () => (activeCategory === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.categories.includes(activeCategory as never))),
    [activeCategory],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <CategoryChip label="All" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
        {availableCategories.map((c) => (
          <CategoryChip
            key={c}
            label={TEMPLATE_CATEGORY_LABELS[c]}
            active={activeCategory === c}
            onClick={() => setActiveCategory(c)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5" role="radiogroup" aria-label="Template selection">
        {filtered.map((t) => (
          <button
            type="button"
            key={t.id}
            role="radio"
            aria-checked={state.templateId === t.id}
            onClick={() => setTemplate(t.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-[transform,border-color] duration-150 active:scale-[0.97] ${
              state.templateId === t.id ? "border-foreground" : "border-border hover:border-foreground/40"
            }`}
          >
            {t.type === "image" && t.imageSrc ? (
              <span className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-md">
                <img src={t.thumbSrc ?? t.imageSrc} alt="" loading="lazy" decoding="async" className="absolute h-full w-full object-cover" />
              </span>
            ) : (
              <span className="flex h-14 w-full items-center justify-center rounded-md" style={{ backgroundColor: t.bg }}>
                <span className="h-9 w-7 rounded-sm" style={{ backgroundColor: t.panel, border: `1px solid ${t.border}88` }} />
              </span>
            )}
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm opacity-60">No templates in this category yet.</p>
        )}
      </div>
    </>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs transition-colors duration-150 ${
        active ? "border-foreground bg-foreground text-background" : "border-border text-foreground/70 hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

