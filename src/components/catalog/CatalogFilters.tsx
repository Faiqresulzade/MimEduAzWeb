import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';

export interface FilterGroup {
  key: string;
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface CatalogFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  placeholder: string;
  groups: FilterGroup[];
  /** Məs. «Riyaziyyat · bütün siniflər · 12 resurs» */
  summary: string;
  activeCount: number;
  onClear: () => void;
}

/**
 * Kataloq filtrləri. Masaüstündə çip qrupları kartda açıq durur; mobildə tətbiqdəki
 * kimi axtarış sahəsi + filtr düyməsi, filtrlər isə alt pəncərədə açılır.
 */
export function CatalogFilters({
  search,
  onSearch,
  placeholder,
  groups,
  summary,
  activeCount,
  onClear,
}: CatalogFiltersProps) {
  const [text, setText] = useState(search);
  const [sheetOpen, setSheetOpen] = useState(false);

  // URL-dəki axtarış dəyişəndə (məs. geri düyməsi) sahəni yenilə.
  const [syncedSearch, setSyncedSearch] = useState(search);
  if (syncedSearch !== search) {
    setSyncedSearch(search);
    setText(search);
  }

  // Yazmağı bitirəndən 400 ms sonra tətbiq olunur (mobil SearchFilterBar kimi).
  useEffect(() => {
    if (text.trim() === search) return;
    const timer = setTimeout(() => onSearch(text.trim()), 400);
    return () => clearTimeout(timer);
  }, [text, search, onSearch]);

  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setSheetOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  const searchField = (
    <label className="relative block flex-1">
      <span className="sr-only">{placeholder}</span>
      <Icon
        name="magnify"
        size={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-faint"
      />
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && onSearch(text.trim())}
        placeholder={placeholder}
        className="min-h-[48px] w-full rounded-xl border border-brand-border bg-white py-3 pl-11 pr-4 text-base lg:text-[15px] text-brand-ink transition placeholder:text-brand-faint focus:border-brand-blue"
      />
    </label>
  );

  const chipGroups = groups.map((group) => (
    <div key={group.key}>
      <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-[.08em] text-brand-faint">
        {group.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => (
          <Chip
            key={option.value}
            active={group.value === option.value}
            onClick={() => group.onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      {/* Masaüstü */}
      <div className="card hidden space-y-5 lg:block">
        {searchField}
        {chipGroups}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-borderLight pt-4">
          <p className="text-sm font-medium text-brand-slate">{summary}</p>
          {activeCount > 0 && (
            <Button variant="secondary" size="sm" onClick={onClear}>
              Filtri təmizlə
            </Button>
          )}
        </div>
      </div>

      {/* Mobil */}
      <div className="space-y-3 lg:hidden">
        <div className="flex items-start gap-2">
          {searchField}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={activeCount > 0 ? `Filtrlər, ${activeCount} aktiv` : 'Filtrlər'}
            className={`inline-flex h-12 min-w-[48px] items-center justify-center gap-1 rounded-xl border px-3 transition ${
              activeCount > 0
                ? 'border-brand-blue bg-brand-blue text-white'
                : 'border-brand-border bg-white text-brand-slate'
            }`}
          >
            <Icon name="tune-variant" size={20} />
            {activeCount > 0 && (
              <span className="font-heading text-[13px] font-bold">{activeCount}</span>
            )}
          </button>
        </div>
        <p className="text-[13px] text-brand-muted">{summary}</p>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtrlər">
          <button
            type="button"
            aria-label="Bağla"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 h-full w-full animate-[fadeIn_.2s_ease-out] bg-black/50"
          />
          <div className="absolute inset-x-0 bottom-0 flex h-[70vh] animate-[sheetUp_.25s_ease-out] flex-col rounded-t-2xl bg-brand-surface">
            <div className="flex justify-center py-2.5">
              <span aria-hidden className="h-1 w-8 rounded-full bg-brand-border" />
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <h2 className="font-heading text-lg font-semibold text-brand-navy">Filtrlər</h2>
              {chipGroups}
              <div className="space-y-3 border-t border-brand-borderLight pt-4">
                <p className="text-[13px] font-medium text-brand-slate">{summary}</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={onClear}>
                    Filtri təmizlə
                  </Button>
                  <Button onClick={() => setSheetOpen(false)}>Nəticələrə bax</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
