import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificatesApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { Button } from '../../ui/Button';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Spinner } from '../../ui/Spinner';
import { CertificateDownloadLinks } from '../../certificates/CertificateDownloadLinks';
import { formatDate } from '../../../lib/format';
import type { Certificate } from '../../../types';

export default function MyCertificatesTab() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    certificatesApi
      .mine()
      .then((data) => !cancelled && setCertificates(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Sertifikatlar yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Kodu ana səhifədəki yoxlama bloquna ötürüb avtomatik yoxladır. */
  function verify(code: string) {
    sessionStorage.setItem('mimedu.verifyCode', code);
    navigate('/#sertifikat');
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Sertifikatlarım</h2>

      <div className="mt-5">
        {certificates.length === 0 ? (
          <EmptyState
            title="Hələ sertifikatınız yoxdur"
            text="Təlimi tamamladıqda və ya imtahandan keçid balı topladıqda sertifikat avtomatik verilir."
          />
        ) : (
          <ul className="space-y-3">
            {certificates.map((certificate) => (
              <li key={certificate.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-bold text-brand-navy">
                      {certificate.code}
                    </p>
                    <p className="mt-1 text-sm text-brand-ink">{certificate.holderName}</p>
                    <p className="mt-0.5 text-sm text-brand-muted">
                      {certificate.description}
                    </p>
                    <p className="mt-1 text-xs text-brand-faint">
                      Verilib: {formatDate(certificate.issuedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CertificateDownloadLinks code={certificate.code} />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => verify(certificate.code)}
                    >
                      Doğrula
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
