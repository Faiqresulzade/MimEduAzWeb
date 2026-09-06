import { useEffect, useState, type FormEvent } from 'react';
import { certificatesApi } from '../../api';
import { apiErrorMessage } from '../../hooks/useApiError';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { CertificateVerifyResult } from '../../types';
import { formatDate } from '../../lib/format';

type CheckState =
  | { kind: 'idle' }
  | { kind: 'neutral'; text: string }
  | { kind: 'found'; result: CertificateVerifyResult }
  | { kind: 'missing' };

/** Ana səhifədəki sertifikat yoxlama bloku (#sertifikat) — publik endpoint. */
export function CertificateCheck() {
  const [code, setCode] = useState('');
  const [state, setState] = useState<CheckState>({ kind: 'idle' });
  const [loading, setLoading] = useState(false);

  // Sertifikatlarım tabındakı "Doğrula" düyməsi kodu bura ötürür.
  useEffect(() => {
    const pending = sessionStorage.getItem('mimedu.verifyCode');
    if (!pending) return;
    sessionStorage.removeItem('mimedu.verifyCode');
    setCode(pending);
    void check(pending);
  }, []);

  async function check(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      setState({ kind: 'neutral', text: 'Sertifikat kodunu daxil edin.' });
      return;
    }

    setLoading(true);
    try {
      const result = await certificatesApi.verify(trimmed);
      setState(result.isValid ? { kind: 'found', result } : { kind: 'missing' });
    } catch (error) {
      setState({ kind: 'neutral', text: apiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void check(code);
  }

  return (
    <section id="sertifikat" className="shell scroll-mt-24 py-14 sm:py-16">
      <div className="card p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          Sertifikat yoxlama
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Sertifikatın aşağı sağ küncündəki kodu daxil edin. Yoxlama üçün hesab lazım
          deyil — məktəb rəhbərliyi də istifadə edə bilər.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              name="certInput"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="MIM-2026-4417"
              aria-label="Sertifikat kodu"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Yoxlanılır…' : 'Yoxla'}
          </Button>
        </form>

        {state.kind === 'neutral' && (
          <p className="mt-4 rounded-xl bg-brand-chipBg px-4 py-3 text-sm text-brand-muted">
            {state.text}
          </p>
        )}

        {state.kind === 'found' && (
          <div className="mt-4 rounded-xl bg-free-bg px-4 py-4 text-sm text-free-text">
            <p className="font-heading font-semibold">Sertifikat etibarlıdır ✓</p>
            <p className="mt-1.5">
              {state.result.holderName} · «{state.result.description}» ·{' '}
              {formatDate(state.result.issuedAt)}
            </p>
            <p className="mt-1 text-xs opacity-80">Kod: {state.result.code}</p>
          </div>
        )}

        {state.kind === 'missing' && (
          <p className="mt-4 rounded-xl bg-danger-bg px-4 py-4 text-sm text-danger-text">
            Bu kodla sertifikat tapılmadı. Kodu sertifikatın aşağı sağ küncündən yoxlayın.
          </p>
        )}
      </div>
    </section>
  );
}
