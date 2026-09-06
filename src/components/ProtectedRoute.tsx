import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Spinner } from './ui/Spinner';

interface ProtectedRouteProps {
  /**
   * `Admin` — yalnız Admin rolu.
   * `Teacher` — hər autentifikasiya olunmuş istifadəçi (admin daxil, çünki admin
   * panelində «Müəllim panelinə keç» keçidi var və müəllim endpoint-ləri —
   * `/resources/mine`, `/trainings/mine`, `/certificates/mine` — hər rol üçün işləyir).
   * Boşdursa sadəcə login tələb olunur.
   */
  role?: 'Admin' | 'Teacher';
  /** Yönləndirmə zamanı göstəriləcək toast mətni. */
  message?: string;
}

export function ProtectedRoute({
  role,
  message = 'Bunun üçün hesaba daxil olun.',
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading, panelPath } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const notified = useRef(false);

  const allowed = isAuthenticated && (role !== 'Admin' || isAdmin);

  useEffect(() => {
    if (!loading && !isAuthenticated && !notified.current) {
      notified.current = true;
      toast(message);
    }
  }, [loading, isAuthenticated, message, toast]);

  if (loading) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/giris" state={{ from: location.pathname }} replace />;
  }

  // Rol uyğun deyilsə istifadəçini öz panelinə göndər.
  if (!allowed) return <Navigate to={panelPath} replace />;

  return <Outlet />;
}

/** Yalnız qonaqlar üçün (/giris) — login olan istifadəçini panelinə göndərir. */
export function GuestRoute() {
  const { isAuthenticated, loading, panelPath } = useAuth();

  if (loading) return <Spinner />;
  if (isAuthenticated) return <Navigate to={panelPath} replace />;
  return <Outlet />;
}
