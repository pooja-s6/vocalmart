import { Router } from 'express';
import { products } from '../data/store';
import { requireAuth } from '../middleware/auth';
import { body } from 'express-validator';
import validateRequest from '../utils/validateRequest';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// GET /api/products?page=1&limit=10&category=&search=&sort=price_asc&price_min=&price_max=
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string || '1'));
  const limit = Math.max(1, parseInt(req.query.limit as string || '20'));
  const category = (req.query.category as string || '').toLowerCase();
  const search = (req.query.search as string || '').toLowerCase();
  const sort = (req.query.sort as string || '').toLowerCase();
  const priceMin = parseFloat(req.query.price_min as string || '0');
  const priceMax = parseFloat(req.query.price_max as string || '0');

  let results = products.slice();
  if (category) results = results.filter(p => (p.category || '').toLowerCase() === category);
  if (search) results = results.filter(p => (p.title + ' ' + (p.description||'')).toLowerCase().includes(search));
  if (!isNaN(priceMin) && priceMin > 0) results = results.filter(p => p.price >= priceMin);
  if (!isNaN(priceMax) && priceMax > 0) results = results.filter(p => p.price <= priceMax);

  if (sort) {
    if (sort === 'price_asc') results.sort((a,b) => a.price - b.price);
    else if (sort === 'price_desc') results.sort((a,b) => b.price - a.price);
    else if (sort === 'title_asc') results.sort((a,b) => a.title.localeCompare(b.title));
    else if (sort === 'title_desc') results.sort((a,b) => b.title.localeCompare(a.title));
  }

  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);
  res.json({ success: true, data: paged, meta: { total: results.length, page, limit } });
});

router.get('/:id', (req, res) => {
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, data: p });
});

// POST /api/products  (admin)
router.post('/',
  requireAuth,
  upload.array('images', 6),
  [
    body('title').isString().trim().notEmpty(),
    body('price').isNumeric(),
    body('stock').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin required' });

    const { title, description, price, category, stock, variants } = req.body;
    // handle files from multipart
    const normalizedImages: string[] = [];
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length) {
      for (const f of files) {
        const mime = f.mimetype || 'image/jpeg';
        const b64 = f.buffer.toString('base64');
        normalizedImages.push(`data:${mime};base64,${b64}`);
      }
    }

    // also accept images in JSON body (data URLs or base64 or {type,data})
    let bodyImages: any = req.body.images;
    if (typeof bodyImages === 'string') {
      try { bodyImages = JSON.parse(bodyImages); } catch (e) { /* ignore */ }
    }
    if (Array.isArray(bodyImages)) {
      for (const img of bodyImages) {
        if (!img) continue;
        if (typeof img === 'string') {
          if (img.startsWith('data:')) normalizedImages.push(img);
          else normalizedImages.push(`data:image/jpeg;base64,${img}`);
        } else if (typeof img === 'object' && img.data) {
          const t = img.type || 'image/jpeg';
          normalizedImages.push(`data:${t};base64,${img.data}`);
        }
      }
    }

    const id = `prod-${Math.random().toString(36).slice(2,9)}`;
    const prod: any = { id, title, description, price: Number(price), category, stock: Number(stock) || 0, images: normalizedImages, variants: variants || [] };
    products.push(prod);
    return res.status(201).json({ success: true, data: prod });
  }
);

// GET /api/products/table -> lightweight product rows for table display
router.get('/table', (req, res) => {
  const rows = products.map(p => ({ id: p.id, title: p.title, price: p.price, category: p.category, image: (p.images && p.images[0]) || null }));
  return res.json({ success: true, data: rows });
});

export default router;
