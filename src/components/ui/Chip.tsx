import type { ReactNode } from 'react';

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Chip({ active = false, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[40px] items-center rounded-pill border px-4 py-[9px] font-heading text-sm font-semibold transition duration-200 ${
        active
          ? 'border-brand-blue bg-brand-blue text-white'
          : 'border-brand-border bg-white text-brand-slate hover:border-[#c9d8ef] hover:bg-brand-hoverBg'
      }`}
    >
      {children}
    </button>
  );
}
