import { api } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

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
};
