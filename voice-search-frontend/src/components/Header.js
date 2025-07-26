import React from 'react';
import SearchBar from './SearchBar';

const Header = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo">
            <span className="logo-icon">🛒</span>
            VocalMart
          </h1>
          <p className="tagline">Save money. Live better.</p>
        </div>
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
        />
      </div>
    </header>
  );
};

export default Header;