import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  
  const imageUrl = product.imageId 
    ? `http://localhost:8081/api/products/${product.id}/image`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <button 
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
        <div className="product-badge">New</div>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          ⭐⭐⭐⭐⭐ <span className="rating-count">(4.5)</span>
        </div>
        <div className="product-footer">
          <span className="product-price">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </span>
          <button 
            className={`add-to-cart-button ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
