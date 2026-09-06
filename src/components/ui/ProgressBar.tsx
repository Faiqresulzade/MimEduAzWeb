export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-pill bg-brand-borderLight"
    >
      <div
        className="h-full rounded-pill bg-brand-blue transition-[width] duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
