export function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
      {children}
    </div>
  );
}
