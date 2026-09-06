import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { formatNumber } from '../../lib/format';
import type { PlatformStats } from '../../types';

export function Hero({ stats }: { stats: PlatformStats | null }) {
  return (
    <section className="border-b border-brand-borderLight bg-brand-surface">
      <div className="shell grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-center">
        <div>
          <p className="font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-blue">
            Müəllimlər üçün platforma
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl lg:text-[44px]">
            Öyrən, materialını hazırla,
            <br className="hidden sm:block" /> paylaş və qazan.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-ink">
            MIMEDU.AZ müəllimlərin təlim keçdiyi, öz dərs materiallarını yüklədiyi və
            digər müəllimlərin hazırladığı resursları tapdığı yerdir. Hər təlimin sonunda
            koda görə yoxlanılan sertifikat verilir.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/telimler">
              <Button>Təlimlərə bax</Button>
            </Link>
            <Link to="/resurslar">
              <Button variant="secondary">Resurs Bankı</Button>
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Hazır resurs</dt>
            <dd className="mt-1.5 font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              {stats ? formatNumber(stats.resourceCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Qeydiyyatlı müəllim</dt>
            <dd className="mt-1.5 font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              {stats ? formatNumber(stats.teacherCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Aktiv təlim</dt>
            <dd className="mt-1.5 font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              {stats ? formatNumber(stats.trainingCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Müəllifə gedən pay</dt>
            <dd className="mt-1.5 font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              80%
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
