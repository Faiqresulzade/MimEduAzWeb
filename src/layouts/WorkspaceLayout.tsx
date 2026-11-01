import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { TabBar, type WorkspaceTab } from '../components/workspace/TabBar';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface WorkspaceLayoutProps {
  title: string;
  roleLabel: string;
  tabs: WorkspaceTab[];
  /** Admin panelindəki "Müəllim panelinə keç" kimi əlavə keçid. */
  crossLink?: { to: string; label: string };
}

export function WorkspaceLayout({
  title,
  roleLabel,
  tabs,
  crossLink,
}: WorkspaceLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    toast('Çıxış edildi.');
    navigate('/');
  }

  return (
    <AppShell>
      <div className="page lg:py-10">
        {/* Mobildə profil kartı və yan menyu yoxdur — tətbiqdəki kimi Profil tabı və panel menyusu. */}
        <div className="card mb-6 hidden flex-wrap items-center gap-4 p-5 lg:flex">
          <Avatar name={user?.fullName} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-[13px] font-bold uppercase tracking-[.08em] text-brand-faint">
              {title}
            </p>
            <h1 className="truncate font-heading text-xl font-bold text-brand-navy">
              {user?.fullName ?? '—'}
            </h1>
            <p className="truncate text-sm text-brand-muted">{user?.email}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-brand-blue">{roleLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {crossLink && (
              <Link to={crossLink.to}>
                <Button variant="secondary" size="sm">
                  {crossLink.label}
                </Button>
              </Link>
            )}
            <Link to="/sifarisler">
              <Button variant="secondary" size="sm">
                Sifarişlərim
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Çıxış
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="hidden lg:contents">
            <TabBar tabs={tabs} />
          </div>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
