import { api } from './client';
import type { Order } from '../types';

export const ordersApi = {
  /** Kart məlumatı BACKEND-Ə GÖNDƏRİLMİR — yalnız müştəri adı. */
  async checkout(customerName?: string) {
    const { data } = await api.post<Order>('/orders/checkout', { customerName });
    return data;
  },

  async mine() {
    const { data } = await api.get<Order[]>('/orders/mine');
    return data;
  },
};
