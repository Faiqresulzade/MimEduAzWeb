import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourcesApi } from '../api';
import { getPassedResourceIds } from '../api/pending';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { useAuth } from '../hooks/useAuth';
import { useDownload } from '../hooks/useDownload';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { ALL_FILTER, ALL_GRADES } from '../lib/constants';
import type { Resource } from '../types';

const PAGE_SIZE = 100;

export default function ResourcesPage() {
  const [params, setParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { add, pendingId: addingId } = useAddToCart();
  const { download, pendingId: downloadingId } = useDownload();

  const subject = params.get('fenn') ?? ALL_FILTER;
  const grade = params.get('sinif') ?? ALL_GRADES;

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
          (grade === ALL_GRADES || String(item.grade) === grade),
      ),
    [resources, subject, grade],
  );

  const passedIds = useMemo(() => getPassedResourceIds(user?.id), [user?.id]);

  function updateFilter(key: string, value: string, defaultValue: string) {
    const next = new URLSearchParams(params);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  return (
    <div className="shell py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Resurs Bankı</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Müəllimlərin hazırladığı iş vərəqləri, testlər, təqdimatlar və metodik
          vəsaitlər. Hər material moderasiyadan keçir.
        </p>
      </header>

      <div className="mt-8 card">
        <ResourceFilters
          subject={subject}
          grade={grade}
          availableGrades={availableGrades}
          resultCount={filtered.length}
          onSubjectChange={(value) => updateFilter('fenn', value, ALL_FILTER)}
          onGradeChange={(value) => updateFilter('sinif', value, ALL_GRADES)}
          onClear={() => setParams(new URLSearchParams(), { replace: true })}
        />
      </div>

      <div className="mt-6">
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
