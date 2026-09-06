import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  authApi,
  clearTokens,
  getRefreshToken,
  setSessionExpiredHandler,
  setTokens,
} from '../api';
import type { LoginRequest, RegisterRequest, User } from '../types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  /** Rola görə panel ünvanı: Admin → /admin, digərləri → /panel */
  panelPath: string;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<User>;
  register: (payload: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Səhifə yenilənəndə refresh token ilə sessiyanı bərpa et.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // İlk sorğu 401 alacaq (access token yoxdur) və interceptor refresh edəcək.
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearTokens();
      setUser(null);
    });
    return () => setSessionExpiredHandler(null);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const auth = await authApi.login(payload);
    setTokens(auth.accessToken, auth.refreshToken);
    setUser(auth.user);
    return auth.user;
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const auth = await authApi.register(payload);
    setTokens(auth.accessToken, auth.refreshToken);
    setUser(auth.user);
    return auth.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Server tərəfdə ləğv alınmasa da lokal sessiyanı bağlayırıq.
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAdmin = user?.roles?.includes('Admin') ?? false;
    return {
      user,
      isAuthenticated: Boolean(user),
      isAdmin,
      isTeacher: user?.roles?.includes('Teacher') ?? false,
      panelPath: isAdmin ? '/admin' : '/panel',
      loading,
      login,
      register,
      logout,
    };
  }, [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
