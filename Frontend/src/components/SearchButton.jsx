import { useState, useEffect } from 'react';
import { useKeyboard } from '../contexts/KeyboardContext';
import SearchModal from './SearchModal';
import './SearchButton.css';

const SearchButton = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { registerHandler, unregisterHandler } = useKeyboard();

  // Register keyboard shortcut for search
  useEffect(() => {
    registerHandler('search', () => {
      setShowSearchModal(true);
    });

    registerHandler('commandPalette', () => {
      setShowSearchModal(true);
    });

    return () => {
      unregisterHandler('search');
      unregisterHandler('commandPalette');
    };
  }, [registerHandler, unregisterHandler]);

  return (
    <>
      <button
        className="search-button"
        onClick={() => setShowSearchModal(true)}
        title="Advanced Search (Ctrl+F)"
      >
        <span className="search-button-icon">🔍</span>
        <span className="search-button-text">Advanced Search</span>
        <span className="search-button-shortcut">Ctrl+F</span>
      </button>

      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
};

export default SearchButton;