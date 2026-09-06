import { ApiError } from '../api';

/** Backend xətasını istifadəçiyə göstəriləcək mətnə çevirir. */
export function apiErrorMessage(error: unknown, fallback = 'Xəta baş verdi.'): string {
  if (error instanceof ApiError) return error.detail || error.message || fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
