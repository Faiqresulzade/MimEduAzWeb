import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, id, className = '', children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <label className="block" htmlFor={selectId}>
      {label && (
        <span className="mb-1.5 block font-heading text-[13px] font-semibold text-brand-slate">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none rounded-xl border border-brand-border bg-white px-4 py-3 pr-10 text-sm text-brand-ink transition focus:border-brand-blue ${className}`}
          {...rest}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-muted"
        >
          ▾
        </span>
      </div>
      {hint && <span className="mt-1.5 block text-xs text-brand-faint">{hint}</span>}
    </label>
  );
});
