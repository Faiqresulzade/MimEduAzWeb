import { Link } from 'react-router-dom';
import type { Training } from '../../types';
import { formatPrice } from '../../lib/format';
import { FormatBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TrainingCardProps {
  training: Training;
  onAddToCart: () => void;
  adding?: boolean;
}

export function TrainingCard({ training, onAddToCart, adding }: TrainingCardProps) {
  const soldOut = training.seatsLeft !== null && training.seatsLeft <= 0;

  return (
    <article className="card card-hover relative flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <FormatBadge format={training.format} />
        <span className="text-xs font-medium text-brand-faint">{training.metaLabel}</span>
      </div>

      <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-brand-navy lg:mt-4">
        {/* Bütün kart kliklənir (mobil tətbiqdəki kimi) — düymələr z-10 ilə üstdə qalır. */}
        <Link to={`/telimler/${training.id}`} className="hover:text-brand-blue after:absolute after:inset-0 after:rounded-2xl">
          {training.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[18px] text-brand-muted lg:line-clamp-none lg:text-sm lg:leading-relaxed">
        {training.description}
      </p>

      <p className="mt-2 text-[13px] text-brand-slate lg:mt-4 lg:text-sm">
        {training.seatLimit === null ? (
          <span>Yer sayı limitsiz</span>
        ) : (
          <span>
            {training.seatsLeft} boş yer / {training.seatLimit} yer
          </span>
        )}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-brand-borderLight pt-3 lg:mt-5 lg:pt-4">
        <span className="font-heading text-lg font-semibold text-brand-navy lg:text-xl lg:font-bold">
          {formatPrice(training.price)}
        </span>
        <div className="relative z-10 flex gap-2">
          <Link to={`/telimler/${training.id}`} className="hidden lg:block">
            <Button variant="secondary" size="sm">
              Ətraflı
            </Button>
          </Link>
          <Button size="sm" onClick={onAddToCart} disabled={adding || soldOut}>
            {soldOut ? 'Yer yoxdur' : 'Səbətə əlavə et'}
          </Button>
        </div>
      </div>
    </article>
  );
}
