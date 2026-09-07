import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { trainingsApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { FormatBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice } from '../lib/format';
import type { TrainingDetail } from '../types';

export default function TrainingDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, pendingId } = useAddToCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    trainingsApi
      .get(id)
      .then((data) => !cancelled && setTraining(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Təlim tapılmadı.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !training) {
    return (
      <div className="shell py-14">
        <ErrorNote message={error ?? 'Təlim tapılmadı.'} />
        <Link to="/telimler" className="mt-4 inline-block text-sm font-semibold text-brand-blue">
          ← Bütün təlimlər
        </Link>
      </div>
    );
  }

  const soldOut = training.seatsLeft !== null && training.seatsLeft <= 0;

  return (
    <div className="shell py-10 sm:py-14">
      <Link to="/telimler" className="text-sm font-semibold text-brand-blue">
        ← Bütün təlimlər
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <FormatBadge format={training.format} />
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-navy">
            {training.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-ink">
            {training.description}
          </p>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-brand-navy">Proqram</h2>
            <ol className="mt-4 space-y-3">
              {training.syllabus
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((item, index) => (
                  <li key={item.id} className="card flex items-start gap-4 p-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-online-bg font-heading text-[13px] font-bold text-brand-blueDark">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm leading-relaxed text-brand-ink">{item.text}</span>
                  </li>
                ))}
            </ol>
          </section>
        </div>

        <aside className="card lg:sticky lg:top-24">
          <p className="font-heading text-3xl font-bold text-brand-navy">
            {formatPrice(training.price)}
          </p>

          <dl className="mt-5 space-y-3 border-t border-brand-borderLight pt-5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-brand-muted">Müddət</dt>
              <dd className="font-medium text-brand-ink">{training.metaLabel}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-brand-muted">Saat</dt>
              <dd className="font-medium text-brand-ink">{training.durationHours} saat</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-brand-muted">Dərs sayı</dt>
              <dd className="font-medium text-brand-ink">
                {training.lessonCount} dərs
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-brand-muted">Yer sayı</dt>
              <dd className="font-medium text-brand-ink">
                {training.seatLimit === null
                  ? 'Limitsiz'
                  : `${training.seatsLeft} / ${training.seatLimit}`}
              </dd>
            </div>
          </dl>

          {training.isEnrolled ? (
            <>
              <Button
                className="mt-6"
                fullWidth
                onClick={() => navigate(`/telimler/${training.id}/dersler`)}
              >
                Dərslərə keç
              </Button>
              <p className="mt-3 text-xs leading-relaxed text-brand-faint">
                Bu təlimə yazılmısınız — bütün dərslər açıqdır.
              </p>
            </>
          ) : (
            <>
              <Button
                className="mt-6"
                fullWidth
                disabled={pendingId === training.id || soldOut}
                onClick={() => add('Training', training.id)}
              >
                {soldOut ? 'Yer qalmayıb' : 'Səbətə əlavə et'}
              </Button>
              <p className="mt-3 text-xs leading-relaxed text-brand-faint">
                Ödəniş demo rejimdədir — kart məlumatı saxlanılmır.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
