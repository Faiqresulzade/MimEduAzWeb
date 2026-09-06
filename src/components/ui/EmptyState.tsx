import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  text?: string;
  action?: ReactNode;
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-chipBg text-xl text-brand-faint"
      >
        &#8709;
      </div>
      <h3 className="font-heading text-lg font-semibold text-brand-navy">{title}</h3>
      {text && <p className="max-w-sm text-sm text-brand-muted">{text}</p>}
      {action}
    </div>
  );
}
