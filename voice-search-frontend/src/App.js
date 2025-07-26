import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';


function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8081/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setShowAllProducts(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      setShowAllProducts(true);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowAllProducts(false);
      
      // Try API search first
      const response = await fetch(
        `http://localhost:8081/api/products/findname?query=${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setFilteredProducts(data);
      } else {
        throw new Error('API search failed');
      }
      
    } catch (error) {
      console.error('Error searching products:', error);
      
      // Fallback to client-side filtering - don't show error if this works
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProducts(filtered);
      
      // Only show error if both API and client-side filtering fail
      if (filtered.length === 0 && products.length > 0) {
        setError('No products found for your search. Try different keywords.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
    setShowAllProducts(true);
    setError(null);
  };

  return (
    <div className="App">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />
      
      <main className="app-main">
        <div className="content-container">
          <div className="search-results-info">
            {searchQuery ? (
              <p>Showing results for: <strong>"{searchQuery}"</strong></p>
            ) : (
              <p>All Products</p>
            )}
            <span className="results-count">
              {filteredProducts.length} items found
            </span>
          </div>
          
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={fetchAllProducts} className="retry-button">
                Retry
              </button>
            </div>
          )}
          
          <ProductList 
            products={filteredProducts} 
            loading={loading}
            searchQuery={searchQuery}
            showAllProducts={showAllProducts}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 vocalMart. Built with Voice Search Technology.</p>
      </footer>
    </div>
  );
}

export default App;