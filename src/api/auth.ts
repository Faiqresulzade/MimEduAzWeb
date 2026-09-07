import { api } from './client';
import type {
  AuthResponse,
  BecomeAuthorRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types';

export const authApi = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterRequest) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async me() {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async logout(refreshToken: string) {
    await api.post('/auth/logout', { refreshToken });
  },

  /**
   * Şagird hesabını müəllif hesabına yüksəldir.
   * DİQQƏT: yeni rol mövcud access token-də olmur — çağırışdan sonra mütləq
   * `refresh()` edilməlidir, əks halda `POST /resources` hələ də 403 verir.
   */
  async becomeAuthor(payload: BecomeAuthorRequest = {}) {
    const { data } = await api.post<User>('/auth/become-author', payload);
    return data;
  },

  async refresh(refreshToken: string) {
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },
};
