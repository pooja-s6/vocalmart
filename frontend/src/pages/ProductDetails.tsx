import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { ProductGrid } from '../components/ProductGrid';
import { ProductImage } from '../components/ProductImage';
import { VoiceSearch } from '../components/VoiceSearch';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCategories } from '../hooks/useCategories';
import { getErrorMessage } from '../services/api';
import { getProduct, getProducts } from '../services/productService';
import type { Product } from '../types';
import { formatMoney, stockLabel } from '../utils/format';
import { rememberProduct } from '../utils/recent';
import { intentToSearchParams } from '../voice/interpret';
import type { VoiceIntent } from '../voice/types';

export function ProductDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { saved, toggle } = useWishlist();
  const categories = useCategories();
  const [product, setProduct] = useState<Product | null>(null);
  const [voiceNote, setVoiceNote] = useState('');
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const id = Number(params.id);

  function load() {
    if (!Number.isInteger(id) || id <= 0) {
      setError('Product not found');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    getProduct(id)
      .then(async (item) => {
        setProduct(item);
        rememberProduct(item);
        setQuantity(1);
        const sameCategory = await getProducts({ categoryId: String(item.categoryId) });
        setRelated(sameCategory.filter((entry) => entry.id !== item.id).slice(0, 4));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function add(thenCheckout: boolean) {
    if (!product) return;
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setBusy(true);
    setError('');
    try {
      await addItem(product.id, quantity);
      if (thenCheckout) navigate('/checkout');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function onVoice(intent: VoiceIntent) {
    if (!product) return;
    if (intent.action === 'save') {
      const already = saved(product.id);
      if (!already) toggle(product);
      setVoiceNote(already ? 'Already in your saved list.' : 'Saved.');
      return;
    }
    if (intent.action === 'add-to-cart') {
      add(false);
      return;
    }
    if (intent.action === 'buy-now') {
      add(true);
      return;
    }
    if (intent.path && intent.path !== '/products') {
      navigate(intent.path);
      return;
    }
    const params = intentToSearchParams(intent, categories);
    const query = params.toString();
    navigate(query ? `/products?${query}` : '/products');
  }

  if (loading) return <div className="page"><Loading label="Loading product..." /></div>;
  if (error && !product) {
    return (
      <div className="page">
        <ErrorMessage message={error} onRetry={load} />
        <Link className="btn secondary" to="/products">Back to products</Link>
      </div>
    );
  }
  if (!product) return null;

  const out = product.stockQuantity <= 0;

  return (
    <div className="page">
      <div className="details">
        <div className="details-media">
          <ProductImage src={product.imageUrl} alt={product.name} />
        </div>
        <div className="details-info">
          <Link className="muted" to={`/products?categoryId=${product.categoryId}`}>{product.categoryName}</Link>
          <h1>{product.name}</h1>
          <p className="rating">{Number(product.rating).toFixed(1)} ★</p>
          <p className="price large">{formatMoney(product.price)}</p>
          <p>{product.description}</p>
          <p className={out ? 'stock out' : 'stock'}>{stockLabel(product.stockQuantity)}</p>
          <label className="field qty-field">
            Quantity
            <input
              type="number"
              min={1}
              max={Math.max(product.stockQuantity, 1)}
              value={quantity}
              disabled={out}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          {voiceNote && <p className="voice-note">{voiceNote}</p>}
          <div className="hero-actions">
            <button className="btn" type="button" disabled={out || busy} onClick={() => add(false)}>
              {busy ? 'Adding...' : 'Add to cart'}
            </button>
            <button className="btn secondary" type="button" disabled={out || busy} onClick={() => add(true)}>
              Buy now
            </button>
            <button className="btn secondary" type="button" onClick={() => toggle(product)}>
              {saved(product.id) ? 'Saved' : 'Save'}
            </button>
          </div>
          <VoiceSearch label="Voice" onIntent={onVoice} />
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <div className="section-head"><h2>Related products</h2></div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
