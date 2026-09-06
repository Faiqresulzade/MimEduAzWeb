import { useEffect, useState } from 'react';
import { adminApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { StatusBadge } from '../../ui/Badge';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Spinner } from '../../ui/Spinner';
import { StatCard } from '../../ui/StatCard';
import { formatDateTime, formatNumber, formatPrice } from '../../../lib/format';
import type { Order, SalesSummary } from '../../../types';

export default function SalesTab() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminApi.sales(), adminApi.orders()])
      .then(([sales, allOrders]) => {
        if (cancelled) return;
        setSummary(sales);
        setOrders(allOrders);
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Satış məlumatı yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Satış və komissiya</h2>

      {summary && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard label="Ümumi GMV" value={formatPrice(summary.gmv)} />
            <StatCard
              label="Platforma komissiyası"
              value={formatPrice(summary.commissionTotal)}
              hint={`${Math.round(summary.commissionPercent * 100)}%`}
            />
            <StatCard label="Sifariş sayı" value={formatNumber(summary.orderCount)} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Müəlliflərə ödəniləcək"
              value={formatPrice(summary.authorPayoutTotal)}
            />
            <StatCard label="Resurs gəliri" value={formatPrice(summary.resourceRevenue)} />
            <StatCard label="Təlim gəliri" value={formatPrice(summary.trainingRevenue)} />
          </div>
        </>
      )}

      <h3 className="mt-8 font-heading text-base font-bold text-brand-navy">
        Bütün sifarişlər
      </h3>

      <div className="mt-3">
        {orders.length === 0 ? (
          <EmptyState title="Hələ sifariş yoxdur" />
        ) : (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-brand-borderLight">
                <tr className="text-[13px] font-semibold text-brand-faint">
                  <th className="px-5 py-3">Kod</th>
                  <th className="px-5 py-3">Tarix</th>
                  <th className="px-5 py-3">Müştəri</th>
                  <th className="px-5 py-3 text-right">Məbləğ</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3 font-heading font-semibold text-brand-navy">
                      {order.code}
                    </td>
                    <td className="px-5 py-3 text-brand-muted">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-brand-ink">{order.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-right font-medium text-brand-navy">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone="free">Ödənildi</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
