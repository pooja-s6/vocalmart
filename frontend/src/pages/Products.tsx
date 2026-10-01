import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { VoiceExamples } from '../components/VoiceExamples';
import { VoiceSearch } from '../components/VoiceSearch';
import { useCategories } from '../hooks/useCategories';
import { getErrorMessage } from '../services/api';
import { getProducts } from '../services/productService';
import type { Product } from '../types';
import { intentToSearchParams } from '../voice/interpret';
import type { VoiceIntent } from '../voice/types';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const inStock = searchParams.get('inStock') === '1';
  const [draftQuery, setDraftQuery] = useState(query);
  const [voiceNote, setVoiceNote] = useState('');
  const categories = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  useEffect(() => {
    const note = (location.state as { voiceNote?: string } | null)?.voiceNote;
    if (note) setVoiceNote(note);
  }, [location.state]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draftQuery !== query) {
        const next = new URLSearchParams(searchParams);
        if (draftQuery) next.set('query', draftQuery);
        else next.delete('query');
        setSearchParams(next, { replace: true });
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draftQuery, query, searchParams, setSearchParams]);

  const onVoice = useCallback((intent: VoiceIntent) => {
    if (intent.action) {
      setVoiceNote('Open a product, then say “add to cart” or “save this”.');
      return;
    }
    if (intent.path && intent.path !== '/products') {
      navigate(intent.path);
      return;
    }
    const freshSearch = intent.clear || intent.query !== undefined || intent.category !== undefined;
    const next = intentToSearchParams(intent, categories, freshSearch ? undefined : searchParams);
    setDraftQuery(next.get('query') ?? '');
    setVoiceNote(intent.summary);
    setSearchParams(next);
  }, [categories, navigate, searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getProducts({ query, categoryId, minPrice, maxPrice, sort })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, categoryId, minPrice, maxPrice, sort]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const visible = inStock ? products.filter((product) => product.stockQuantity > 0) : products;

  return (
    <div className="page">
      <div className="section-head">
        <h1>Products</h1>
      </div>
      <div className="filters">
        <SearchBar
          value={draftQuery}
          onChange={setDraftQuery}
          voice={<VoiceSearch onIntent={onVoice} />}
        />
        <VoiceExamples onIntent={onVoice} />
        {voiceNote && <p className="voice-note" aria-live="polite">{voiceNote}</p>}
        <div className="filter-grid">
          <label className="field">
            Category
            <select value={categoryId} onChange={(event) => update('categoryId', event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Min price
            <input type="number" min="0" value={minPrice} onChange={(event) => update('minPrice', event.target.value)} placeholder="0" />
          </label>
          <label className="field">
            Max price
            <input type="number" min="0" value={maxPrice} onChange={(event) => update('maxPrice', event.target.value)} placeholder="5000" />
          </label>
          <label className="check-field">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => update('inStock', event.target.checked ? '1' : '')}
            />
            In stock only
          </label>
          <label className="field">
            Sort
            <select value={sort} onChange={(event) => update('sort', event.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>
      {loading && <Loading label="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={() => setSearchParams(new URLSearchParams(searchParams))} />}
      {!loading && !error && <ProductGrid products={visible} />}
    </div>
  );
}
