import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, cartApi, ordersApi } from '../api';
import type { Cart, CheckoutRequest, CheckoutResponse, ItemType } from '../types';
import { AuthContext } from './AuthContext';

export interface CartContextValue {
  cart: Cart | null;
  items: Cart['items'];
  count: number;
  total: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (itemType: ItemType, itemId: string) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  /** Pulsuz səbət dərhal tamamlanır; ödənişlidə bank formu qaytarılır, səbət ödənişdən sonra boşalır. */
  checkout: (request: CheckoutRequest) => Promise<CheckoutResponse>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      setCart(await cartApi.get());
    } catch (error) {
      // 401-dən başqa xətalarda səbəti boş göstərmək kifayətdir.
      if (!(error instanceof ApiError) || error.status !== 401) setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (itemType: ItemType, itemId: string) => {
    setCart(await cartApi.addItem(itemType, itemId));
  }, []);

  const removeItem = useCallback(async (cartItemId: string) => {
    setCart(await cartApi.removeItem(cartItemId));
  }, []);

  const checkout = useCallback(async (request: CheckoutRequest) => {
    const result = await ordersApi.checkout(request);
    // Pulsuz sifariş dərhal tamamlanır və backend səbəti boşaldır. Ödənişli sifarişdə
    // səbət bank təsdiqinə qədər qalır (istifadəçi ödənişi yarımçıq qoya bilər).
    if (!result.payment) setCart({ id: cart?.id ?? '', items: [], total: 0 });
    return result;
  }, [cart?.id]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart?.items ?? [],
      count: cart?.items.length ?? 0,
      total: cart?.total ?? 0,
      loading,
      refresh,
      addItem,
      removeItem,
      checkout,
    }),
    [cart, loading, refresh, addItem, removeItem, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
