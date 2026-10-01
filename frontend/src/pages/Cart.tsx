import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { useCart } from '../context/CartContext';
import { getErrorMessage } from '../services/api';
import { formatMoney } from '../utils/format';

export function CartPage() {
  const { cart, ready, clear } = useCart();
  const [error, setError] = useState('');
  const empty = !cart || cart.items.length === 0;

  if (!ready) return <div className="page"><Loading label="Loading your cart..." /></div>;

  async function onClear() {
    setError('');
    try {
      await clear();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (empty) {
    return (
      <div className="page">
        <div className="empty">
          <h1>Your cart is empty.</h1>
          <Link className="btn" to="/products">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-head">
        <h1>Cart</h1>
        <button className="btn ghost" type="button" onClick={onClear}>Clear cart</button>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <aside className="summary">
          <h2>Summary</h2>
          <div className="summary-row"><span>Subtotal</span><strong>{formatMoney(cart.subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{formatMoney(cart.shipping)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatMoney(cart.total)}</strong></div>
          <p className="muted">{cart.shippingNote}</p>
          <Link className="btn" to="/checkout">Proceed to Checkout</Link>
          <Link className="btn secondary" to="/products">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}
