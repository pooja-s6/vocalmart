import { Link } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { useWishlist } from '../context/WishlistContext';

export function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="page">
      <div className="section-head">
        <h1>Saved</h1>
        <Link to="/products">Keep shopping</Link>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Nothing saved yet.</h2>
          <p>Tap the heart on a product, or say “save this” on a product page.</p>
          <Link className="btn" to="/products">Browse products</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
