import { Link } from 'react-router-dom';
import type { Resource } from '../../types';
import { formatNumber, resourceTypeLabel } from '../../lib/format';
import { PriceBadge, StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ResourceCardProps {
  resource: Resource;
  /** İstifadəçi bu resursun imtahanını keçibsə fərqli badge göstərilir. */
  quizPassed?: boolean;
  showQuizState?: boolean;
  busy?: boolean;
  onAddToCart: () => void;
  onDownload: () => void;
}

export function ResourceCard({
  resource,
  quizPassed = false,
  showQuizState = false,
  busy = false,
  onAddToCart,
  onDownload,
}: ResourceCardProps) {
  return (
    <article className="card card-hover relative flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="neutral">{resourceTypeLabel(resource.type)}</StatusBadge>
        <PriceBadge isPaid={resource.isPaid} price={resource.price} />
        {resource.isPurchased && <StatusBadge tone="free">Alınıb</StatusBadge>}
        {resource.hasQuiz && (
          <StatusBadge tone={showQuizState && quizPassed ? 'free' : 'info'}>
            {showQuizState && quizPassed ? 'İmtahan keçilib' : 'İmtahan var'}
          </StatusBadge>
        )}
      </div>

      <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-brand-navy lg:mt-4">
        <Link to={`/resurslar/${resource.id}`} className="hover:text-brand-blue after:absolute after:inset-0 after:rounded-2xl">
          {resource.name}
        </Link>
      </h3>

      <p className="mt-2 text-[13px] text-brand-muted lg:text-sm">
        {resource.subject} · {resource.grade}-ci sinif
      </p>

      <Link
        to={`/muellif/${resource.authorId}`}
        className="relative z-10 mt-1 flex min-h-[44px] items-center gap-2.5 self-start text-[13px] text-brand-slate hover:text-brand-blue lg:mt-4 lg:min-h-0 lg:text-sm"
      >
        <Avatar name={resource.authorName} size="sm" />
        <span className="truncate font-medium">{resource.authorName}</span>
      </Link>

      <p className="mt-1 flex-1 text-xs font-medium text-brand-faint lg:mt-3 lg:font-normal">
        {formatNumber(resource.downloads)} {resource.isLinkBased ? 'baxış' : 'endirmə'}
      </p>

      <div className="relative z-10 mt-3 border-t border-brand-borderLight pt-3 lg:mt-5 lg:pt-4">
        {/* canAccess: pulsuzdur, alınıb və ya sizinkidir — "Səbətə at" yalnız tərsində. */}
        {resource.canAccess ? (
          <Button size="sm" variant="secondary" fullWidth disabled={busy} onClick={onDownload}>
            {resource.type === 'Video'
              ? resource.isPaid
                ? 'İzlə'
                : 'Pulsuz izlə'
              : resource.isLinkBased
                ? resource.isPaid
                  ? 'Materialı aç'
                  : 'Pulsuz aç'
                : resource.isPaid
                  ? 'Endir'
                  : 'Pulsuz endir'}
          </Button>
        ) : (
          <Button size="sm" fullWidth disabled={busy} onClick={onAddToCart}>
            Səbətə əlavə et
          </Button>
        )}
      </div>
    </article>
  );
}
