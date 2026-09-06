export function Spinner({ label = 'Yüklənir…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-brand-muted">
      <span
        aria-hidden
        className="h-5 w-5 animate-spin rounded-full border-2 border-brand-border border-t-brand-blue"
      />
      <span>{label}</span>
    </div>
  );
}
