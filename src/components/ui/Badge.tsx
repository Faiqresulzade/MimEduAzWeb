import type { ReactNode } from 'react';
import type { TrainingFormat } from '../../types';
import { trainingFormatClasses, trainingFormatLabel } from '../../lib/format';

export function FormatBadge({ format }: { format: TrainingFormat }) {
  return (
    <span className={`format-badge ${trainingFormatClasses[format]}`}>
      {trainingFormatLabel(format)}
    </span>
  );
}

type StatusTone = 'paid' | 'free' | 'danger' | 'neutral' | 'info';

const toneClasses: Record<StatusTone, string> = {
  paid: 'bg-paid-bg text-paid-text',
  free: 'bg-free-bg text-free-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-brand-chipBg text-brand-muted',
  info: 'bg-online-bg text-online-text',
};

export function StatusBadge({
  tone = 'neutral',
  children,
}: {
  tone?: StatusTone;
  children: ReactNode;
}) {
  return <span className={`status-badge ${toneClasses[tone]}`}>{children}</span>;
}

export function PriceBadge({ isPaid, price }: { isPaid: boolean; price: number }) {
  return (
    <StatusBadge tone={isPaid ? 'paid' : 'free'}>
      {isPaid ? `${price} ₼` : 'Pulsuz'}
    </StatusBadge>
  );
}
