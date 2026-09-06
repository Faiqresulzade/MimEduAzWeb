import { NavLink } from 'react-router-dom';

export interface WorkspaceTab {
  to: string;
  label: string;
}

export function TabBar({ tabs }: { tabs: WorkspaceTab[] }) {
  return (
    <nav aria-label="Panel bölmələri" className="lg:sticky lg:top-24">
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {tabs.map((tab) => (
          <li key={tab.to} className="shrink-0 lg:shrink">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `block whitespace-nowrap rounded-pill border px-4 py-[9px] font-heading text-sm font-semibold transition lg:whitespace-normal ${
                  isActive
                    ? 'border-brand-blue bg-brand-blue text-white'
                    : 'border-brand-border bg-white text-brand-slate hover:border-[#c9d8ef] hover:bg-brand-hoverBg'
                }`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
