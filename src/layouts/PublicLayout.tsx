import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from './AppShell';
import { scrollToHash } from '../hooks/useSectionLink';

export function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
