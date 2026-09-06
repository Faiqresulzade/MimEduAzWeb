import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:5297';
export const API_BASE = `${API_ORIGIN}/api/v1`;

const REFRESH_TOKEN_KEY = 'mimedu.refreshToken';

/**
 * Access token yaddaşda (modul dəyişəni) saxlanılır — XSS səthini kiçildir.
 * Refresh token httpOnly cookie mümkün olmadığı üçün localStorage-dadır
 * (API_FRONTEND.md §1 tövsiyəsi).
 */
let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string | null, refresh: string | null) {
  setAccessToken(access);
  setRefreshToken(refresh);
}

export function clearTokens() {
  setTokens(null, null);
}

/** Statik fayl linkləri /api/v1 prefiksi olmadan, birbaşa origin-dən verilir. */
export function fileUrl(relativePath: string) {
  return `${API_ORIGIN}${relativePath}`;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** Validasiya xətalarının hamısını bir sətirdə birləşdirir. */
  get detail(): string {
    if (!this.errors) return this.message;
    const flat = Object.values(this.errors).flat();
    return flat.length ? flat.join(' ') : this.message;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  // FormData göndəriləndə Content-Type-ı brauzer özü (boundary ilə) qoymalıdır.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

/** Session bitəndə AuthContext-in xəbər tutması üçün callback. */
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

/** Paralel 401-lərin hamısı eyni refresh sorğusunu gözləsin. */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    // Interceptor-a düşməmək üçün təmiz axios istifadə olunur.
    const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
      refreshToken: refresh,
    });
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    clearTokens();
    return null;
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    const isRefreshCall = config?.url?.includes('/auth/refresh');

    if (status === 401 && config && !config._retried && !isRefreshCall && getRefreshToken()) {
      config._retried = true;

      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        config.headers.set('Authorization', `Bearer ${newToken}`);
        return api.request(config);
      }

      onSessionExpired?.();
    }

    if (status === 401 && !isRefreshCall && !getRefreshToken()) {
      onSessionExpired?.();
    }

    const body = error.response?.data;
    throw new ApiError(
      status ?? 0,
      body?.message ?? error.message ?? 'Xəta baş verdi',
      body?.errors,
    );
  },
);
