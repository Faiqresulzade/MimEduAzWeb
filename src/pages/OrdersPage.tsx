import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { formatDateTime, formatPrice } from '../lib/format';
import { MERCHANT_NAME, SELLER_NAME, SELLER_VOEN } from '../data/legal';
import type { Order, OrderStatus } from '../types';

const STATUS: Record<OrderStatus, { label: string; tone: 'free' | 'paid' | 'danger' | 'neutral' | 'info' }> = {
  Paid: { label: 'Ödənilib', tone: 'free' },
  Pending: { label: 'Ödəniş gözlənilir', tone: 'paid' },
  Failed: { label: 'Uğursuz', tone: 'danger' },
  Cancelled: { label: 'Ləğv edilib', tone: 'neutral' },
  Refunded: { label: 'Qaytarılıb', tone: 'info' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ordersApi
      .mine()
      .then((data) => !cancelled && setOrders(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Sifarişlər yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1 className="hidden font-heading text-3xl font-bold text-brand-navy lg:block">Sifarişlərim</h1>

      <div className="lg:mt-8">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorNote message={error} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Hələ sifarişiniz yoxdur"
            text="Səbətə məhsul əlavə edib ödənişi tamamladıqda sifarişlər burada görünəcək."
            action={
              <Link to="/telimler" className="mt-2">
                <Button size="sm">Təlimlərə bax</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-brand-navy">
                      {order.code}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-faint">
                      {formatDateTime(order.createdAt)}
                      {order.customerName ? ` · ${order.customerName}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone={STATUS[order.status].tone}>{STATUS[order.status].label}</StatusBadge>
                    <span className="font-heading text-xl font-bold text-brand-navy">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-brand-borderLight border-t border-brand-borderLight">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-brand-ink">
                        {item.name}
                      </span>
                      <span className="font-medium text-brand-slate">
                        {formatPrice(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>

                {order.status === 'Paid' && order.totalAmount > 0 && (
                  <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-y-1 rounded-xl bg-brand-chipBg p-3 text-[12px] text-brand-slate">
                    {order.paidAt && (
                      <>
                        <dt className="text-brand-muted">Ödəniş tarixi</dt>
                        <dd>{formatDateTime(order.paidAt)}</dd>
                      </>
                    )}
                    {order.cardMask && (
                      <>
                        <dt className="text-brand-muted">Kart</dt>
                        <dd>{order.cardMask}</dd>
                      </>
                    )}
                    {order.rrn && (
                      <>
                        <dt className="text-brand-muted">RRN</dt>
                        <dd>{order.rrn}</dd>
                      </>
                    )}
                    {order.approvalCode && (
                      <>
                        <dt className="text-brand-muted">Təsdiq kodu</dt>
                        <dd>{order.approvalCode}</dd>
                      </>
                    )}
                    <dt className="text-brand-muted">Satıcı</dt>
                    <dd>
                      {SELLER_NAME} · VÖEN {SELLER_VOEN} · çıxarışda «{MERCHANT_NAME}»
                    </dd>
                  </dl>
                )}

                {order.status === 'Pending' && (
                  <p className="mt-3 text-[13px] text-brand-muted">
                    Bank təsdiqi gözlənilir. Kartdan pul çıxılıbsa, sifariş bir neçə dəqiqə ərzində
                    avtomatik təsdiqlənəcək; ödənilməyən sifariş 24 saatdan sonra ləğv olunur.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
