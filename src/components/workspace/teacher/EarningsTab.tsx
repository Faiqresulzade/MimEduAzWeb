import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { resourcesApi } from '../../../api';
import {
  COMMISSION_PERCENT,
  MIN_PAYOUT_BALANCE,
  computeAuthorEarnings,
  requestPayout,
} from '../../../api/pending';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../ui/Button';
import { ErrorNote } from '../../ui/ErrorNote';
import { Input } from '../../ui/Input';
import { Spinner } from '../../ui/Spinner';
import { StatCard } from '../../ui/StatCard';
import { formatNumber, formatPrice } from '../../../lib/format';
import type { Resource } from '../../../types';

export default function EarningsTab() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resourcesApi
      .mine()
      .then((data) => !cancelled && setResources(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Məlumat yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const earnings = useMemo(() => computeAuthorEarnings(resources), [resources]);

  async function handlePayout(event: FormEvent) {
    event.preventDefault();

    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 12) {
      toast('Kart nömrəsini tam yazın.');
      return;
    }
    if (earnings.netTotal < MIN_PAYOUT_BALANCE) {
      toast(`Balans ${MIN_PAYOUT_BALANCE} ₼-dən azdır — tələb göndərilmədi.`);
      return;
    }

    setSubmitting(true);
    try {
      await requestPayout(digits);
      toast('Ödəniş tələbi göndərildi.');
      setCardNumber('');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Qazanc</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Ödənişli materiallarınızın satışından formalaşan balans. Komissiya{' '}
        {Math.round(COMMISSION_PERCENT * 100)}%-dir.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Ümumi satış" value={formatPrice(earnings.grossTotal)} />
        <StatCard
          label="Platforma komissiyası"
          value={formatPrice(earnings.commissionTotal)}
          hint={`${Math.round(COMMISSION_PERCENT * 100)}%`}
        />
        <StatCard
          label="Xalis qazanc"
          value={formatPrice(earnings.netTotal)}
          hint={`${Math.round((1 - COMMISSION_PERCENT) * 100)}%`}
        />
      </div>

      {earnings.perResource.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-base font-bold text-brand-navy">
            Resurs üzrə bölgü
          </h3>
          <ul className="card mt-3 !p-0">
            {earnings.perResource.map((item) => (
              <li
                key={item.resourceId}
                className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {formatNumber(item.unitsSold)} satış × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-heading font-bold text-brand-navy">
                  {formatPrice(item.net)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handlePayout} className="card mt-8">
        <h3 className="font-heading text-base font-bold text-brand-navy">Ödəniş tələbi</h3>
        <p className="mt-1.5 text-sm text-brand-muted">
          Minimum balans {MIN_PAYOUT_BALANCE} ₼. Tələb 5 iş günü ərzində icra olunur.
        </p>

        <div className="mt-4 max-w-sm">
          <Input
            name="payoutCard"
            label="Kart nömrəsi"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            placeholder="4169 7388 1234 5678"
            inputMode="numeric"
          />
        </div>

        <Button type="submit" className="mt-4" disabled={submitting}>
          {submitting ? 'Göndərilir…' : 'Tələb göndər'}
        </Button>
      </form>
    </section>
  );
}
