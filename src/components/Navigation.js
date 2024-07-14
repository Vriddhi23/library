import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css'; // Import your CSS file

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/add-book">Add Book</Link></li>
        <li><Link to="/delete-book">Delete Book</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
