import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

export interface MenuItem {
  key: string;
  label: string;
  icon: IconName;
  hint?: string;
  to: string;
}

/** Mobil tətbiqin profil tipli siyahısı: başlıq + ikonlu sətirlər qrupu. */
export function MenuList({ title, items }: { title?: string; items: MenuItem[] }) {
  return (
    <section className="space-y-2">
      {title && (
        <h2 className="px-1 font-heading text-xs font-medium uppercase tracking-[.07em] text-brand-muted">
          {title}
        </h2>
      )}
      <ul className="divide-y divide-brand-border overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              to={item.to}
              className="flex min-h-[56px] items-center gap-3 px-4 py-3 transition hover:bg-brand-hoverBg active:bg-brand-hoverBg"
            >
              <Icon name={item.icon} size={22} className="text-brand-blue" />
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-[15px] font-medium text-brand-navy">
                  {item.label}
                </span>
                {item.hint && (
                  <span className="mt-0.5 block text-xs font-medium text-brand-muted">
                    {item.hint}
                  </span>
                )}
              </span>
              <Icon name="chevron-right" size={22} className="text-brand-faint" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
