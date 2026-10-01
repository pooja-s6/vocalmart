import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { ProductImage } from '../components/ProductImage';
import { getErrorMessage } from '../services/api';
import { getOrder } from '../services/orderService';
import type { Order } from '../types';
import { formatDate, formatMoney } from '../utils/format';

export function OrderDetails() {
  const params = useParams();
  const id = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    if (!Number.isInteger(id) || id <= 0) {
      setError('Order not found');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="page"><Loading label="Loading order..." /></div>;
  if (error || !order) {
    return (
      <div className="page">
        <ErrorMessage message={error || 'Order not found'} onRetry={load} />
        <Link className="btn secondary" to="/orders">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link className="muted" to="/orders">Back to orders</Link>
      <div className="section-head">
        <h1>Order #{order.id}</h1>
        <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>
      <p>{formatDate(order.orderDate)}</p>
      <div className="cart-layout">
        <div className="cart-items">
          {order.items.map((item) => (
            <article className="cart-row" key={item.id}>
              <div className="cart-thumb">
                <ProductImage src={item.imageUrl} alt={item.productName} />
              </div>
              <div className="cart-copy">
                <h3>{item.productName}</h3>
                <p>{formatMoney(item.price)} × {item.quantity}</p>
              </div>
              <strong>{formatMoney(item.lineTotal)}</strong>
            </article>
          ))}
        </div>
        <aside className="summary">
          <h2>Delivery</h2>
          <p>{order.shippingName}</p>
          <p>{order.addressLine}</p>
          <p>{order.city} {order.postalCode}</p>
          <p>{order.phone}</p>
          <div className="summary-row"><span>Subtotal</span><strong>{formatMoney(order.subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{formatMoney(order.shippingAmount)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatMoney(order.totalAmount)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
