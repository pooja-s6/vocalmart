import type { Product } from '../types';

const KEY = 'vocalmart_recent';

export function readRecent(): Product[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberProduct(product: Product) {
  const next = [product, ...readRecent().filter((item) => item.id !== product.id)].slice(0, 6);
  localStorage.setItem(KEY, JSON.stringify(next));
}
