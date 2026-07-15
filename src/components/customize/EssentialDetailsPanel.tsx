import { useCardDesign } from "@/hooks/use-card-design";
import {
  CHURCH_SECTIONS,
  FIELD_LABELS,
  SCRIPT_SECTIONS,
  SCRIPT_FIELD_LABELS,
} from "@/types/card-design";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function EssentialDetailsPanel() {
  const {
    state,
    setChurchText,
    toggleChurchElement,
    setScriptText,
    toggleScriptElement,
  } = useCardDesign();

  const isClassic = state.textLayoutId === "classic";
  const church = state.classicChurch;
  const script = state.scriptLayout;

  return (
    <>
      {isClassic ? (
        <Accordion type="multiple" defaultValue={["date-venue"]}>
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
        <Accordion type="multiple" defaultValue={["script-ceremony"]}>
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
    </>
  );
}
