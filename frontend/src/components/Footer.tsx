import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>VocalMart</strong>
          <p>A simple store for everyday shopping.</p>
        </div>
        <div className="footer-links">
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/wishlist">Saved</Link>
          <Link to="/login">Login</Link>
        </div>
        <p className="muted">© {new Date().getFullYear()} VocalMart</p>
      </div>
    </footer>
  );
}
