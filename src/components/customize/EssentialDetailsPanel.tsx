import { useCardDesign } from "@/hooks/use-card-design";
import {
  CHURCH_SECTIONS,
  FIELD_LABELS,
  SCRIPT_SECTIONS,
  SCRIPT_FIELD_LABELS,
  TEXT_LAYOUTS,
} from "@/types/card-design";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function EssentialDetailsPanel() {
  const {
    state,
    setTextLayout,
    setChurchText,
    toggleChurchElement,
    setScriptText,
    toggleScriptElement,
  } = useCardDesign();

  const isClassic = state.textLayoutId === "classic";
  const church = state.classicChurch;
  const script = state.scriptLayout;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Your details</h2>
          <p className="text-sm text-muted-foreground">Edit each section — text updates the card in real time.</p>
        </div>
      </div>

      {/* Layout switcher */}
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

      {isClassic ? (
        <Accordion type="multiple" defaultValue={["names", "date-venue"]} className="mt-4">
          {CHURCH_SECTIONS.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-left">
                <span className="flex items-baseline gap-3">
                  <span className="font-medium">{section.label}</span>
                  <span className="text-xs text-muted-foreground">{section.fields.length} fields</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 pt-1">
                  {section.fields.map((field) => {
                    const hidden = church.hiddenElements.includes(field);
                    return (
                      <div key={field} className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`f-${field}`} className="text-xs uppercase tracking-wider text-muted-foreground">
                            {FIELD_LABELS[field as keyof typeof FIELD_LABELS]}
                          </Label>
                          <button
                            type="button"
                            onClick={() => toggleChurchElement(field)}
                            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            {hidden ? "Show" : "Hide"}
                          </button>
                        </div>
                        <Input
                          id={`f-${field}`}
                          value={church.text[field] ?? ""}
                          onChange={(e) => setChurchText(field, e.target.value)}
                          disabled={hidden}
                        />
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Accordion type="multiple" defaultValue={["script-names", "script-ceremony"]} className="mt-4">
          {SCRIPT_SECTIONS.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-left">
                <span className="flex items-baseline gap-3">
                  <span className="font-medium">{section.label}</span>
                  <span className="text-xs text-muted-foreground">{section.fields.length} fields</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 pt-1">
                  {section.fields.map((field) => {
                    const hidden = script.hiddenElements.includes(field);
                    return (
                      <div key={field} className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`s-${field}`} className="text-xs uppercase tracking-wider text-muted-foreground">
                            {SCRIPT_FIELD_LABELS[field as keyof typeof SCRIPT_FIELD_LABELS]}
                          </Label>
                          <button
                            type="button"
                            onClick={() => toggleScriptElement(field)}
                            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            {hidden ? "Show" : "Hide"}
                          </button>
                        </div>
                        <Input
                          id={`s-${field}`}
                          value={script.text[field] ?? ""}
                          onChange={(e) => setScriptText(field, e.target.value)}
                          disabled={hidden}
                        />
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
