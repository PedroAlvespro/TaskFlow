import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar-wrapper">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Pesquisar tarefas..."
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
