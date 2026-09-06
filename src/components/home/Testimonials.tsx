import { testimonials } from '../../data/static';
import { Avatar } from '../ui/Avatar';

export function Testimonials() {
  return (
    <section className="border-y border-brand-borderLight bg-brand-surface">
      <div className="shell py-14 sm:py-16">
        <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
          Müəllimlər nə deyir
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="card flex flex-col p-5">
              <blockquote className="flex-1 text-sm leading-relaxed text-brand-ink">
                “{item.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-borderLight pt-4">
                <Avatar name={item.name} size="sm" />
                <span>
                  <span className="block font-heading text-sm font-semibold text-brand-navy">
                    {item.name}
                  </span>
                  <span className="block text-xs text-brand-faint">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
