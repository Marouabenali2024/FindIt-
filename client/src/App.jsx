import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import AddItem from './pages/AddItem/AddItem.jsx';
import SearchItems from './pages/SearchItems/SearchItems.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import './App.css';
import Profile from './pages/AddItem/TestPage.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/search-items" element={<SearchItems />} />{' '}
        {/* Ensure path matches */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
