import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { orders } from '../data/store';
import { body } from 'express-validator';
import validateRequest from '../utils/validateRequest';

const router = Router();

router.use(requireAuth);

// Create payment order (stub)
router.post('/create-order', [body('orderId').isString().notEmpty(), body('method').optional().isString()], validateRequest, (req: AuthRequest, res) => {
  const { orderId, method } = req.body as { orderId?: string; method?: string };
  // In a real implementation, call Stripe/Razorpay to create payment intent/order.
  const clientOrderId = `pay_${Math.random().toString(36).slice(2,9)}`;
  return res.json({ success: true, data: { clientOrderId, provider: method || 'stripe', clientSecret: 'test_secret_placeholder' } });
});

// Verify payment (stub)
router.post('/verify', [body('orderId').isString().notEmpty(), body('signature').optional().isString()], validateRequest, (req: AuthRequest, res) => {
  const { orderId, signature } = req.body as { orderId: string; signature?: string };
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  // mark paid for the stub
  (order as any).paymentStatus = 'paid';
  (order as any).orderStatus = 'processing';
  return res.json({ success: true, data: order });
});

export default router;
