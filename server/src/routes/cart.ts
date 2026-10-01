import { Router } from 'express';
import { carts, products } from '../data/store';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { body } from 'express-validator';
import validateRequest from '../utils/validateRequest';

const router = Router();

// Public (no-auth) cart endpoints for simple client usage
// POST /api/cart/public/add { clientId, productId, quantity }
router.post('/public/add', [body('clientId').isString().notEmpty(), body('productId').isString().notEmpty(), body('quantity').optional().isInt({ min: 1 })], validateRequest, (req, res) => {
  const { clientId, productId, quantity } = req.body as { clientId: string; productId: string; quantity?: number };
  const qty = Math.max(1, quantity || 1);
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const userCart = carts[clientId] || [];
  const existing = userCart.find(i => i.productId === productId);
  if (existing) existing.quantity += qty; else userCart.push({ productId, quantity: qty });
  carts[clientId] = userCart;
  const detailed = userCart.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
  return res.json({ success: true, data: detailed });
});

// POST /api/cart/public/set { clientId, productId, quantity }
router.post('/public/set', [body('clientId').isString().notEmpty(), body('productId').isString().notEmpty(), body('quantity').isInt({ min: 0 })], validateRequest, (req, res) => {
  const { clientId, productId, quantity } = req.body as { clientId: string; productId: string; quantity: number };
  const userCart = carts[clientId] || [];
  if (quantity <= 0) {
    const filtered = userCart.filter(i => i.productId !== productId);
    carts[clientId] = filtered;
    const detailed = filtered.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
    return res.json({ success: true, data: detailed });
  }
  const existing = userCart.find(i => i.productId === productId);
  if (existing) existing.quantity = quantity; else userCart.push({ productId, quantity });
  carts[clientId] = userCart;
  const detailed = userCart.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
  return res.json({ success: true, data: detailed });
});

// GET /api/cart/public/:clientId
router.get('/public/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const userCart = carts[clientId] || [];
  const detailed = userCart.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
  return res.json({ success: true, data: detailed });
});

// DELETE /api/cart/public/:clientId/:productId
router.delete('/public/:clientId/:productId', (req, res) => {
  const clientId = req.params.clientId;
  const productId = req.params.productId;
  const userCart = carts[clientId] || [];
  const filtered = userCart.filter(i => i.productId !== productId);
  carts[clientId] = filtered;
  const detailed = filtered.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
  return res.json({ success: true, data: detailed });
});

// Authenticated routes (existing)
router.use(requireAuth);

router.post('/add',
  requireAuth,
  [body('productId').isString().notEmpty(), body('quantity').optional().isInt({ min: 1 })],
  validateRequest,
  (req: AuthRequest, res) => {
    const userId = req.user?.sub;
    const { productId, quantity } = req.body as { productId: string; quantity?: number };
    const qty = Math.max(1, quantity || 1);
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const userCart = carts[userId] || [];
    const existing = userCart.find(i => i.productId === productId);
    if (existing) existing.quantity += qty; else userCart.push({ productId, quantity: qty });
    carts[userId] = userCart;
    return res.json({ success: true, data: userCart });
  }
);

router.get('/', (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const userCart = carts[userId] || [];
  const detailed = userCart.map(item => ({ ...item, product: products.find(p => p.id === item.productId) }));
  return res.json({ success: true, data: detailed });
});

router.delete('/:productId', (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const pid = req.params.productId;
  const userCart = carts[userId] || [];
  const filtered = userCart.filter(i => i.productId !== pid);
  carts[userId] = filtered;
  return res.json({ success: true, data: filtered });
});

export default router;
