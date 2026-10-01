import React, { useState } from 'react';

function CheckoutModal({ total, onClose, onPlaceOrder }) {
  const [form, setForm] = useState({ name: '', address: '', payment: 'card' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onPlaceOrder(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card checkout-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <h2>Checkout</h2>
        <p className="muted">Demo checkout form for the project flow.</p>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Address
            <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          </label>
          <label>
            Payment Method
            <select value={form.payment} onChange={(event) => setForm({ ...form, payment: event.target.value })}>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on delivery</option>
            </select>
          </label>
          <div className="checkout-total">
            <span>Payable amount</span>
            <strong>₹{total.toFixed(0)}</strong>
          </div>
          <button type="submit" className="primary-button">Place Order</button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;
