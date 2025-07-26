/* ✅ Add this to your App.css or ProductList.css */

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-items: center;
}

.product-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.product-card h2 {
  font-size: 1rem;
  margin: 8px 0;
}

.product-card p {
  margin: 4px 0;
  color: #555;
}

/* Optional: wrap long text */
.product-card {
  word-wrap: break-word;
}