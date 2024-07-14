import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';
import '../styles/BookCard.css';

const BookCard = ({ book, onBuy }) => {
  const { volumeInfo } = book;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const title = volumeInfo?.title || 'No title available';
  const authors = volumeInfo?.authors?.join(', ') || 'No authors available';
  const publishedDate = volumeInfo?.publishedDate || 'No date available';
  const thumbnail = volumeInfo?.imageLinks?.thumbnail || '';
  const isbn = volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === 'ISBN_13')?.identifier || '';

  const handleBuy = async () => {
    try {
      if (isbn) {
        const response = await axios.get(`http://localhost:5000/api/books/search?isbn=${isbn}`);
        if (response.data && response.data.items && response.data.items.length > 0) {
          setIsModalOpen(true); // Open modal on successful search
        } else {
          console.error('No book found for the given ISBN.');
        }
      } else {
        console.error('ISBN not available for this book.');
      }
    } catch (error) {
      console.error('Error searching book by ISBN:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setIsModalOpen(false);
      const response = await axios.post('http://localhost:5000/api/user/purchase', { book });
      console.log('Book purchased:', response.data);
      onBuy(book); // Trigger the onBuy callback passed from UserHome
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  return (
    <div className="book-card">
      <img src={thumbnail} alt={title} onClick={handleBuy} className="book-thumbnail" />
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">{authors}</p>
      <p className="book-published-date">{publishedDate}</p>
      <button onClick={handleBuy} className="buy-button">Buy</button>

      <Modal
        title={title}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handlePayment}>
            Confirm Purchase
          </Button>,
        ]}
      >
        <div>
          <p>Description: {volumeInfo?.description || 'No description available'}</p>
        </div>
      </Modal>
    </div>
  );
};

export default BookCard;
