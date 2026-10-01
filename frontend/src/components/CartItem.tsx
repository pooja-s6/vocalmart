import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getErrorMessage } from '../services/api';
import type { CartItem as CartLine } from '../types';
import { formatMoney } from '../utils/format';
import { ProductImage } from './ProductImage';

export function CartItem({ item }: { item: CartLine }) {
  const { updateItem, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function change(quantity: number) {
    setError('');
    setBusy(true);
    try {
      await updateItem(item.id, quantity);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setError('');
    setBusy(true);
    try {
      await removeItem(item.id);
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <article className="cart-row">
      <Link to={`/products/${item.productId}`} className="cart-thumb">
        <ProductImage src={item.imageUrl} alt={item.productName} />
      </Link>
      <div className="cart-copy">
        <h3><Link to={`/products/${item.productId}`}>{item.productName}</Link></h3>
        <p>{formatMoney(item.price)}</p>
        {error && <p className="form-error">{error}</p>}
      </div>
      <div className="qty">
        <button type="button" onClick={() => change(item.quantity - 1)} disabled={busy || item.quantity <= 1} aria-label="Decrease quantity">−</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => change(item.quantity + 1)} disabled={busy || item.quantity >= item.stockQuantity} aria-label="Increase quantity">+</button>
      </div>
      <strong>{formatMoney(item.lineTotal)}</strong>
      <button className="btn ghost" type="button" onClick={remove} disabled={busy}>Remove</button>
    </article>
  );
}
