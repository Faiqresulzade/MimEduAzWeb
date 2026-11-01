import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileAppBar } from '../components/layout/MobileAppBar';
import { BottomTabBar } from '../components/layout/BottomTabBar';
import { resolveRouteMeta } from '../lib/routeMeta';

/**
 * Masaüstündə (`lg+`) sayt header-i və footer-i; kiçik ekranlarda mobil tətbiqin
 * görünüşü — app bar, tab köklərində isə alt tab bar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { meta } = resolveRouteMeta(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="hidden lg:contents">
        <Header />
      </div>
      <MobileAppBar />

      <main
        className={`flex-1 ${
          meta.tab ? 'pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0' : ''
        }`}
      >
        {children}
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>
      {meta.tab && <BottomTabBar active={meta.tab} />}
    </div>
  );
}
