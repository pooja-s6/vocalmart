import { Link } from 'react-router-dom';
import type { Category } from '../types';

const icons: Record<string, string> = {
  Electronics: '🎧',
  Fashion: '👕',
  Grocery: '🌾',
  'Home & Kitchen': '🏠',
};

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link className="category-card" to={`/products?categoryId=${category.id}`}>
      <span className="category-icon" aria-hidden="true">{icons[category.name] ?? '🛍️'}</span>
      <div>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        <span>{category.productCount} products</span>
      </div>
    </Link>
  );
}
