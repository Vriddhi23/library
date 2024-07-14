import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddBook.css'; // Import your CSS file

const AddBook = () => {
  const [isbn, setIsbn] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleFetchBookDetails = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0].volumeInfo;
        setBookDetails({
          ISBN: isbn,
          title: book.title || '',
          author: book.authors ? book.authors[0] : '',
          publisher: book.publisher || '',
          year: book.publishedDate ? book.publishedDate.substring(0, 4) : '',
          genre: book.categories ? book.categories[0] : '',
          availability_status: true,
        });
        setError('');
      } else {
        setError('No book found for the given ISBN.');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details. Please try again.');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      // First, check if the book already exists
      const checkResponse = await axios.get(`http://localhost:5050/api/books/${isbn}`);
      
      if (checkResponse.data) {
        // Book exists, update the quantity
        const updatedQuantity = checkResponse.data.quantity + quantity;
        await axios.put(`http://localhost:5050/api/books/${isbn}`, {
          ...checkResponse.data,
          quantity: updatedQuantity
        });
      } else {
        // Book doesn't exist, add new book
        await axios.post('http://localhost:5050/api/books', {
          ...bookDetails,
          quantity: quantity
        });
      }
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Book doesn't exist, add new book
        try {
          await axios.post('http://localhost:5050/api/books', {
            ...bookDetails,
            quantity: quantity
          });
          navigate('/');
        } catch (postError) {
          console.error('Error adding new book:', postError);
          setError('Failed to add new book. Please try again.');
        }
      } else {
        console.error('Error adding/updating book:', error);
        setError('Failed to add/update book. Please try again.');
      }
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>
      <div className="add-book-form">
        <label>Enter ISBN:</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Enter ISBN"
        />
        <button onClick={handleFetchBookDetails}>Fetch Book Details</button>

        {error && <p className="error-message">{error}</p>}
        
        {bookDetails && (
          <form onSubmit={handleAddBook}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={bookDetails.title}
                readOnly
              />
            </div>
            {/* Other input fields */}
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
            <button type="submit">Add Book</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBook;