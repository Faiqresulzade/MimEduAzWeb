import { api } from './client';
import type { Cart, ItemType } from '../types';

export const cartApi = {
  async get() {
    const { data } = await api.get<Cart>('/cart');
    return data;
  },

  async addItem(itemType: ItemType, itemId: string) {
    const { data } = await api.post<Cart>('/cart/items', { itemType, itemId });
    return data;
  },

  async removeItem(cartItemId: string) {
    const { data } = await api.delete<Cart>(`/cart/items/${cartItemId}`);
    return data;
  },
};
