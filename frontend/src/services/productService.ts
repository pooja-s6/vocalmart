import api from './api';
import type { Category, Product, ProductFilters, ProductInput } from '../types';

function clean(filters: ProductFilters) {
  const params: Record<string, string> = {};
  if (filters.query) params.query = filters.query;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sort) params.sort = filters.sort;
  return params;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products', { params: clean(filters) });
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/api/products/${id}`);
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products/search', { params: { query } });
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories');
  return data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>('/api/admin/products', input);
  return data;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const { data } = await api.put<Product>(`/api/admin/products/${id}`, input);
  return data;
}

export async function updateStock(id: number, stockQuantity: number): Promise<Product> {
  const { data } = await api.patch<Product>(`/api/admin/products/${id}/stock`, { stockQuantity });
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/admin/products/${id}`);
}
