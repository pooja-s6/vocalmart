import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { ProductGrid } from '../components/ProductGrid';
import { VoiceExamples } from '../components/VoiceExamples';
import { VoiceSearch } from '../components/VoiceSearch';
import { useCategories } from '../hooks/useCategories';
import { getErrorMessage } from '../services/api';
import { getProducts } from '../services/productService';
import type { Product } from '../types';
import { readRecent } from '../utils/recent';
import { intentToSearchParams } from '../voice/interpret';
import type { VoiceIntent } from '../voice/types';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const categories = useCategories();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    getProducts({ sort: 'rating' })
      .then((productList) => {
        setProducts(productList.slice(0, 8));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    setRecent(readRecent());
  }, []);

  const onVoice = useCallback((intent: VoiceIntent) => {
    if (intent.path && intent.path !== '/products') {
      navigate(intent.path);
      return;
    }
    const params = intentToSearchParams(intent, categories);
    const query = params.toString();
    navigate(query ? `/products?${query}` : '/products', { state: { voiceNote: intent.summary } });
  }, [categories, navigate]);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Everyday shopping</p>
          <h1>Shop Smarter with VocalMart</h1>
          <p>Search with your voice, save products for later, and check out when the cart is ready.</p>
          <VoiceSearch label="Search by voice" onIntent={onVoice} />
          <VoiceExamples onIntent={onVoice} />
          <div className="hero-actions">
            <Link className="btn" to="/products">Shop Products</Link>
            <Link className="btn secondary" to="/categories">Explore Categories</Link>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Why shop here</h2>
          <ul className="feature-list">
            <li>Say a product, a category, or a price, such as “grocery under 300”.</li>
            <li>Save items with the heart, and come back to them from Saved.</li>
            <li>Free shipping on orders of ₹999 and above.</li>
          </ul>
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Recently viewed</h2>
          </div>
          <ProductGrid products={recent} />
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>Featured products</h2>
          <Link to="/products">View all</Link>
        </div>
        {loading && <Loading label="Loading products..." />}
        {error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && <ProductGrid products={products} />}
      </section>

      <section>
        <div className="section-head">
          <h2>Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
}
