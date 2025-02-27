import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className="footer">
      {/* Footer */}
      <footer className="footer">
        <img className="logo" alt="FindIt" />
        <div className="footer-links">
          <div className="footer-section">
            <h3>Site</h3>
            <a href="#">Lost</a>
            <a href="#">Report Lost</a>
            <a href="#">Found</a>
            <a href="#">Report Found</a>
          </div>
          <div className="footer-section">
            <h3>Help</h3>
            <a href="#">Customer Support</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-section">
            <h3>Links</h3>
            <a href="#">LinkedIn</a>
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
            <a href="#">About Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
