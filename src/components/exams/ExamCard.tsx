import { Link } from 'react-router-dom';
import type { Exam } from '../../types';
import { formatNumber, formatPrice } from '../../lib/format';
import { PriceBadge, StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ExamCardProps {
  exam: Exam;
  busy?: boolean;
  onAddToCart: () => void;
}

export function ExamCard({ exam, busy = false, onAddToCart }: ExamCardProps) {
  return (
    <article className="card card-hover relative flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="info">{exam.durationMinutes} dəq</StatusBadge>
        <PriceBadge isPaid={exam.isPaid} price={exam.price} />
        {exam.isPurchased && <StatusBadge tone="free">Alınıb</StatusBadge>}
      </div>

      <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-brand-navy lg:mt-4">
        <Link to={`/sinaqlar/${exam.id}`} className="hover:text-brand-blue after:absolute after:inset-0 after:rounded-2xl">
          {exam.name}
        </Link>
      </h3>

      <p className="mt-2 text-[13px] text-brand-muted lg:text-sm">
        {exam.subject}
        {exam.grade !== null && ` · ${exam.grade}-ci sinif`}
      </p>

      <Link
        to={`/muellif/${exam.authorId}`}
        className="relative z-10 mt-1 flex min-h-[44px] items-center gap-2.5 self-start text-[13px] text-brand-slate hover:text-brand-blue lg:mt-4 lg:min-h-0 lg:text-sm"
      >
        <Avatar name={exam.authorName} size="sm" />
        <span className="truncate font-medium">{exam.authorName}</span>
      </Link>

      <p className="mt-1 flex-1 text-xs font-medium text-brand-faint lg:mt-3 lg:font-normal">
        {exam.questionCount} sual · keçid balı {exam.passPercent}% ·{' '}
        {formatNumber(exam.attemptCount)} cəhd
      </p>

      <div className="relative z-10 mt-3 border-t border-brand-borderLight pt-3 lg:mt-5 lg:pt-4">
        {exam.canAccess ? (
          <Link to={`/sinaqlar/${exam.id}`}>
            <Button size="sm" fullWidth>
              Sınağa başla
            </Button>
          </Link>
        ) : (
          <Button size="sm" fullWidth disabled={busy} onClick={onAddToCart}>
            Səbətə əlavə et · {formatPrice(exam.price)}
          </Button>
        )}
      </div>
    </article>
  );
}
