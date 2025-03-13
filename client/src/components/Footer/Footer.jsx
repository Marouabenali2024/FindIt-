import React from 'react';
import logo from '../../assets/FindIt-6.PNG';
import './Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <footer className="Footer">
        {/* Logo */}
        <div className="footer-logo">
          <img
            src={logo}
            alt="logo"
            className="hero-image"
            style={{ width: '150px', height: 'auto' }}
            onClick={() => console.log('Image clicked')}
          />
        </div>

        {/* Social Media Links */}
        <div className="footer-nav">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
        </div>
      </footer>

      {/* Copyright Line */}
      <div className="footer-copyright">
        <p className="footer-text">&copy; 2024 FindIt. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
