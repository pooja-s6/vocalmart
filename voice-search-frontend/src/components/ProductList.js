import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">📦</div>
        <h2>No Products Found</h2>
        <p>Try searching for something else or check back later!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
