export function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  inputMode,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  dir?: "ltr" | "rtl" | "auto";
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs opacity-70">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        dir={dir ?? "auto"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}
