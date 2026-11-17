import { useEffect, useState } from 'react';
import { payoutsApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Spinner } from '../../ui/Spinner';
import { formatDateTime, formatPrice } from '../../../lib/format';
import type { AdminPayout, PayoutStatus } from '../../../types';

const STATUS: Record<PayoutStatus, { label: string; className: string }> = {
  Requested: { label: 'Gözləyir', className: 'bg-paid-bg text-paid-text' },
  Paid: { label: 'Köçürülüb', className: 'bg-live-bg text-live-text' },
  Rejected: { label: 'Rədd edilib', className: 'bg-danger-bg text-danger-text' },
};

/** IBAN-ı 4-lük qruplarla göstərir ki, bank tətbiqinə köçürərkən səhv olmasın. */
function groupIban(iban: string) {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Müəllif ödəniş tələbləri. Admin bank tətbiqində IBAN-a köçürmə edir, sonra burada
 * "Köçürüldü" qeyd edir (və ya səbəb yazıb rədd edir — məbləğ müəllimin balansına qayıdır).
 */
export default function PayoutsTab() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<AdminPayout[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    payoutsApi
      .adminList()
      .then((data) => !cancelled && setPayouts(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Tələblər yüklənmədi.')));
    return () => {
      cancelled = true;
    };
  }, []);

  async function process(payout: AdminPayout, approve: boolean) {
    const note = approve
      ? window.prompt('Köçürmənin referansı (istəyə bağlı):', '') ?? undefined
      : window.prompt('Rədd səbəbi (müəllim görəcək):', '');
    if (!approve && !note?.trim()) return;

    setBusyId(payout.id);
    try {
      const updated = await payoutsApi.adminProcess(payout.id, approve, note?.trim() || undefined);
      setPayouts((current) => current?.map((p) => (p.id === updated.id ? updated : p)) ?? null);
      toast(approve ? 'Köçürüldü kimi qeyd edildi.' : 'Tələb rədd edildi.');
    } catch (err) {
      toast(apiErrorMessage(err, 'Əməliyyat alınmadı.'));
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <ErrorNote message={error} />;
  if (!payouts) return <Spinner />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Müəllif ödənişləri</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Tələbi bank köçürməsi ilə 5 iş günü ərzində icra edin, sonra «Köçürüldü» qeyd edin.
      </p>

      <div className="mt-5 space-y-3">
        {payouts.length === 0 ? (
          <EmptyState title="Ödəniş tələbi yoxdur" />
        ) : (
          payouts.map((payout) => (
            <article key={payout.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-bold text-brand-navy">
                    {formatPrice(payout.amount)}
                  </p>
                  <p className="text-sm text-brand-slate">
                    {payout.userName} · {payout.userEmail}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-faint">{formatDateTime(payout.createdAt)}</p>
                </div>
                <span className={`status-badge ${STATUS[payout.status].className}`}>
                  {STATUS[payout.status].label}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-[120px_minmax(0,1fr)] gap-y-1 rounded-xl bg-brand-chipBg p-3 text-[13px]">
                <dt className="text-brand-muted">IBAN</dt>
                <dd className="select-all font-mono">{groupIban(payout.iban)}</dd>
                <dt className="text-brand-muted">Hesab sahibi</dt>
                <dd>{payout.accountHolder}</dd>
                <dt className="text-brand-muted">FİN</dt>
                <dd className="font-mono">{payout.fin}</dd>
                {payout.adminNote && (
                  <>
                    <dt className="text-brand-muted">Qeyd</dt>
                    <dd>{payout.adminNote}</dd>
                  </>
                )}
              </dl>

              {payout.status === 'Requested' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" disabled={busyId === payout.id} onClick={() => process(payout, true)}>
                    Köçürüldü
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyId === payout.id}
                    onClick={() => process(payout, false)}
                  >
                    Rədd et
                  </Button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
