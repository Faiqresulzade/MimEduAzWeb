export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-[13px] font-medium text-brand-muted">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-bold text-brand-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-brand-faint">{hint}</p>}
    </div>
  );
}
