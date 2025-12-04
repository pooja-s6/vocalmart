import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CartIcon from './components/CartIcon';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const API_URL = 'http://localhost:8081/api/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const transcription = data.transcription;
        console.log('Transcribed text:', transcription);
        handleSearch(transcription);
      } else {
        console.error('Voice API error:', response.statusText);
        alert('Voice search failed. Make sure Flask API is running on port 5000.');
      }
    } catch (error) {
      console.error('Error with voice search:', error);
      alert('Could not connect to voice API. Please ensure Flask is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Electronics', 'Accessories', 'Computing', 'Mobile', 'Audio', 'Wearables'];

  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || 
            product.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            product.description.toLowerCase().includes(selectedCategory.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="App">
          <header className="App-header">
            <div className="header-content">
              <div className="header-left">
                <h1>🛒 VocalMart</h1>
                <p>AI-Powered Voice Shopping Assistant</p>
              </div>
              <div className="header-right">
                <CartIcon onClick={() => setIsCartOpen(true)} />
              </div>
            </div>
          </header>
          
          <SearchBar 
            onSearch={handleSearch} 
            onVoiceSearch={handleVoiceSearch}
          />

          <div className="filters-container">
            <div className="category-filters">
              <span className="filter-label">Categories:</span>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="sort-options">
              <span className="filter-label">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <main className="App-main">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                {searchQuery && (
                  <div className="search-info">
                    <p>Search results for: <strong>{searchQuery}</strong></p>
                    <button onClick={() => { setSearchQuery(''); fetchProducts(); }}>
                      Clear Search
                    </button>
                  </div>
                )}
                <div className="products-count">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>
                <ProductList products={filteredProducts} />
              </>
            )}
          </main>

          <footer className="App-footer">
            <p>© 2025 VocalMart - AI-Powered Voice Shopping Experience</p>
          </footer>

          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
