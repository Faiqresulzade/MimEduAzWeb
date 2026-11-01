import { Link } from 'react-router-dom';
import { homeSections } from '../../data/static';
import { Icon } from '../ui/Icon';

export function SectionCards() {
  return (
    <section className="shell py-4 lg:py-16">
      <h2 className="font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
        Platforma dörd addımdan ibarətdir
      </h2>
      <p className="mt-3 max-w-2xl text-[13px] text-brand-muted lg:mt-2 lg:text-sm">
        Hər bölmə müstəqil işləyir — istədiyiniz addımdan başlaya bilərsiniz.
      </p>

      {/* Mobildə tətbiqdəki kimi sətir kartları, masaüstündə dörd sütun. */}
      <div className="mt-3 grid gap-3 lg:mt-8 lg:grid-cols-4 lg:gap-4">
        {homeSections.map((section) => (
          <Link
            key={section.number}
            to={section.to}
            className="card card-hover flex items-center gap-4 p-5 lg:flex-col lg:items-stretch lg:gap-0"
          >
            <span className="font-heading text-2xl font-bold text-brand-blue">
              {section.number}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-heading text-lg font-semibold text-brand-navy lg:mt-3">
                {section.title}
              </span>
              <span className="text-[13px] leading-[18px] text-brand-muted lg:mt-2 lg:flex-1 lg:text-sm lg:leading-relaxed">
                {section.text}
              </span>
            </span>
            <span className="mt-4 hidden font-heading text-sm font-semibold text-brand-blue lg:block">
              Bax →
            </span>
            <Icon name="chevron-right" size={22} className="text-brand-faint lg:hidden" />
          </Link>
        ))}
      </div>
    </section>
  );
}
