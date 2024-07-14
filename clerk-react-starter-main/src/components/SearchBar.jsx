import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSearch} className="search-bar-form">
      <input
        type="text"
        placeholder="Search books by title, author, or ISBN"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
      <button type="submit" className="search-bar-button">Search</button>
    </form>
  );
};

export default SearchBar;
