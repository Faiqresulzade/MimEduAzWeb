import { ALL_FILTER, ALL_GRADES, RESOURCE_TYPE_OPTIONS, SUBJECTS } from './constants';

/** Mobil tətbiqin `lib/filters.ts`-i ilə eyni seçimlər; «hamısı» `ALL_FILTER`-dir. */
export const subjectOptions = [
  { value: ALL_FILTER, label: ALL_FILTER },
  ...SUBJECTS.map((subject) => ({ value: subject, label: subject })),
];

export function gradeOptions(grades: number[]) {
  return [
    { value: ALL_GRADES, label: ALL_GRADES },
    ...grades.map((grade) => ({ value: String(grade), label: String(grade) })),
  ];
}

export const resourceTypeOptions = [
  { value: ALL_FILTER, label: ALL_FILTER },
  ...RESOURCE_TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
];

export const PRICE_FREE = 'pulsuz';
export const PRICE_PAID = 'odenisli';

export const priceOptions = [
  { value: ALL_FILTER, label: ALL_FILTER },
  { value: PRICE_FREE, label: 'Pulsuz' },
  { value: PRICE_PAID, label: 'Ödənişli' },
];

export function matchesPrice(price: string, isPaid: boolean) {
  return price === ALL_FILTER || (price === PRICE_PAID) === isPaid;
}

/** Axtarış mətni: kiçik hərf, Azərbaycan locale ilə. */
export function matchesSearch(search: string, ...fields: (string | null | undefined)[]) {
  if (!search) return true;
  const needle = search.toLocaleLowerCase('az');
  return fields.some((field) => field?.toLocaleLowerCase('az').includes(needle));
}

/** «Riyaziyyat · 5-ci sinif · 12 resurs» */
export function filterSummary(subject: string, grade: string, count: number, noun: string) {
  return [
    subject === ALL_FILTER ? 'Bütün fənlər' : subject,
    grade === ALL_GRADES ? 'bütün siniflər' : `${grade}-ci sinif`,
    `${count} ${noun}`,
  ].join(' · ');
}
