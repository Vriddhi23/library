import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookDetails.css'; // Import your CSS file

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/books/${id}`);
        setBook(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to fetch book details. Please try again.');
      }
    };

    fetchBookDetails();
  }, [id]);

  if (error) {
    return <div className="book-details-container">
      <h2>Book Details</h2>
      <div className="error-message">{error}</div>
    </div>;
  }

  if (!book) {
    return <div className="book-details-container">
      <h2>Book Details</h2>
      <div>Loading...</div>
    </div>;
  }

  return (
    <div className="book-details-container">
      <h2 className="book-details-header">Book Details</h2>
      <div className="book-details-info">
        <label>Title:</label>
        <p>{book.title}</p>

        <label>Author:</label>
        <p>{book.author}</p>

        <label>Publisher:</label>
        <p>{book.publisher}</p>

        <label>Published Year:</label>
        <p>{book.year}</p>

        {/* Add more details as needed */}
      </div>
      <Link to="/" className="back-link">Back to Book List</Link>
    </div>
  );
};

export default BookDetails;