import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function AdminProductForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFiles = e => setFiles(Array.from(e.target.files || []));

  const submit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('price', price);
      for (const f of files) fd.append('images', f);

      // replace with real admin token if available
      const token = localStorage.getItem('admin_token') || '';

      const res = await fetch(`${API_BASE}/api/products`, { method: 'POST', body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const jd = await res.json();
      if (res.ok) {
        setMsg('Created product ' + (jd.data?.id || '')); setTitle(''); setPrice(''); setFiles([]);
      } else {
        setMsg(jd.message || 'Error');
      }
    } catch (e) {
      setMsg('Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="panel admin-product-form">
      <h3>Admin: Create Product</h3>
      <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} required /></label>
      <label>Price<input type="number" value={price} onChange={e=>setPrice(e.target.value)} required /></label>
      <label>Images<input type="file" multiple accept="image/*" onChange={handleFiles} /></label>
      <div style={{ marginTop: 8 }}>
        <button disabled={loading} type="submit">{loading? 'Uploading...':'Create'}</button>
      </div>
      {msg && <p>{msg}</p>}
    </form>
  );
}
