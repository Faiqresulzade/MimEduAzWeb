import type { ResourceType, TrainingFormat } from '../types';

/** Min ayırıcısı ilə: 1240 → "1 240" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('az-AZ').format(value).replace(/ /g, ' ');
}

/** Qiymət: 120 → "120 ₼", 35.5 → "35,5 ₼" */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded)
    ? formatNumber(rounded)
    : formatNumber(rounded).replace('.', ',');
  return `${text} ₼`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('az-AZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${formatDate(iso)}, ${new Intl.DateTimeFormat('az-AZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)}`;
}

/** "Nigar Əliyeva" → "NƏ" */
export function initials(fullName: string | null | undefined): string {
  if (!fullName) return '?';
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const resourceTypeLabels: Record<ResourceType, string> = {
  WorkSheet: 'İş vərəqi',
  Presentation: 'Təqdimat',
  Test: 'Test',
  MethodGuide: 'Metodik vəsait',
};

export const trainingFormatLabels: Record<TrainingFormat, string> = {
  Live: 'Canlı',
  Online: 'Onlayn',
  Video: 'Video',
};

export const trainingFormatClasses: Record<TrainingFormat, string> = {
  Live: 'bg-live-bg text-live-text',
  Online: 'bg-online-bg text-online-text',
  Video: 'bg-video-bg text-video-text',
};

export function resourceTypeLabel(type: ResourceType): string {
  return resourceTypeLabels[type] ?? type;
}

export function trainingFormatLabel(format: TrainingFormat): string {
  return trainingFormatLabels[format] ?? format;
}
