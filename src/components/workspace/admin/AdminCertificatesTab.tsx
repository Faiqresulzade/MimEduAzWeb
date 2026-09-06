import { useEffect, useState, type FormEvent } from 'react';
import { certificatesApi, trainingsApi } from '../../../api';
import { ADMIN_CERTIFICATE_LIST_SUPPORTED } from '../../../api/pending';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Spinner } from '../../ui/Spinner';
import { formatDate } from '../../../lib/format';
import type { Certificate, Training } from '../../../types';

export default function AdminCertificatesTab() {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [issued, setIssued] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    trainingsApi
      .list()
      .then((data) => {
        if (cancelled) return;
        setTrainings(data);
        if (data.length > 0) setTrainingId(data[0].id);
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Təlimlər yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleIssue(event: FormEvent) {
    event.preventDefault();

    if (fullName.trim().length < 3) {
      toast('Müəllimin adını yazın.');
      return;
    }

    setSubmitting(true);
    try {
      const certificate = await certificatesApi.issue(fullName.trim(), trainingId);
      setIssued((current) => [certificate, ...current]);
      toast(`Sertifikat verildi: ${certificate.code}`);
      setFullName('');
    } catch (err) {
      toast(apiErrorMessage(err, 'Sertifikat verilmədi.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Sertifikatlar</h2>

      <form onSubmit={handleIssue} className="card mt-5">
        <h3 className="font-heading text-base font-bold text-brand-navy">
          Əl ilə sertifikat ver
        </h3>
        <p className="mt-1.5 text-sm text-brand-muted">
          Ad platformada qeydiyyatdan keçmiş istifadəçinin tam adı ilə üst-üstə düşməlidir.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="fullName"
            label="Müəllim adı"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nigar Əliyeva"
          />
          <Select
            name="trainingId"
            label="Təlim"
            value={trainingId}
            onChange={(event) => setTrainingId(event.target.value)}
          >
            {trainings.map((training) => (
              <option key={training.id} value={training.id}>
                {training.name}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" className="mt-4" disabled={submitting}>
          {submitting ? 'Verilir…' : 'Sertifikat ver'}
        </Button>
      </form>

      <div className="mt-8">
        <h3 className="font-heading text-base font-bold text-brand-navy">
          Verilmiş sertifikatlar
        </h3>
        {!ADMIN_CERTIFICATE_LIST_SUPPORTED && (
          <p className="mt-2 rounded-xl bg-brand-chipBg px-4 py-3 text-xs text-brand-muted">
            Backend hələ bütün sertifikatların siyahısını qaytaran endpoint vermir — burada
            yalnız bu sessiyada verilənlər görünür.
          </p>
        )}

        <div className="mt-3">
          {issued.length === 0 ? (
            <EmptyState title="Bu sessiyada sertifikat verilməyib" />
          ) : (
            <ul className="card !p-0">
              {issued.map((certificate) => (
                <li
                  key={certificate.id}
                  className="border-b border-brand-borderLight px-5 py-4 last:border-b-0"
                >
                  <p className="font-heading text-[15px] font-bold text-brand-navy">
                    {certificate.code}
                  </p>
                  <p className="mt-1 text-sm text-brand-ink">
                    {certificate.holderName} · {certificate.description}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-faint">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
