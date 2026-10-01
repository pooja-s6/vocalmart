import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { VoiceSearch } from './VoiceSearch';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCategories } from '../hooks/useCategories';
import { intentToSearchParams } from '../voice/interpret';
import type { VoiceIntent } from '../voice/types';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items } = useWishlist();
  const categories = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const onVoice = useCallback((intent: VoiceIntent) => {
    if (intent.action) {
      navigate('/products');
      return;
    }
    if (intent.path && intent.path !== '/products') {
      navigate(intent.path);
      return;
    }
    const params = intentToSearchParams(intent, categories);
    const query = params.toString();
    navigate(query ? `/products?${query}` : '/products', { state: { voiceNote: intent.summary } });
  }, [categories, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">V</span>
          VocalMart
        </Link>
        <button className="menu-toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          Menu
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}
          <div className="nav-actions">
            <VoiceSearch label="Voice" onIntent={onVoice} />
            <NavLink to="/wishlist" className="cart-link">
              Saved
              <span className="badge">{items.length}</span>
            </NavLink>
            <NavLink to="/cart" className="cart-link">
              Cart
              <span className="badge">{itemCount}</span>
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <button className="btn secondary" type="button" onClick={logout}>Logout</button>
              </>
            ) : (
              <NavLink className="btn" to="/login">Login</NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
