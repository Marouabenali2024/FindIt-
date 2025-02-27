import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import API from '../../apiCalls/api'; // Use the Axios instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in...");
    setError(''); 
    setSuccess('');

    navigate("/");

    try {
      const response = await API.post('/auth/login', { email, password });

      if (response.data.ok) {
        const { token } = response.data;
        localStorage.setItem('token', token); // Store token
        setSuccess('Login successful!');
        console.log('Login Successful:', response.data);
      } else {
        setError(response.data.msg || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.msg || 'Error logging in');
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-container">
        <h1 className="login-title">Login</h1>

        {/* Display messages */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Login;
