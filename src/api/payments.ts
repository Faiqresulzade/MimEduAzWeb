import { api } from './client';
import type {
  AdminPayout,
  CreatePayoutRequest,
  Earnings,
  Order,
  Payout,
  PaymentConfig,
  PlatformStats,
} from '../types';

export const paymentsApi = {
  /** Kartla ödəniş aktivdirmi (AzeriCard terminalı qoşulubmu). */
  async config() {
    const { data } = await api.get<PaymentConfig>('/payments/config');
    return data;
  },
};

export const payoutsApi = {
  /** Müəllifin qazancı — yalnız ödənilmiş satışlardan. */
  async mine() {
    const { data } = await api.get<Earnings>('/payouts/mine');
    return data;
  },

  /** Bütün mövcud balansın IBAN-a köçürülməsi tələbi. Kart nömrəsi qəbul edilmir. */
  async request(payload: CreatePayoutRequest) {
    const { data } = await api.post<Payout>('/payouts', payload);
    return data;
  },

  async adminList() {
    const { data } = await api.get<AdminPayout[]>('/admin/payouts');
    return data;
  },

  async adminProcess(id: string, approve: boolean, note?: string) {
    const { data } = await api.post<AdminPayout>(`/admin/payouts/${id}/process`, { approve, note });
    return data;
  },

  /** Kartla ödənişi geri qaytarır (AzeriCard), giriş bağlanır. */
  async adminRefund(orderId: string) {
    const { data } = await api.post<Order>(`/admin/orders/${orderId}/refund`);
    return data;
  },
};

export const statsApi = {
  /** Ana səhifə göstəriciləri — yalnız real rəqəmlər. */
  async get() {
    const { data } = await api.get<PlatformStats>('/stats');
    return data;
  },
};
