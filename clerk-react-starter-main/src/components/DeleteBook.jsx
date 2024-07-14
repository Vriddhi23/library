import React, { useState } from 'react';
import axios from 'axios';
import '../styles/DeleteBook.css';

const DeleteBook = () => {
    const [isbn, setIsbn] = useState('');
    const [deleteStatus, setDeleteStatus] = useState('');
    const [error, setError] = useState('');
  
    const handleDeleteBook = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.delete(`http://localhost:5050/api/books/${isbn}`);
        setDeleteStatus(response.data.message);
        setError('');
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Failed to delete book. Please try again.');
        setDeleteStatus('');
      }
    };
  
    return (
      <div className="delete-book-container">
        <h2 className="delete-book-header">Delete Book</h2>
        <form className="delete-book-form" onSubmit={handleDeleteBook}>
          <label>Enter ISBN to delete:</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
          <button type="submit">Delete Book</button>
        </form>
        {deleteStatus && <div className="delete-book-status">
          <p className="success-message">{deleteStatus}</p>
        </div>}
        {error && <div className="delete-book-status">
          <p className="error-message">{error}</p>
        </div>}
      </div>
    );
  };
  
  export default DeleteBook;