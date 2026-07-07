import { useCardDesign } from "@/hooks/use-card-design";
import { Field } from "./shared/Field";
import { Group } from "./shared/Group";

export function EssentialDetailsPanel() {
  const { state, setField } = useCardDesign();

  return (
    <Group label="Essential details">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Groom name" value={state.groom} onChange={(v) => setField("groom", v)} />
        <Field label="Bride name" value={state.bride} onChange={(v) => setField("bride", v)} />
        <Field label="Date" value={state.date} onChange={(v) => setField("date", v)} />
        <Field label="Time" value={state.time} onChange={(v) => setField("time", v)} />
        <Field label="Venue" value={state.venue} onChange={(v) => setField("venue", v)} className="sm:col-span-2" />
      </div>

      <button
        type="button"
        onClick={() => setField("showAllLines", !state.showAllLines)}
        aria-expanded={state.showAllLines}
        className="mt-3 text-sm font-semibold underline underline-offset-4 transition-transform duration-150 active:scale-[0.97]"
      >
        {state.showAllLines ? "Hide all invitation lines" : "Edit all invitation lines →"}
      </button>

      {state.showAllLines && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2">
          <Field label="Eyebrow line" value={state.eyebrow} onChange={(v) => setField("eyebrow", v)} className="sm:col-span-2" />
          <Field label="Intro line" value={state.intro} onChange={(v) => setField("intro", v)} className="sm:col-span-2" />
          <Field label="Reception line" value={state.reception} onChange={(v) => setField("reception", v)} />
          <Field label="RSVP line" value={state.rsvp} onChange={(v) => setField("rsvp", v)} />
          <Field label="Closing / website" value={state.closing} onChange={(v) => setField("closing", v)} className="sm:col-span-2" />
        </div>
      )}
    </Group>
  );
}
