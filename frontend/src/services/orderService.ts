import api from './api';
import type { CheckoutInput, Order } from '../types';

export async function placeOrder(input: CheckoutInput): Promise<Order> {
  const { data } = await api.post<Order>('/api/orders', input);
  return data;
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/api/orders');
  return data;
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`);
  return data;
}
