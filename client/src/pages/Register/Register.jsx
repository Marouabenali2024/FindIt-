import { useState } from 'react';
import './Register.css';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import API from '../../apiCalls/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Registering...');

    try {
      const response = await API.post('/auth/register', {
        username,
        password,
        email,
      });

      console.log(response.data);
      setSuccess(response.data.msg || 'Registration successful!');
      setError('');

      // Clear input fields after successful registration
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Error registering user');
      setSuccess('');
    }
  };

  return (
    <>
      <NavBar />
      <div className="register-container">
        <h1 className="register-title">Register</h1>

        {/* Display messages */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="Register-btn">
            Register
          </button>
        </form>

        {/* Already have an account? */}
        <p className="login-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>

      <Footer />
    </>
  );
}

export default Register;
