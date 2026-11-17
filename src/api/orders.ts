import { api } from './client';
import type { CheckoutRequest, CheckoutResponse, Order } from '../types';

export const ordersApi = {
  /**
   * Kart məlumatı GÖNDƏRİLMİR. Pulsuz səbət dərhal tamamlanır; ödənişli səbətdə
   * `payment` formu qaytarılır və istifadəçi AzeriCard səhifəsinə yönləndirilir.
   */
  async checkout(payload: CheckoutRequest) {
    const { data } = await api.post<CheckoutResponse>('/orders/checkout', payload);
    return data;
  },

  async mine() {
    const { data } = await api.get<Order[]>('/orders/mine');
    return data;
  },

  /** Ödəniş nəticəsi səhifəsi statusu backend-dən oxuyur (frontend-in "uğurlu" deməsinə güvənilmir). */
  async get(code: string) {
    const { data } = await api.get<Order>(`/orders/${encodeURIComponent(code)}`);
    return data;
  },
};
