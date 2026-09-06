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
import type { Order } from '../types';

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
    <div className="shell py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-bold text-brand-navy">Sifarişlərim</h1>

      <div className="mt-8">
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
                    <StatusBadge tone="free">Ödənildi</StatusBadge>
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
