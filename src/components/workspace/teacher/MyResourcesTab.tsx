import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resourcesApi } from '../../../api';
import { resourceEarning } from '../../../api/pending';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { PriceBadge, StatusBadge } from '../../ui/Badge';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Spinner } from '../../ui/Spinner';
import { StatCard } from '../../ui/StatCard';
import { formatNumber, formatPrice, resourceTypeLabel } from '../../../lib/format';
import type { Resource } from '../../../types';

export default function MyResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resourcesApi
      .mine()
      .then((data) => !cancelled && setResources(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Resurslar yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  const pending = resources.filter((item) => item.status === 'Pending');
  const rejected = resources.filter((item) => item.status === 'Rejected');
  const approved = resources.filter((item) => item.status === 'Approved');
  const totalDownloads = resources.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">Resurslarım</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Resurs sayı" value={formatNumber(resources.length)} />
        <StatCard label="Moderasiyada" value={formatNumber(pending.length)} />
        <StatCard label="Ümumi endirmə" value={formatNumber(totalDownloads)} />
      </div>

      {pending.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-base font-bold text-brand-navy">
            Moderasiyada olanlar
          </h3>
          <ul className="card mt-3 !p-0">
            {pending.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {item.subject} · {item.grade}-ci sinif · {resourceTypeLabel(item.type)}
                  </p>
                </div>
                <StatusBadge tone="info">Moderasiyada</StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rejected.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-base font-bold text-brand-navy">Rədd edilənlər</h3>
          <ul className="card mt-3 !p-0">
            {rejected.map((item) => (
              <li
                key={item.id}
                className="border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="min-w-0 flex-1 font-heading text-[15px] font-semibold text-brand-navy">
                    {item.name}
                  </p>
                  <StatusBadge tone="danger">Rədd edilib</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-brand-muted">
                  {item.subject} · {item.grade}-ci sinif
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-heading text-base font-bold text-brand-navy">
          Təsdiqlənmiş resurslarım
        </h3>

        {approved.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="Hələ təsdiqlənmiş resursunuz yoxdur"
              text="«Yüklə» bölməsindən ilk materialınızı göndərin."
            />
          </div>
        ) : (
          <ul className="card mt-3 !p-0">
            {approved.map((item) => {
              const earning = resourceEarning(item);
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-[15px] font-semibold text-brand-navy">
                      <Link to={`/resurslar/${item.id}`} className="hover:text-brand-blue">
                        {item.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-sm text-brand-muted">
                      {item.subject} · {formatNumber(item.downloads)} endirmə
                    </p>
                  </div>
                  <PriceBadge isPaid={item.isPaid} price={item.price} />
                  <span className="min-w-[90px] text-right font-heading text-sm font-bold text-brand-navy">
                    {earning === null ? '—' : formatPrice(earning)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
