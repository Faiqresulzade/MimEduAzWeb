import { Link } from 'react-router-dom';
import type { TabKey } from '../../lib/routeMeta';
import { Icon, type IconName } from '../ui/Icon';

const tabs: { key: TabKey; to: string; label: string; icon: [IconName, IconName] }[] = [
  { key: 'home', to: '/', label: 'Ana səhifə', icon: ['home', 'home-outline'] },
  { key: 'trainings', to: '/telimler', label: 'Təlimlər', icon: ['school', 'school-outline'] },
  { key: 'resources', to: '/resurslar', label: 'Resurslar', icon: ['bookshelf', 'bookshelf'] },
  {
    key: 'exams',
    to: '/sinaqlar',
    label: 'Sınaqlar',
    icon: ['clipboard-text', 'clipboard-text-outline'],
  },
  {
    key: 'profile',
    to: '/profil',
    label: 'Profil',
    icon: ['account-circle', 'account-circle-outline'],
  },
];

/** Mobil tətbiqin alt tab bar-ı — yalnız tab köklərində və `lg`-dən kiçik ekranda. */
export function BottomTabBar({ active }: { active: TabKey }) {
  return (
    <nav
      aria-label="Əsas bölmələr"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-brand-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex h-16">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key} className="flex-1">
              <Link
                to={tab.to}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 transition ${
                  isActive ? 'text-brand-blue' : 'text-brand-muted'
                }`}
              >
                <Icon name={isActive ? tab.icon[0] : tab.icon[1]} size={24} />
                <span className="font-heading text-[11px] font-semibold leading-none">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
