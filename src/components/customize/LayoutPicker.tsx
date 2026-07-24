import { useCardDesign } from "@/hooks/use-card-design";
import { TEXT_LAYOUTS } from "@/types/card-design";
import { cn } from "@/lib/utils";

export function LayoutPicker() {
  const { state, setTextLayout } = useCardDesign();

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Layout</h2>
          <p className="text-sm text-muted-foreground">Choose how text is arranged on your card.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1">
        {TEXT_LAYOUTS.map((layout) => {
          const active = state.textLayoutId === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => setTextLayout(layout.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-left transition-colors",
                active ? "bg-background shadow-sm" : "hover:bg-background/60",
              )}
            >
              <span className="block text-sm font-medium">{layout.label}</span>
              <span className="block text-xs text-muted-foreground">{layout.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
