import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getErrorMessage } from '../services/api';
import { placeOrder } from '../services/orderService';
import { formatMoney } from '../utils/format';

export function Checkout() {
  const { user } = useAuth();
  const { cart, ready, refresh } = useCart();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="page">
        <div className="empty">
          <h1>Order placed successfully!</h1>
          <p>Taking you to your orders.</p>
        </div>
      </div>
    );
  }

  if (!ready) return <div className="page"><Loading label="Loading checkout..." /></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page">
        <div className="empty">
          <h1>Your cart is empty.</h1>
          <Link className="btn" to="/products">Start Shopping</Link>
        </div>
      </div>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!fullName.trim() || !addressLine.trim() || !city.trim()) {
      setError('Fill in your name, address, and city');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Enter a 10-digit phone number');
      return;
    }
    if (!/^[0-9]{6}$/.test(postalCode)) {
      setError('Enter a 6-digit postal code');
      return;
    }
    setBusy(true);
    try {
      await placeOrder({ fullName: fullName.trim(), phone, addressLine: addressLine.trim(), city: city.trim(), postalCode });
      setPlaced(true);
      await refresh();
      window.setTimeout(() => navigate('/orders', { state: { placed: true } }), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="auth-card checkout-form" onSubmit={onSubmit}>
          <h2>Shipping address</h2>
          {error && <p className="form-error">{error}</p>}
          <label className="field">Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>
          <label className="field">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="numeric" placeholder="10-digit mobile" required /></label>
          <label className="field">Address<textarea value={addressLine} onChange={(event) => setAddressLine(event.target.value)} required /></label>
          <label className="field">City<input value={city} onChange={(event) => setCity(event.target.value)} required /></label>
          <label className="field">Postal code<input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} inputMode="numeric" required /></label>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Placing order...' : 'Place Order'}</button>
        </form>
        <aside className="summary">
          <h2>Order summary</h2>
          {cart.items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.productName} × {item.quantity}</span>
              <strong>{formatMoney(item.lineTotal)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><strong>{formatMoney(cart.subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{formatMoney(cart.shipping)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatMoney(cart.total)}</strong></div>
          <p className="muted">{cart.shippingNote}</p>
        </aside>
      </div>
    </div>
  );
}
