import { useEffect, useState } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { getErrorMessage } from '../services/api';
import { getCategories } from '../services/productService';
import type { Category } from '../types';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    getCategories()
      .then(setCategories)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="section-head"><h1>Categories</h1></div>
      {loading && <Loading label="Loading categories..." />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && (
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
