import React from 'react';

function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card product-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <img src={product.imageUrl} alt={product.name} className="modal-image" />
        <div className="modal-content">
          <span className="category-pill">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className="modal-row">
            <strong>₹{Number(product.price || 0).toFixed(0)}</strong>
            <span>Stock {product.stock}</span>
          </div>
          <button type="button" className="primary-button" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
