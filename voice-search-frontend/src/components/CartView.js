import React from 'react';
import { useCart } from '../context/CartContext';

function CartView({ onCheckout }) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <section className="panel empty-panel">
        <h2>Your cart is empty</h2>
        <p>Add products from the catalog to build a simple shopping flow.</p>
      </section>
    );
  }

  return (
    <section className="panel cart-panel">
      <div className="panel-heading">
        <h2>Shopping Cart</h2>
        <button type="button" className="ghost-button" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <article key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-item-main">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <div className="cart-item-controls">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-side">
              <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>
              <button type="button" className="remove-link" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <div>
          <span>Total</span>
          <strong>₹{getCartTotal().toFixed(0)}</strong>
        </div>
        <button type="button" className="primary-button" onClick={onCheckout}>Proceed to Checkout</button>
      </div>
    </section>
  );
}

export default CartView;
