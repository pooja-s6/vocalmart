import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import VoiceSearch from './VoiceSearch';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'table', label: 'Table' },
  { id: 'cart', label: 'Cart' },
  { id: 'login', label: 'Login' },
];

function Navbar({ activePage, onPageChange, searchQuery, onSearchChange, onVoiceResult }) {
  const { getCartCount } = useCart();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchChange(inputValue);
    onPageChange('products');
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => onPageChange('home')} role="button" tabIndex={0}>
        <div className="brand-mark">V</div>
        <div>
          <h1>VocalMart</h1>
          <p>Shop smarter by voice</p>
        </div>
      </div>

      <form className="navbar-search" onSubmit={handleSubmit}>
        <span className="search-icon">⌕</span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search headphones, rice, shirts..."
          aria-label="Search products"
        />
        {inputValue && (
          <button type="button" className="ghost-button" onClick={() => { setInputValue(''); onSearchChange(''); }}>
            Clear
          </button>
        )}
        <VoiceSearch onResult={onVoiceResult} />
      </form>

      <nav className="navbar-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activePage === item.id ? 'nav-link active' : 'nav-link'}
            onClick={() => onPageChange(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="cart-chip" onClick={() => onPageChange('cart')}>
          Cart <span>{getCartCount()}</span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
