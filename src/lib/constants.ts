import type { FileResourceType, LinkResourceType, ResourceType } from '../types';

export const SUBJECTS = [
  'Riyaziyyat',
  'Az. dili',
  'Biologiya',
  'İngilis dili',
  'Tarix',
  'Fizika',
] as const;

export const GRADES = Array.from({ length: 11 }, (_, i) => i + 1);

/** Fayl yüklənən tiplər — `POST /resources` (multipart). */
export const FILE_RESOURCE_TYPE_OPTIONS: { value: FileResourceType; label: string }[] = [
  { value: 'WorkSheet', label: 'İş vərəqi' },
  { value: 'Presentation', label: 'Təqdimat' },
  { value: 'Test', label: 'Test' },
  { value: 'MethodGuide', label: 'Metodik vəsait' },
];

/** Link saxlanan tiplər — `POST /resources/link` (JSON). */
export const LINK_RESOURCE_TYPE_OPTIONS: { value: LinkResourceType; label: string }[] = [
  { value: 'Video', label: 'Video dərs' },
  { value: 'ExternalLink', label: 'Xarici link' },
];

export const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
  ...FILE_RESOURCE_TYPE_OPTIONS,
  ...LINK_RESOURCE_TYPE_OPTIONS,
];

/** Şifrə qaydaları backend Identity konfiqurasiyası ilə eyni olmalıdır. */
export const PASSWORD_MIN_LENGTH = 8;

export const ALL_FILTER = 'Hamısı';
export const ALL_GRADES = 'Bütün siniflər';

export const MAX_UPLOAD_MB = 25;
export const ACCEPTED_UPLOAD_TYPES = '.pdf,.docx,.pptx';
