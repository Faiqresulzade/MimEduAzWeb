import { useEffect, useState } from 'react';
import { trainingsApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { TrainingCard } from '../components/trainings/TrainingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import type { Training } from '../types';

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, pendingId } = useAddToCart();

  useEffect(() => {
    let cancelled = false;
    trainingsApi
      .list()
      .then((data) => !cancelled && setTrainings(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Təlimlər yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="shell py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Təlimlər</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Canlı, onlayn və video formatda təlimlər. Hər təlimin sonunda koda görə
          yoxlanılan sertifikat verilir.
        </p>
      </header>

      <div className="mt-8">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorNote message={error} />
        ) : trainings.length === 0 ? (
          <EmptyState title="Hazırda aktiv təlim yoxdur" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                adding={pendingId === training.id}
                onAddToCart={() => add('Training', training.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
