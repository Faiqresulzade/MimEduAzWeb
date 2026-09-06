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
    <article className="card card-hover flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <FormatBadge format={training.format} />
        <span className="text-xs font-medium text-brand-faint">{training.metaLabel}</span>
      </div>

      <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-brand-navy">
        {training.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
        {training.description}
      </p>

      <p className="mt-4 text-sm text-brand-slate">
        {training.seatLimit === null ? (
          <span>Yer sayı limitsiz</span>
        ) : (
          <span>
            {training.seatsLeft} boş yer / {training.seatLimit} yer
          </span>
        )}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-borderLight pt-4">
        <span className="font-heading text-xl font-bold text-brand-navy">
          {formatPrice(training.price)}
        </span>
        <div className="flex gap-2">
          <Link to={`/telimler/${training.id}`}>
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
