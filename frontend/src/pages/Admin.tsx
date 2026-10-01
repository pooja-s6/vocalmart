import { useEffect, useState, type FormEvent } from 'react';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { ProductImage } from '../components/ProductImage';
import { getErrorMessage } from '../services/api';
import { createProduct, deleteProduct, getCategories, getProducts, updateProduct, updateStock } from '../services/productService';
import type { Category, Product, ProductInput } from '../types';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '/images/wireless-headphones.jpg',
  stockQuantity: '10',
  categoryId: '',
  rating: '4.5',
};

export function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    Promise.all([getProducts({ sort: 'name' }), getCategories()])
      .then(([productList, categoryList]) => {
        setProducts(productList);
        setCategories(categoryList);
        setForm((current) => ({ ...current, categoryId: current.categoryId || String(categoryList[0]?.id ?? '') }));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function toInput(): ProductInput | null {
    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);
    const rating = Number(form.rating);
    const categoryId = Number(form.categoryId);
    if (!form.name.trim() || !form.description.trim() || !form.imageUrl.trim()) {
      setError('Name, description, and image are required');
      return null;
    }
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setError('Enter a valid price and stock quantity');
      return null;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5 || !categoryId) {
      setError('Choose a category and a rating between 0 and 5');
      return null;
    }
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      imageUrl: form.imageUrl.trim(),
      stockQuantity,
      categoryId,
      rating,
    };
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');
    const input = toInput();
    if (!input) return;
    setBusy(true);
    try {
      if (editingId) {
        await updateProduct(editingId, input);
        setNotice('Product updated');
      } else {
        await createProduct(input);
        setNotice('Product created');
      }
      setEditingId(null);
      setForm({ ...emptyForm, categoryId: form.categoryId });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function edit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      stockQuantity: String(product.stockQuantity),
      categoryId: String(product.categoryId),
      rating: String(product.rating),
    });
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError('');
    try {
      await deleteProduct(product.id);
      setNotice('Product deleted');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function saveStock(product: Product, stockQuantity: number) {
    setError('');
    try {
      await updateStock(product.id, stockQuantity);
      setNotice('Stock updated');
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="page">
      <div className="section-head"><h1>Admin</h1></div>
      {notice && <p className="success-banner">{notice}</p>}
      {error && <ErrorMessage message={error} />}
      <div className="admin-layout">
        <form className="auth-card" onSubmit={onSubmit}>
          <h2>{editingId ? 'Edit product' : 'Create product'}</h2>
          <label className="field">Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label className="field">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label>
          <label className="field">Price (INR)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
          <label className="field">Image URL<input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} required /></label>
          <label className="field">Stock<input type="number" min="0" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} required /></label>
          <label className="field">Category
            <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="field">Rating<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} required /></label>
          <div className="hero-actions">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}</button>
            {editingId && (
              <button className="btn secondary" type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm, categoryId: form.categoryId }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="admin-list">
          {loading && <Loading label="Loading catalog..." />}
          {products.map((product) => (
            <article className="admin-card" key={product.id}>
              <ProductImage src={product.imageUrl} alt="" />
              <div>
                <h3>{product.name}</h3>
                <p className="muted">{product.categoryName}</p>
                <label className="field inline-stock">
                  Stock
                  <input
                    type="number"
                    min="0"
                    defaultValue={product.stockQuantity}
                    onBlur={(event) => {
                      const next = Number(event.target.value);
                      if (Number.isInteger(next) && next >= 0 && next !== product.stockQuantity) {
                        saveStock(product, next);
                      }
                    }}
                  />
                </label>
                <div className="hero-actions">
                  <button className="btn secondary" type="button" onClick={() => edit(product)}>Edit</button>
                  <button className="btn danger" type="button" onClick={() => remove(product)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
