import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import './styles/App.css'; // Import your CSS file

const App = () => {
  const [books, setBooks] = useState([]);
  const [sortedBooks, setSortedBooks] = useState([]);
  const [sortType, setSortType] = useState('new');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch bestsellers
        const bestsellersResponse = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=bestsellers'
        );

        // Fetch new arrivals
        const newArrivalsResponse = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=new+arrivals'
        );

        // Combine bestsellers and new arrivals into one array
        const combinedBooks = [
          ...bestsellersResponse.data.items,
          ...newArrivalsResponse.data.items,
        ];

        // Set both books and sortedBooks state
        setBooks(combinedBooks);
        setSortedBooks(combinedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const sortBooks = (type) => {
    let sorted = [];
    if (type === 'new') {
      sorted = [...books].sort(
        (a, b) =>
          new Date(b.volumeInfo.publishedDate) -
          new Date(a.volumeInfo.publishedDate)
      );
    } else if (type === 'trending') {
      // Example logic for trending books (dummy logic)
      sorted = bestsellersResponse;
    }
    setSortedBooks(sorted);
    setSortType(type);
  };

  const fetchBooks = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items);
      setSortedBooks(response.data.items);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="container">
      <SearchBar onSearch={fetchBooks} />
      <div className="btn-container">
        <button onClick={() => sortBooks('new')}>New Arrivals</button>
        <button onClick={() => sortBooks('trending')}>Trending</button>
      </div>
      <div>
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default App;