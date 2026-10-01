import React from 'react';
import { useCart } from '../context/CartContext';
import './CartIcon.css';

function CartIcon({ onClick }) {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <button className="cart-icon-btn" onClick={onClick}>
      <span className="cart-icon">🛒</span>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
}

export default CartIcon;
