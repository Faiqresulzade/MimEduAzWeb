import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { examsApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { ExamCard } from '../components/exams/ExamCard';
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
  subjectOptions,
} from '../lib/filters';
import type { Exam } from '../types';

const PAGE_SIZE = 100;

export default function ExamsPage() {
  const [params, setParams] = useSearchParams();
  const { add, pendingId } = useAddToCart();

  const subject = params.get('fenn') ?? ALL_FILTER;
  const grade = params.get('sinif') ?? ALL_GRADES;
  const price = params.get('qiymet') ?? ALL_FILTER;
  const search = params.get('q') ?? '';

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    examsApi
      .list({ pageSize: PAGE_SIZE })
      .then((data) => !cancelled && setExams(data.items))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Sınaqlar yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const availableGrades = useMemo(
    () =>
      [...new Set(exams.map((item) => item.grade).filter((g): g is number => g !== null))].sort(
        (a, b) => a - b,
      ),
    [exams],
  );

  const filtered = useMemo(
    () =>
      exams.filter(
        (item) =>
          (subject === ALL_FILTER || item.subject === subject) &&
          (grade === ALL_GRADES || String(item.grade) === grade) &&
          matchesPrice(price, item.isPaid) &&
          matchesSearch(search, item.name, item.authorName, item.subject),
      ),
    [exams, subject, grade, price, search],
  );

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

  const activeCount = [subject !== ALL_FILTER, grade !== ALL_GRADES, price !== ALL_FILTER].filter(
    Boolean,
  ).length;

  return (
    <div className="page">
      <header className="hidden max-w-2xl lg:block">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Sınaqlar</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Müəllimlərin hazırladığı vaxt limitli sınaq imtahanları. Nəticə fənn üzrə
          ayrıca göstərilir, keçid balından yuxarı nəticəyə sertifikat verilir.
        </p>
      </header>

      <div className="lg:mt-8">
        <CatalogFilters
          search={search}
          onSearch={onSearch}
          placeholder="Sınaq axtar…"
          activeCount={activeCount}
          summary={filterSummary(subject, grade, filtered.length, 'sınaq')}
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
            ...(availableGrades.length > 0
              ? [
                  {
                    key: 'grade',
                    title: 'Sinif',
                    options: gradeOptions(availableGrades),
                    value: grade,
                    onChange: (value: string) => updateFilter('sinif', value, ALL_GRADES),
                  },
                ]
              : []),
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
            title="Bu filtrə uyğun sınaq tapılmadı"
            text="Fənn və ya sinif seçimini dəyişib yenidən yoxlayın."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                busy={pendingId === exam.id}
                onAddToCart={() => add('Exam', exam.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
