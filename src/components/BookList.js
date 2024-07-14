import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const fetchBookDetails = async (isbn) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (response.data.items && response.data.items.length > 0) {
        setSelectedBook(response.data.items[0].volumeInfo);
        setError('');
      } else {
        setError('No book found for the given ISBN.');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details. Please try again.');
    }
  };

  return (
    <div className="book-list-container">
      <h2 className="book-list-header">Book List</h2>
      <div className="book-list-actions">
      </div>
      <ul className="book-list">
        {books.map(book => (
          <li key={book.id} onClick={() => fetchBookDetails(book.ISBN)}>
            <Link to={`/book/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
      {selectedBook && (
        <div className="book-details">
          <h2>{selectedBook.title}</h2>
          <p>by {selectedBook.authors && selectedBook.authors.join(', ')}</p>
          <img src={selectedBook.imageLinks.thumbnail} alt={selectedBook.title} className="book-image" />
          <p className="book-description">{selectedBook.description}</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default BookList;
