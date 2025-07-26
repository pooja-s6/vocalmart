import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleAddToCart = () => {
    setIsInCart(!isInCart);
    console.log(`${isInCart ? 'Removed from' : 'Added to'} cart:`, product.name);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist:`, product.name);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return 'No description available';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.imageBase64 && product.imageType && !imageError ? (
          <img
            src={`data:${product.imageType};base64,${product.imageBase64}`}
            alt={product.name}
            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="image-placeholder">
            <span className="placeholder-icon">📦</span>
            <span>No Image</span>
          </div>
        )}
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{truncateText(product.description)}</p>
        
        <div className="product-price">
          <span className="price">{formatPrice(product.price)}</span>
          <span className="price-label">each</span>
        </div>
        
        <div className="product-rating">
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span className="rating-count">(4.5)</span>
        </div>
        
        <button 
          className={`add-to-cart-btn ${isInCart ? 'added' : ''}`}
          onClick={handleAddToCart}
        >
          {isInCart ? (
            <>
              <span>✓</span>
              Added to Cart
            </>
          ) : (
            <>
              <span>🛒</span>
              Add to Cart
            </>
          )}
        </button>
        
        <div className="product-extras">
          <div className="shipping-info">
            <span>🚚</span>
            <span>Free shipping</span>
          </div>
          <div className="stock-info">
            <span>✅</span>
            <span>In stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;