import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { getErrorMessage } from '../services/api';
import { getOrders } from '../services/orderService';
import type { Order } from '../types';
import { formatDate, formatMoney } from '../utils/format';

export function Orders() {
  const location = useLocation();
  const placed = Boolean((location.state as { placed?: boolean } | null)?.placed);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    getOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="section-head"><h1>Orders</h1></div>
      {placed && <p className="success-banner">Order placed successfully!</p>}
      {loading && <Loading label="Loading orders..." />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && orders.length === 0 && (
        <div className="empty">
          <h2>You have not placed an order yet.</h2>
          <Link className="btn" to="/products">Start Shopping</Link>
        </div>
      )}
      <div className="order-list">
        {orders.map((order) => (
          <Link className="order-card" key={order.id} to={`/orders/${order.id}`}>
            <div>
              <h2>Order #{order.id}</h2>
              <p>{formatDate(order.orderDate)}</p>
              <p className="muted">{order.items.length} item{order.items.length === 1 ? '' : 's'}</p>
            </div>
            <div className="order-meta">
              <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
              <strong>{formatMoney(order.totalAmount)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
