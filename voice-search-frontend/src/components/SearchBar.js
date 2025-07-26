import React, { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery || '');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  const handleVoiceResult = (transcript) => {
    console.log('Voice result received:', transcript);
    setLocalSearchTerm(transcript);
    onSearchChange(transcript);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onClearSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchChange(localSearchTerm);
    }
  };

  // Update local state when searchQuery prop changes
  React.useEffect(() => {
    setLocalSearchTerm(searchQuery || '');
  }, [searchQuery]);

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search products... (try 'phone', 'laptop', etc.)"
            className="search-input"
          />
          {localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <VoiceRecorder onVoiceResult={handleVoiceResult} />
      </div>
    </div>
  );
};

export default SearchBar;