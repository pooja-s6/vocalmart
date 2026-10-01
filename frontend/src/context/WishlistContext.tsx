import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../types';

const KEY = 'vocalmart_wishlist';

interface WishlistContextValue {
  items: Product[];
  saved: (id: number) => boolean;
  toggle: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function read(): Product[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(read());
  }, []);

  const value = useMemo<WishlistContextValue>(() => ({
    items,
    saved: (id) => items.some((item) => item.id === id),
    toggle: (product) => {
      setItems((current) => {
        const next = current.some((item) => item.id === product.id)
          ? current.filter((item) => item.id !== product.id)
          : [product, ...current];
        localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      });
    },
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
