export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  rating: number;
  createdAt: string;
}

export interface ProductFilters {
  query?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: number;
  rating: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  lineTotal: number;
  stockQuantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  shippingNote: string;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  status: string;
  shippingName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
}

export interface CheckoutInput {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
}
