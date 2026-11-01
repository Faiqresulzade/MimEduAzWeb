import { testimonials } from '../../data/static';
import { Avatar } from '../ui/Avatar';

export function Testimonials() {
  return (
    <section className="lg:border-y lg:border-brand-borderLight lg:bg-brand-surface">
      <div className="shell py-4 lg:py-16">
        <h2 className="font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">
          Müəllimlər nə deyir
        </h2>

        <div className="mt-3 grid gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-4">
          {testimonials.map((item) => (
            <figure key={item.name} className="card flex flex-col p-5">
              <blockquote className="flex-1 text-[15px] leading-[22px] text-brand-ink lg:text-sm lg:leading-relaxed">
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
