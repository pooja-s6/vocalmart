import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function ProductTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products/table`)
      .then(r => r.json())
      .then(j => {
        if (j && j.success) setRows(j.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-card"><p>Loading table...</p></div>;

  return (
    <section className="panel">
      <h2>Products Table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{ width: 120 }}>
                  {r.image ? <img src={r.image} alt={r.title} style={{ height: 60 }} /> : <span>No image</span>}
                </td>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>₹{Number(r.price).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
