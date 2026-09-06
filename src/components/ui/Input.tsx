import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, id, className = '', ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block font-heading text-[13px] font-semibold text-brand-slate">
          {label}
        </span>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink transition placeholder:text-brand-faint focus:border-brand-blue ${className}`}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-xs text-brand-faint">{hint}</span>}
    </label>
  );
});
