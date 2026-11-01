import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourcesApi } from '../api';
import { getPassedResourceIds } from '../api/pending';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { useAuth } from '../hooks/useAuth';
import { useDownload } from '../hooks/useDownload';
import { ResourceCard } from '../components/resources/ResourceCard';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { ALL_FILTER, ALL_GRADES } from '../lib/constants';
import {
  filterSummary,
  gradeOptions,
  matchesPrice,
  matchesSearch,
  priceOptions,
  resourceTypeOptions,
  subjectOptions,
} from '../lib/filters';
import type { Resource } from '../types';

const PAGE_SIZE = 100;

export default function ResourcesPage() {
  const [params, setParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { add, pendingId: addingId } = useAddToCart();
  const { download, pendingId: downloadingId } = useDownload();

  const subject = params.get('fenn') ?? ALL_FILTER;
  const grade = params.get('sinif') ?? ALL_GRADES;
  const type = params.get('tip') ?? ALL_FILTER;
  const price = params.get('qiymet') ?? ALL_FILTER;
  const search = params.get('q') ?? '';

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sinif çipləri mövcud resurslardan çıxarılır, ona görə tam siyahı bir dəfə alınır
  // və filtrləmə frontend-də edilir (backend filtri də dəstəkləyir, amma o zaman
  // mövcud sinif siyahısı filtrdən asılı olaraq daralardı).
  useEffect(() => {
    let cancelled = false;
    resourcesApi
      .list({ pageSize: PAGE_SIZE })
      .then((data) => !cancelled && setResources(data.items))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Resurslar yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const availableGrades = useMemo(
    () => [...new Set(resources.map((item) => item.grade))].sort((a, b) => a - b),
    [resources],
  );

  const filtered = useMemo(
    () =>
      resources.filter(
        (item) =>
          (subject === ALL_FILTER || item.subject === subject) &&
          (grade === ALL_GRADES || String(item.grade) === grade) &&
          (type === ALL_FILTER || item.type === type) &&
          matchesPrice(price, item.isPaid) &&
          matchesSearch(search, item.name, item.authorName, item.subject),
      ),
    [resources, subject, grade, type, price, search],
  );

  const passedIds = useMemo(() => getPassedResourceIds(user?.id), [user?.id]);

  const updateFilter = useCallback(
    (key: string, value: string, defaultValue: string) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value === defaultValue) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const onSearch = useCallback((value: string) => updateFilter('q', value, ''), [updateFilter]);

  const activeCount = [
    subject !== ALL_FILTER,
    grade !== ALL_GRADES,
    type !== ALL_FILTER,
    price !== ALL_FILTER,
  ].filter(Boolean).length;

  return (
    <div className="page">
      <header className="hidden max-w-2xl lg:block">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Resurs Bankı</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Müəllimlərin hazırladığı iş vərəqləri, testlər, təqdimatlar və metodik
          vəsaitlər. Hər material moderasiyadan keçir.
        </p>
      </header>

      <div className="lg:mt-8">
        <CatalogFilters
          search={search}
          onSearch={onSearch}
          placeholder="Resurs axtar…"
          activeCount={activeCount}
          summary={filterSummary(subject, grade, filtered.length, 'resurs')}
          onClear={() =>
            setParams(search ? new URLSearchParams({ q: search }) : new URLSearchParams(), {
              replace: true,
            })
          }
          groups={[
            {
              key: 'subject',
              title: 'Fənn',
              options: subjectOptions,
              value: subject,
              onChange: (value) => updateFilter('fenn', value, ALL_FILTER),
            },
            {
              key: 'grade',
              title: 'Sinif',
              options: gradeOptions(availableGrades),
              value: grade,
              onChange: (value) => updateFilter('sinif', value, ALL_GRADES),
            },
            {
              key: 'type',
              title: 'Tip',
              options: resourceTypeOptions,
              value: type,
              onChange: (value) => updateFilter('tip', value, ALL_FILTER),
            },
            {
              key: 'price',
              title: 'Qiymət',
              options: priceOptions,
              value: price,
              onChange: (value) => updateFilter('qiymet', value, ALL_FILTER),
            },
          ]}
        />
      </div>

      <div className="mt-4 lg:mt-6">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorNote message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Bu filtrə uyğun resurs tapılmadı"
            text="Fənn və ya sinif seçimini dəyişib yenidən yoxlayın."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                showQuizState={isAuthenticated}
                quizPassed={passedIds.has(resource.id)}
                busy={addingId === resource.id || downloadingId === resource.id}
                onAddToCart={() => add('Resource', resource.id)}
                onDownload={() => download(resource.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
