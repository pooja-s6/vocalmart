import { v4 as uuid } from 'uuid';

type User = { id: string; name: string; email: string; password: string; role?: string };
type Product = { id: string; title: string; description?: string; price: number; category?: string; stock: number; images?: string[] };

import bcrypt from 'bcrypt';

export const users: User[] = [];

// seed an admin user for testing
const adminPassword = bcrypt.hashSync('adminpass', 10);
users.push({ id: 'admin-1', name: 'Admin', email: 'admin@local.com', password: adminPassword, role: 'admin' });

export const products: Product[] = (() => {
  const seed: Product[] = [
    { id: uuid(), title: 'Wireless Headphones', description: 'Bluetooth headphones with deep bass', price: 2999, category: 'Electronics', stock: 10 },
    { id: uuid(), title: 'Smart Watch', description: 'Track fitness and notifications', price: 4999, category: 'Electronics', stock: 7 },
    { id: uuid(), title: 'USB-C Laptop Stand', description: 'Adjustable laptop stand', price: 1299, category: 'Electronics', stock: 15 },
    { id: uuid(), title: 'Portable Bluetooth Speaker', description: 'Compact speaker with loud sound', price: 2199, category: 'Electronics', stock: 12 },
    { id: uuid(), title: 'Basmati Rice 5kg', description: 'Premium basmati rice', price: 2499, category: 'Grocery', stock: 20 },
    { id: uuid(), title: 'Cotton T-Shirt', description: 'Comfortable cotton tee', price: 499, category: 'Clothing', stock: 30 },
    { id: uuid(), title: 'Non-stick Frying Pan', description: 'Durable kitchen pan', price: 899, category: 'Kitchen', stock: 14 },
  ];
  return seed;
})();

export const carts: Record<string, { productId: string; quantity: number }[]> = {};

export type Order = { id: string; userId: string; items: { productId: string; quantity: number; price: number }[]; total: number; paymentStatus: string; orderStatus: string; createdAt: string };
export const orders: Order[] = [];
