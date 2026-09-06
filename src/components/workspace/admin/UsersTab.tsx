import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../api';
import { apiErrorMessage } from '../../../hooks/useApiError';
import { Avatar } from '../../ui/Avatar';
import { StatusBadge } from '../../ui/Badge';
import { EmptyState } from '../../ui/EmptyState';
import { ErrorNote } from '../../ui/ErrorNote';
import { Spinner } from '../../ui/Spinner';
import { formatNumber } from '../../../lib/format';
import type { AdminUser } from '../../../types';

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .users()
      .then((data) => !cancelled && setUsers(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'İstifadəçilər yüklənmədi.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-brand-navy">İstifadəçilər</h2>
      <p className="mt-1.5 text-sm text-brand-muted">
        Platformada qeydiyyatdan keçmiş {users.length} istifadəçi.
      </p>

      <div className="mt-5">
        {users.length === 0 ? (
          <EmptyState title="İstifadəçi tapılmadı" />
        ) : (
          <ul className="card !p-0">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-wrap items-center gap-4 border-b border-brand-borderLight px-5 py-4 last:border-b-0"
              >
                <Avatar name={user.fullName} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-semibold text-brand-navy">
                    <Link to={`/muellif/${user.id}`} className="hover:text-brand-blue">
                      {user.fullName}
                    </Link>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-brand-muted">{user.email}</p>
                  <p className="mt-0.5 text-xs text-brand-faint">
                    {user.subject ?? 'Fənn qeyd edilməyib'} ·{' '}
                    {formatNumber(user.resourceCount)} resurs ·{' '}
                    {formatNumber(user.totalDownloads)} endirmə ·{' '}
                    {formatNumber(user.certificateCount)} sertifikat
                  </p>
                </div>

                <StatusBadge tone={user.roles.includes('Admin') ? 'info' : 'neutral'}>
                  {user.roles.includes('Admin') ? 'Administrator' : 'Müəllif'}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
