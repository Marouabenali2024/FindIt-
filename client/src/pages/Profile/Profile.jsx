import React from 'react';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Person } from '@mui/icons-material'; // Import Material UI Person icon
import './Profile.css'; // Import CSS file

function Profile() {
  return (
    <div>
      <NavBar />
      <div className="profile-container">
        {/* Profile Title */}
        <h1 className="profile-title">
          <Person className="profile-icon" />
          <span className="profile-text">Profile</span>
        </h1>

        {/* Form Sections */}
        <div className="form-group">
          <label htmlFor="full-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            placeholder="Enter your Full Name"
            className="input-box"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            className="input-box"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            className="input-box"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter your Location"
            className="input-box"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            placeholder="Enter your Phone"
            className="input-box"
          />
        </div>

        {/* Buttons */}
        <div className="btn-container">
          <button className="btn save-btn">Save</button>
          <button className="btn cancel-btn">Cancel</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
