import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './api';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartView from './components/CartView';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import LoginPanel from './components/LoginPanel';
import ToastStack from './components/ToastStack';
import ProductTable from './components/ProductTable';
import { describeVoiceSearch, interpretVoiceTranscript } from './voiceQuery';

const CATEGORIES = ['All', 'Electronics', 'Grocery', 'Clothing', 'Kitchen'];

function AppShell() {
  const { addToCart, getCartTotal, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(null);
  const [voiceNote, setVoiceNote] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/api/products');
        setProducts(response.data || []);
      } catch (fetchError) {
        setError('Unable to load products right now. Start the backend and refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const pushToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const productMatches = (product, query, category, priceCap) => {
    const normalizedQuery = query.trim().toLowerCase();
    const compactQuery = normalizedQuery.replace(/[^a-z0-9]/g, '');
    const matchesQuery = !normalizedQuery || [product.name, product.description, product.category]
      .filter(Boolean)
      .some((field) => {
        const text = field.toLowerCase();
        return text.includes(normalizedQuery) || text.replace(/[^a-z0-9]/g, '').includes(compactQuery);
      });
    const matchesCategory = category === 'All' || product.category === category;
    const matchesPrice = priceCap == null || Number(product.price) <= priceCap;
    return matchesQuery && matchesCategory && matchesPrice;
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setMaxPrice(null);
    setVoiceNote('');
    if (value) {
      setActivePage('products');
    }
  };

  const handleVoiceResult = (value) => {
    const interpreted = interpretVoiceTranscript(value);
    const note = describeVoiceSearch(interpreted);
    const category = interpreted.category || 'All';
    const matches = products.filter((product) => productMatches(product, interpreted.query, category, interpreted.maxPrice));
    setSearchQuery(interpreted.query);
    setActiveCategory(category);
    setMaxPrice(interpreted.maxPrice);
    setVoiceNote(note);
    setActivePage('products');
    pushToast(note, 'info');
    return matches.length;
  };

  const filteredProducts = products.filter((product) => productMatches(product, searchQuery, activeCategory, maxPrice));

  const featuredProducts = filteredProducts.slice(0, 4);

  const handleAddToCart = (product) => {
    addToCart(product);
    pushToast(`${product.name} added to cart`);
  };

  const handlePlaceOrder = (orderData) => {
    clearCart();
    setCheckoutOpen(false);
    setActivePage('home');
    pushToast(`Order placed for ${orderData.name}`, 'success');
  };

  const handleLogin = (email) => {
    setLoginMessage(`Signed in locally as ${email || 'demo user'}.`);
    pushToast('Demo login completed', 'success');
  };

  const renderPage = () => {
    if (activePage === 'cart') {
      return <CartView onCheckout={() => setCheckoutOpen(true)} />;
    }

    if (activePage === 'login') {
      return <LoginPanel onComplete={handleLogin} />;
    }

    if (activePage === 'products') {
      return (
        <section className="page-stack">
          <div className="page-header">
            <div>
              <h2>Products</h2>
              <p>{voiceNote || 'Search by text or voice, then filter by category.'}</p>
            </div>
            <div className="category-chips">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'chip active' : 'chip'}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loader-card">
              <div className="spinner" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="panel error-panel">
              <h3>Unable to load products</h3>
              <p>{error}</p>
              <button type="button" className="primary-button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="panel empty-panel">
              <h3>No products found</h3>
              <p>Nothing matched that search. Try a product name, a category, or a phrase such as products under 2000.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpen={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>
      );
    }

    if (activePage === 'table') {
      return <ProductTable />;
    }

    return (
      <>
        <section className="hero panel">
          <div className="hero-copy">
            <span className="eyebrow">Student Project Demo</span>
            <h2>Shop Smarter. Shop Faster. Shop by Voice.</h2>
            <p>
              VocalMart is a simple voice-enabled shopping app built with React, Spring Boot, and MongoDB.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => setActivePage('products')}>
                Browse Products
              </button>
              <button type="button" className="ghost-button" onClick={() => setActivePage('cart')}>
                View Cart
              </button>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-stat">
              <strong>20</strong>
              <span>seeded products</span>
            </div>
            <div className="hero-stat">
              <strong>4</strong>
              <span>categories</span>
            </div>
            <div className="hero-stat">
              <strong>Voice</strong>
              <span>search enabled</span>
            </div>
          </div>
        </section>

        <section className="page-stack">
          <div className="page-header compact">
            <div>
              <h2>Featured Products</h2>
              <p>Four quick picks from the catalog.</p>
            </div>
          </div>
          <div className="product-grid featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpen={setSelectedProduct}
              />
            ))}
          </div>
        </section>

        <section className="page-stack">
          <div className="page-header compact">
            <div>
              <h2>Categories</h2>
              <p>Keep the project simple with four core shopping categories.</p>
            </div>
          </div>
          <div className="category-grid">
            {CATEGORIES.slice(1).map((category) => (
              <button
                key={category}
                type="button"
                className="category-card"
                onClick={() => {
                  setActiveCategory(category);
                  setActivePage('products');
                }}
              >
                <strong>{category}</strong>
                <span>Explore {category.toLowerCase()} products</span>
              </button>
            ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="App">
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onVoiceResult={handleVoiceResult}
      />

      <main className="app-main">
        <div className="content-shell">
          {renderPage()}
          {loginMessage && activePage !== 'login' && <p className="inline-note">{loginMessage}</p>}
        </div>
      </main>

      <footer className="app-footer">
        <p>VocalMart • Built for a final-year student portfolio</p>
      </footer>

      <ToastStack toasts={toasts} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          total={getCartTotal()}
          onClose={() => setCheckoutOpen(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}
