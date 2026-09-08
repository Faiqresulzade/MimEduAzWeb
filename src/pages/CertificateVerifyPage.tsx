import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { certificatesApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { CertificateDownloadLinks } from '../components/certificates/CertificateDownloadLinks';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../lib/format';
import type { CertificateVerifyResult } from '../types';

/**
 * Sertifikatın üzərindəki QR kod bu səhifəyə aparır
 * (`Certificate__VerificationUrlTemplate`). Publikdir — token tələb etmir.
 */
export default function CertificateVerifyPage() {
  const { code = '' } = useParams();
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    certificatesApi
      .verify(code)
      .then((data) => !cancelled && setResult(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Yoxlama alınmadı.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="shell py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          Sertifikat yoxlaması
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Kod: <span className="font-heading font-semibold text-brand-ink">{code}</span>
        </p>

        <div className="mt-6">
          {loading && <Spinner />}
          {!loading && error && <ErrorNote message={error} />}

          {!loading && !error && result?.isValid && (
            <div className="card">
              <p className="status-badge bg-free-bg text-free-text">Sertifikat etibarlıdır</p>
              <p className="mt-4 font-heading text-xl font-bold text-brand-navy">
                {result.holderName}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-ink">
                {result.description}
              </p>
              {result.issuedAt && (
                <p className="mt-2 text-xs text-brand-faint">
                  Verilib: {formatDate(result.issuedAt)}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-borderLight pt-4">
                <CertificateDownloadLinks code={result.code} />
              </div>
            </div>
          )}

          {!loading && !error && result && !result.isValid && (
            <div className="card">
              <p className="status-badge bg-danger-bg text-danger-text">
                Sertifikat tapılmadı
              </p>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink">
                Bu kodla sertifikat tapılmadı. Kodu sertifikatın aşağı sağ küncündən
                yoxlayın.
              </p>
            </div>
          )}
        </div>

        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-brand-blue">
          ← Ana səhifə
        </Link>
      </div>
    </div>
  );
}
