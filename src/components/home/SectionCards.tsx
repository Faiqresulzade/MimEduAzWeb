import { Link } from 'react-router-dom';
import { homeSections } from '../../data/static';

export function SectionCards() {
  return (
    <section className="shell py-14 sm:py-16">
      <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
        Platforma dörd addımdan ibarətdir
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-brand-muted">
        Hər bölmə müstəqil işləyir — istədiyiniz addımdan başlaya bilərsiniz.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeSections.map((section) => (
          <Link
            key={section.number}
            to={section.to}
            className="card card-hover flex flex-col p-5"
          >
            <span className="font-heading text-2xl font-bold text-brand-blue">
              {section.number}
            </span>
            <h3 className="mt-3 font-heading text-lg font-semibold text-brand-navy">
              {section.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
              {section.text}
            </p>
            <span className="mt-4 font-heading text-sm font-semibold text-brand-blue">
              Bax →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
