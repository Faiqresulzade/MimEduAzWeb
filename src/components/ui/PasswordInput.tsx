import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.4 3.3M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5.4-1.4" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          <path d="m2 2 20 20" />
        </>
      )}
    </svg>
  );
}

/**
 * Şifrə sahəsi — göz ikonu ilə mətni göstər/gizlət.
 * `Input`-dan ayrıca komponentdir, çünki düymə `<label>`-in içində olmamalıdır
 * (klik label-ə düşüb fokusu oğurlayardı).
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, hint, id, className = '', ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? rest.name ?? generatedId;
    const [visible, setVisible] = useState(false);

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-heading text-[13px] font-semibold text-brand-slate"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={`w-full rounded-xl border border-brand-border bg-white py-3 pl-4 pr-12 text-sm text-brand-ink transition placeholder:text-brand-faint focus:border-brand-blue ${className}`}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-brand-faint transition hover:text-brand-slate"
          >
            <EyeIcon open={visible} />
          </button>
        </div>

        {hint && <span className="mt-1.5 block text-xs text-brand-faint">{hint}</span>}
      </div>
    );
  },
);
