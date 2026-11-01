import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { formatNumber } from '../../lib/format';
import type { PlatformStats } from '../../types';

export function Hero({ stats }: { stats: PlatformStats | null }) {
  return (
    <section className="lg:border-b lg:border-brand-borderLight lg:bg-brand-surface">
      <div className="shell grid gap-4 pb-4 pt-4 lg:gap-10 lg:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-center">
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-[.08em] text-brand-blue lg:text-[13px]">
            Müəllimlər üçün platforma
          </p>
          <h1 className="mt-3 font-heading text-[28px] font-bold leading-[34px] text-brand-navy lg:mt-4 lg:text-[44px] lg:leading-tight">
            Öyrən, materialını hazırla,
            <br className="hidden lg:block" /> paylaş və qazan.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[22px] text-brand-ink lg:mt-5 lg:text-base lg:leading-relaxed">
            MIMEDU.AZ müəllimlərin təlim keçdiyi, öz dərs materiallarını yüklədiyi və
            digər müəllimlərin hazırladığı resursları tapdığı yerdir. Hər təlimin sonunda
            koda görə yoxlanılan sertifikat verilir.
          </p>

          <div className="mt-3 flex flex-wrap gap-3 lg:mt-7">
            <Link to="/telimler">
              <Button>Təlimlərə bax</Button>
            </Link>
            <Link to="/resurslar">
              <Button variant="secondary">Resurs Bankı</Button>
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 lg:gap-4">
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Hazır resurs</dt>
            <dd className="mt-1.5 font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
              {stats ? formatNumber(stats.resourceCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Qeydiyyatlı müəllim</dt>
            <dd className="mt-1.5 font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
              {stats ? formatNumber(stats.teacherCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Aktiv təlim</dt>
            <dd className="mt-1.5 font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
              {stats ? formatNumber(stats.trainingCount) : '—'}
            </dd>
          </div>
          <div className="card p-5">
            <dt className="text-[13px] font-medium text-brand-muted">Müəllifə gedən pay</dt>
            <dd className="mt-1.5 font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
              80%
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
