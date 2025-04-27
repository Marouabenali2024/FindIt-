import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../apiCalls/isAuth';
import './Navbar.css';
import logo from '../../assets/FindIt-6.PNG';

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="Navbar">
      <img
        src={logo}
        alt="logo"
        className="hero-image"
        style={{ width: '150px', height: 'auto' }}
        onClick={() => console.log('Image clicked')}
      />

      <nav className="nav">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {loggedIn ? (
          <>
            <Link to="/ItemsList" className="nav-link">
              Items List
            </Link>
            <button onClick={handleLogout} className="nav-item logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-itemLogin-btn">
              Login
            </Link>
            <Link to="/register" className="nav-item register-btn">
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
