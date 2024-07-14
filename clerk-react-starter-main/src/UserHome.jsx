import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCardUser';
import './styles/App.css';
import './styles/UserHome.css';

const UserHome = () => {
  const [books, setBooks] = useState([]);
  const [sortedBooks, setSortedBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bestsellersResponse = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=bestsellers'
        );
        const newArrivalsResponse = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=new+arrivals'
        );
        const combinedBooks = [
          ...bestsellersResponse.data.items,
          ...newArrivalsResponse.data.items,
        ];

        if (!searched) {
          setBooks(combinedBooks);
          setSortedBooks(combinedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [searched]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (user) {
        const email = user.primaryEmailAddress.emailAddress;
        try {
          const response = await axios.get(`http://localhost:5000/api/user/books?email=${email}`);
          setUserBooks(response.data);
        } catch (error) {
          console.error('Error fetching user books:', error);
        }
      }
    };

    fetchUserBooks();
  }, [user]);

  const handleBuy = async (book) => {
    if (user) {
      const email = user.primaryEmailAddress.emailAddress;
      try {
        await axios.post('http://localhost:5000/api/user/purchase', { book, email });
        // Refresh user's books after purchase
        const response = await axios.get(`http://localhost:5000/api/user/books?email=${email}`);
        setUserBooks(response.data);
      } catch (error) {
        console.error('Error buying book:', error);
      }
    }
  };

  const fetchBooks = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items);
      setSortedBooks(response.data.items);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="user-home-container">
      <SearchBar onSearch={(query) => { fetchBooks(query); setSearchQuery(query); }} />

      <div className="books-container">
        {searched && sortedBooks.length > 0 && (
          sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} onBuy={() => handleBuy(book)} />
          ))
        )}
        {searched && sortedBooks.length === 0 && (
          <p>No books found matching '{searchQuery}'</p>
        )}
      </div>
      {user && (
        <div className="user-books-section">
          <h2>My Books</h2>
          {userBooks.map((book) => (
            <div key={book.id} className="user-book">
              <h3>{book.title}</h3>
              <p>Authors: {book.authors}</p>
              <p>Published Date: {book.published_date}</p>
              <p>ISBN-13: {book.isbn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHome;
