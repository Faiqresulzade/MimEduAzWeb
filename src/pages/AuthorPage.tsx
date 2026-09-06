import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resourcesApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { useAddToCart } from '../hooks/useAddToCart';
import { useDownload } from '../hooks/useDownload';
import { ResourceCard } from '../components/resources/ResourceCard';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { StatCard } from '../components/ui/StatCard';
import { formatNumber } from '../lib/format';
import type { AuthorProfile } from '../types';

export default function AuthorPage() {
  const { id = '' } = useParams();
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, pendingId: addingId } = useAddToCart();
  const { download, pendingId: downloadingId } = useDownload();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resourcesApi
      .byAuthor(id)
      .then((data) => !cancelled && setProfile(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Müəllif tapılmadı.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !profile) {
    return (
      <div className="shell py-14">
        <ErrorNote message={error ?? 'Müəllif tapılmadı.'} />
        <Link to="/resurslar" className="mt-4 inline-block text-sm font-semibold text-brand-blue">
          &larr; Resurs Bankı
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-14">
      <Link to="/resurslar" className="text-sm font-semibold text-brand-blue">
        &larr; Resurs Bankı
      </Link>

      <header className="card mt-6 flex flex-wrap items-center gap-5">
        <Avatar name={profile.fullName} size="lg" />
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold text-brand-navy">
            {profile.fullName}
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            {profile.subject ? `${profile.subject} müəllimi · ` : ''}MIMEDU müəllifi
          </p>
        </div>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Resurs sayı" value={formatNumber(profile.resourceCount)} />
        <StatCard label="Ümumi endirmə" value={formatNumber(profile.totalDownloads)} />
        <StatCard label="Əsas fənn" value={profile.subject ?? '—'} />
      </div>

      <h2 className="mt-10 font-heading text-xl font-bold text-brand-navy">
        Bu müəllifin resursları
      </h2>

      <div className="mt-4">
        {profile.resources.length === 0 ? (
          <EmptyState title="Bu müəllifin təsdiqlənmiş resursu yoxdur" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                busy={addingId === resource.id || downloadingId === resource.id}
                onAddToCart={() => add('Resource', resource.id)}
                onDownload={() => download(resource.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
