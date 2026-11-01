import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { certificatesApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { CertificateDownloadLinks } from '../components/certificates/CertificateDownloadLinks';
import { Button } from '../components/ui/Button';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Input } from '../components/ui/Input';
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
  const [loading, setLoading] = useState(Boolean(code));
  const [input, setInput] = useState(code);
  const [syncedCode, setSyncedCode] = useState(code);
  if (syncedCode !== code) {
    setSyncedCode(code);
    setInput(code);
  }
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    navigate(`/sertifikat-yoxla/${encodeURIComponent(trimmed)}`, { replace: Boolean(code) });
  }

  return (
    <div className="page">
      <div className="mx-auto max-w-xl">
        <h1 className="hidden font-heading text-2xl font-bold text-brand-navy sm:text-3xl lg:block">
          Sertifikat yoxlaması
        </h1>
        <p className="text-[13px] text-brand-muted lg:mt-2 lg:text-sm">
          Sertifikatın aşağı sağ küncündəki kodu daxil edin. Yoxlama üçün hesab lazım deyil.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="MIM-2026-0000"
              aria-label="Sertifikat kodu"
              autoCapitalize="characters"
            />
          </div>
          <Button type="submit">Yoxla</Button>
        </form>

        <div className="mt-6">
          {loading && <Spinner />}
          {code && !loading && error && <ErrorNote message={error} />}

          {code && !loading && !error && result?.isValid && (
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

          {code && !loading && !error && result && !result.isValid && (
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

        <Link to="/" className="mt-6 hidden text-sm font-semibold text-brand-blue lg:inline-block">
          ← Ana səhifə
        </Link>
      </div>
    </div>
  );
}
