import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trainingsApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useAddToCart } from '../../../hooks/useAddToCart';
import { useToast } from '../../../hooks/useToast';
import { FormatBadge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { ProgressBar } from '../../ui/ProgressBar';
import { Spinner } from '../../ui/Spinner';
import { formatPrice } from '../../../lib/format';
import type { MyTraining, Training } from '../../../types';

export default function MyTrainingsTab() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [enrollments, setEnrollments] = useState<MyTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { add, pendingId } = useAddToCart();

  useEffect(() => {
    let cancelled = false;
    Promise.all([trainingsApi.list(), trainingsApi.mine()])
      .then(([all, mine]) => {
        if (cancelled) return;
        setTrainings(all);
        setEnrollments(mine);
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Təlimlər yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Təlimlərim</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Yazıldığınız təlimlərin gedişatı və hələ yazılmadıqlarınız.
      </p>

      <div className="mt-5 space-y-4">
        {trainings.map((training) => {
          const enrollment = enrollments.find((item) => item.trainingId === training.id);

          return (
            <article key={training.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <FormatBadge format={training.format} />
                  <h3 className="mt-3 font-heading text-lg font-semibold text-brand-navy">
                    <Link to={`/telimler/${training.id}`} className="hover:text-brand-blue">
                      {training.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-brand-muted">{training.metaLabel}</p>
                </div>

                <StatusBadge
                  tone={
                    !enrollment ? 'neutral' : enrollment.status === 'Completed' ? 'free' : 'info'
                  }
                >
                  {!enrollment
                    ? 'Yazılmamış'
                    : enrollment.status === 'Completed'
                      ? 'Tamamlandı'
                      : 'Davam edir'}
                </StatusBadge>
              </div>

              {enrollment ? (
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-brand-muted">Gedişat</span>
                    <span className="font-heading font-semibold text-brand-navy">
                      {enrollment.progressPercent}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={enrollment.progressPercent} />
                  </div>

                  <div className="mt-4">
                    {enrollment.status === 'Completed' ? (
                      <Link to="/panel/sertifikatlarim">
                        <Button size="sm">Sertifikatı gör</Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toast('Dərs açılır, demoda məzmun yoxdur')}
                      >
                        Davam et
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand-borderLight pt-4">
                  <span className="text-sm text-brand-slate">
                    Qeydiyyat açıqdır · {formatPrice(training.price)}
                  </span>
                  <Button
                    size="sm"
                    disabled={pendingId === training.id}
                    onClick={() => add('Training', training.id)}
                  >
                    Səbətə əlavə et
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
