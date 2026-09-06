import { useEffect, useState } from 'react';
import { certificatesApi, trainingsApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { FormatBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Spinner } from '../../ui/Spinner';
import { formatNumber, formatPrice } from '../../../lib/format';
import type { Training } from '../../../types';

export default function AdminTrainingsTab() {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

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

  async function issue(trainingId: string) {
    const fullName = (names[trainingId] ?? '').trim();
    if (fullName.length < 3) {
      toast('Müəllimin adını yazın.');
      return;
    }

    setBusyId(trainingId);
    try {
      const certificate = await certificatesApi.issue(fullName, trainingId);
      toast(`Sertifikat verildi: ${certificate.code}`);
      setNames((current) => ({ ...current, [trainingId]: '' }));
    } catch (err) {
      toast(apiErrorMessage(err, 'Sertifikat verilmədi.'));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Təlimlər</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Yazılan iştirakçı sayı və əl ilə sertifikat vermə.
      </p>

      <ul className="mt-5 space-y-3">
        {trainings.map((training) => (
          <li key={training.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <FormatBadge format={training.format} />
                <h3 className="mt-3 font-heading text-[15px] font-semibold text-brand-navy">
                  {training.name}
                </h3>
                <p className="mt-1 text-sm text-brand-muted">
                  {formatNumber(training.seatsTaken)} nəfər yazılıb ·{' '}
                  {training.seatLimit === null ? 'limitsiz' : `${training.seatLimit} yer`}
                </p>
              </div>
              <span className="font-heading text-lg font-bold text-brand-navy">
                {formatPrice(training.price)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-brand-borderLight pt-4">
              <div className="min-w-[220px] flex-1">
                <Input
                  name={`holder-${training.id}`}
                  label="Müəllim adı"
                  value={names[training.id] ?? ''}
                  onChange={(event) =>
                    setNames((current) => ({
                      ...current,
                      [training.id]: event.target.value,
                    }))
                  }
                  placeholder="Nigar Əliyeva"
                />
              </div>
              <Button
                size="sm"
                disabled={busyId === training.id}
                onClick={() => issue(training.id)}
              >
                Sertifikat ver
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
