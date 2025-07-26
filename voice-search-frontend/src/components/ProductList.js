import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, searchQuery }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        {searchQuery ? (
          <div className="no-results">
            <div className="empty-icon">🔍</div>
            <h3>No products found for "{searchQuery}"</h3>
            <p>Try different keywords or use voice search</p>
            <div className="suggestions">
              <h4>Try searching for:</h4>
              <ul>
                <li>Phone, laptop, headphones</li>
                <li>Shorter keywords</li>
                <li>Use the microphone for voice search</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="no-products">
            <div className="empty-icon">📦</div>
            <h3>No products available</h3>
            <p>Add products using the API to get started</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;