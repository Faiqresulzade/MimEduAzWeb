import type { ResourceType } from '../types';

export const SUBJECTS = [
  'Riyaziyyat',
  'Az. dili',
  'Biologiya',
  'İngilis dili',
  'Tarix',
  'Fizika',
] as const;

export const GRADES = Array.from({ length: 11 }, (_, i) => i + 1);

export const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
  { value: 'WorkSheet', label: 'İş vərəqi' },
  { value: 'Presentation', label: 'Təqdimat' },
  { value: 'Test', label: 'Test' },
  { value: 'MethodGuide', label: 'Metodik vəsait' },
];

export const ALL_FILTER = 'Hamısı';
export const ALL_GRADES = 'Bütün siniflər';

export const MAX_UPLOAD_MB = 25;
export const ACCEPTED_UPLOAD_TYPES = '.pdf,.docx,.pptx';
