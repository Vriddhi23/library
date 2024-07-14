import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AddBook from './components/AddBook';
import DeleteBook from './components/DeleteBook';
import BookList from './components/BookList';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/delete-book" element={<DeleteBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

