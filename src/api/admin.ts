import { api } from './client';
import type {
  AdminUser,
  Order,
  Resource,
  ResourceDetail,
  SalesSummary,
} from '../types';

export const adminApi = {
  async pendingResources() {
    const { data } = await api.get<Resource[]>('/admin/resources/pending');
    return data;
  },

  async approveResource(id: string) {
    const { data } = await api.post<ResourceDetail>(`/admin/resources/${id}/approve`);
    return data;
  },

  async rejectResource(id: string, reason?: string) {
    const { data } = await api.post<ResourceDetail>(`/admin/resources/${id}/reject`, {
      reason,
    });
    return data;
  },

  async users() {
    const { data } = await api.get<AdminUser[]>('/admin/users');
    return data;
  },

  async sales() {
    const { data } = await api.get<SalesSummary>('/admin/sales');
    return data;
  },

  async orders() {
    const { data } = await api.get<Order[]>('/admin/orders');
    return data;
  },
};
