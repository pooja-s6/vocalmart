import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as cartService from '../services/cartService';
import type { Cart } from '../types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  cart: Cart | null;
  ready: boolean;
  itemCount: number;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    const data = await cartService.getCart();
    setCart(data);
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    refresh()
      .catch(() => {
        if (!cancelled) setCart(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const value = useMemo<CartContextValue>(() => ({
    cart,
    ready,
    itemCount: cart?.itemCount ?? 0,
    refresh,
    async addItem(productId, quantity) {
      setCart(await cartService.addItem(productId, quantity));
    },
    async updateItem(itemId, quantity) {
      setCart(await cartService.updateItem(itemId, quantity));
    },
    async removeItem(itemId) {
      setCart(await cartService.removeItem(itemId));
    },
    async clear() {
      setCart(await cartService.clearCart());
    },
  }), [cart, ready, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
