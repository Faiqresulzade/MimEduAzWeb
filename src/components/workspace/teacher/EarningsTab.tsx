import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { payoutsApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Spinner } from '../../ui/Spinner';
import { StatCard } from '../../ui/StatCard';
import { formatDate, formatNumber, formatPrice } from '../../../lib/format';
import type { Earnings, PayoutStatus } from '../../../types';

const PAYOUT_STATUS: Record<PayoutStatus, { label: string; className: string }> = {
  Requested: { label: 'Gözləyir', className: 'bg-paid-bg text-paid-text' },
  Paid: { label: 'Köçürülüb', className: 'bg-live-bg text-live-text' },
  Rejected: { label: 'Rədd edilib', className: 'bg-danger-bg text-danger-text' },
};

/** AZ IBAN: AZ + 2 rəqəm + 4 hərf + 20 simvol (boşluqsuz 28). */
function normalizeIban(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Müəllif qazancı — yalnız ödənilmiş satışlardan (backend hesablayır). Pul bank köçürməsi
 * ilə çıxarılır: kart nömrəsi toplanmır, yalnız IBAN, hesab sahibinin adı və FİN.
 */
export default function EarningsTab() {
  const { toast } = useToast();
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [iban, setIban] = useState('');
  const [holder, setHolder] = useState('');
  const [fin, setFin] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setEarnings(await payoutsApi.mine());
    } catch (err) {
      setError(apiErrorMessage(err, 'Məlumat yüklənmədi.'));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePayout(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!/^AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}$/.test(normalizeIban(iban))) {
      setFormError('IBAN düzgün deyil (AZ ilə başlayan 28 simvol).');
      return;
    }
    if (holder.trim().length < 3) {
      setFormError('Hesab sahibinin adını bankdakı kimi yazın.');
      return;
    }
    if (!/^[A-Za-z0-9]{7}$/.test(fin.trim())) {
      setFormError('FİN kod 7 simvol olmalıdır.');
      return;
    }

    setSubmitting(true);
    try {
      await payoutsApi.request({ iban: normalizeIban(iban), accountHolder: holder.trim(), fin: fin.trim() });
      toast('Ödəniş tələbi göndərildi.');
      setIban('');
      setFin('');
      await load();
    } catch (err) {
      setFormError(apiErrorMessage(err, 'Tələb göndərilmədi.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <ErrorNote message={error} />;
  if (!earnings) return <Spinner />;

  const canRequest = earnings.available >= earnings.minimumPayout && earnings.pendingPayout === 0;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Qazanc</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Yalnız ödənişi təsdiqlənmiş satışlar hesablanır. Satışın 80%-i sizə, 20%-i platforma
        komissiyasıdır. Geri qaytarılan sifariş balansdan çıxılır.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Ümumi satış" value={formatPrice(earnings.gross)} />
        <StatCard label="Xalis qazanc" value={formatPrice(earnings.net)} hint="80%" />
        <StatCard
          label="Çıxarıla bilən balans"
          value={formatPrice(earnings.available)}
          hint={
            earnings.pendingPayout > 0
              ? `${formatPrice(earnings.pendingPayout)} tələb icrada`
              : `Köçürülüb: ${formatPrice(earnings.paidOut)}`
          }
        />
      </div>

      {earnings.items.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-base font-bold text-brand-navy">Material üzrə bölgü</h3>
          <ul className="card mt-3 !p-0">
            {earnings.items.map((item) => (
              <li
                key={`${item.itemType}-${item.itemId}`}
                className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">{item.name}</p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {formatNumber(item.unitsSold)} satış · {formatPrice(item.gross)}
                  </p>
                </div>
                <span className="font-heading font-bold text-brand-navy">{formatPrice(item.net)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handlePayout} className="card mt-8">
        <h3 className="font-heading text-base font-bold text-brand-navy">Ödəniş tələbi</h3>
        <p className="mt-1.5 text-sm text-brand-muted">
          Bütün balans bank hesabınıza (IBAN) köçürülür. Minimum {formatPrice(earnings.minimumPayout)}.
          Tələb 5 iş günü ərzində icra olunur. Kart nömrəsi tələb olunmur.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              name="payoutIban"
              label="IBAN"
              value={iban}
              onChange={(event) => setIban(event.target.value)}
              placeholder="AZ21 NABZ 0000 0000 1370 1000 1944"
              autoComplete="off"
            />
          </div>
          <Input
            name="payoutHolder"
            label="Hesab sahibi (bankdakı kimi)"
            value={holder}
            onChange={(event) => setHolder(event.target.value)}
            autoComplete="name"
          />
          <Input
            name="payoutFin"
            label="FİN kod"
            value={fin}
            maxLength={7}
            onChange={(event) => setFin(event.target.value.toUpperCase())}
            hint="Şəxsiyyət vəsiqəsindəki 7 simvollu kod (vergi uçotu üçün)."
            autoComplete="off"
          />
        </div>

        <div className="mt-4">
          <ErrorNote message={formError} />
        </div>

        <Button type="submit" className="mt-4" disabled={submitting || !canRequest}>
          {submitting ? 'Göndərilir…' : 'Tələb göndər'}
        </Button>
        {!canRequest && (
          <p className="mt-2 text-[13px] text-brand-muted">
            {earnings.pendingPayout > 0
              ? 'Əvvəlki tələbiniz icra olunduqdan sonra yenisini göndərə bilərsiniz.'
              : `Balans ${formatPrice(earnings.minimumPayout)}-dən azdır.`}
          </p>
        )}
      </form>

      {earnings.payouts.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-base font-bold text-brand-navy">Tələblər</h3>
          <ul className="card mt-3 !p-0">
            {earnings.payouts.map((payout) => (
              <li
                key={payout.id}
                className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">
                    {formatPrice(payout.amount)} · {payout.ibanMasked}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {formatDate(payout.createdAt)}
                    {payout.adminNote ? ` · ${payout.adminNote}` : ''}
                  </p>
                </div>
                <span className={`status-badge ${PAYOUT_STATUS[payout.status].className}`}>
                  {PAYOUT_STATUS[payout.status].label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
