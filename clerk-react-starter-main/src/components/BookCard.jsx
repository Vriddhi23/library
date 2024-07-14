import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div>
      <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
      <h3>{book.volumeInfo.title}</h3>
      <p>{book.volumeInfo.authors?.join(', ')}</p>
      <p>{book.volumeInfo.publishedDate}</p>
      <p>{book.volumeInfo.description}</p>
    </div>
  );
};

export default BookCard;
