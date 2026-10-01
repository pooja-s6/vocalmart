import api from './api';
import type { Cart } from '../types';

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>('/api/cart');
  return data;
}

export async function addItem(productId: number, quantity: number): Promise<Cart> {
  const { data } = await api.post<Cart>('/api/cart/items', { productId, quantity });
  return data;
}

export async function updateItem(itemId: number, quantity: number): Promise<Cart> {
  const { data } = await api.put<Cart>(`/api/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeItem(itemId: number): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/api/cart/items/${itemId}`);
  return data;
}

export async function clearCart(): Promise<Cart> {
  const { data } = await api.delete<Cart>('/api/cart');
  return data;
}
