import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getErrorMessage } from '../services/api';
import type { Product } from '../types';
import { formatMoney, stockLabel } from '../utils/format';
import { ProductImage } from './ProductImage';

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { saved, toggle } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const out = product.stockQuantity <= 0;

  async function onAdd() {
    setError('');
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    setBusy(true);
    try {
      await addItem(product.id, 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="product-card">
      <div className="card-media-wrap">
        <Link to={`/products/${product.id}`} className="card-media">
          <ProductImage src={product.imageUrl} alt={product.name} />
        </Link>
        <button
          className={saved(product.id) ? 'wish saved' : 'wish'}
          type="button"
          aria-pressed={saved(product.id)}
          aria-label={saved(product.id) ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          onClick={() => toggle(product)}
        >
          {saved(product.id) ? 'Saved' : 'Save'}
        </button>
      </div>
      <div className="card-body">
        <p className="muted">{product.categoryName}</p>
        <h3>{product.name}</h3>
        <p className="rating">{Number(product.rating).toFixed(1)} ★</p>
        <p className="price">{formatMoney(product.price)}</p>
        <p className={out ? 'stock out' : product.stockQuantity < 10 ? 'stock low' : 'stock'}>{stockLabel(product.stockQuantity)}</p>
        {error && <p className="form-error">{error}</p>}
        <div className="card-actions">
          <Link className="btn secondary" to={`/products/${product.id}`}>View details</Link>
          <button className="btn" type="button" onClick={onAdd} disabled={out || busy}>
            {busy ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
