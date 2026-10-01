import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { carts, products, orders } from '../data/store';
import { v4 as uuid } from 'uuid';

const router = Router();

router.use(requireAuth);

// Create order from cart
router.post('/', (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const userCart = carts[userId] || [];
  if (!userCart.length) return res.status(400).json({ success: false, message: 'Cart is empty' });

  const items = userCart.map(i => {
    const p = products.find(x => x.id === i.productId)!;
    return { productId: i.productId, quantity: i.quantity, price: p.price };
  });
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const order = { id: uuid(), userId, items, total, paymentStatus: 'pending', orderStatus: 'created', createdAt: new Date().toISOString() };
  orders.push(order as any);
  // clear cart
  carts[userId] = [];
  return res.status(201).json({ success: true, data: order });
});

// Get user orders
router.get('/', (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const mine = orders.filter(o => o.userId === userId);
  return res.json({ success: true, data: mine });
});

router.get('/:id', (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const o = orders.find(x => x.id === req.params.id && x.userId === userId);
  if (!o) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, data: o });
});

export default router;
