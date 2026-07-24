export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  step,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-auto shrink-0 text-[11px] font-medium uppercase tracking-wider opacity-60">
        {label}
      </span>
      <div className="relative flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step ?? 1}
          value={value}
          aria-label={label}
          aria-valuetext={`${label}: ${value}`}
          onChange={(e) => onChange(Number(e.target.value))}
          className="peer h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 outline-none
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
                     [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                     [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                     [&::-webkit-slider-thumb]:active:scale-110
                     [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground
                     [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
          style={{
            background: `linear-gradient(to right, currentColor ${pct}%, color-mix(in oklch, currentColor 10%, transparent) ${pct}%)`,
          }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs tabular-nums opacity-70">{value}</span>
    </div>
  );
}
