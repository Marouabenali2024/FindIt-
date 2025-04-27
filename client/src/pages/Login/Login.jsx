import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIMG from './../../assets/LoginIMG.jpg';
import './Login.css';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import API from '../../apiCalls/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // This will handle the loading state
  const [isAdmin, setIsAdmin] = useState(false); // Track role (User/Admin)
  const navigate = useNavigate();

  // Toggle between User and Admin role
  const handleRoleToggle = (role) => {
    setIsAdmin(role === 'admin');
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true); // Set the loading state to true
  setError('');
  setSuccess('');

  try {
    // Make the login request to either the user or admin login endpoint
    const response = await API.post(
      isAdmin ? '/admin/login' : '/user/login', // Based on admin or user
      { email, password } // Directly use the state values
    );

    // Check if the response contains 'data' and 'user' objects
    if (response.data?.data?.user) {
      const { token, user, role } = response.data.data;

      // Store the token, user details, and role
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role); // Save the role (User or Admin)

      setError(''); // Clear any previous error
      setSuccess('Login successful!');

      // Navigate based on user type
      setTimeout(() => {
        try {
          if (isAdmin) {
            navigate('/admin/dashboard'); // Admin dashboard
          } else {
            navigate('/user/dashboard'); // User dashboard
          }
        } catch (navigateError) {
          console.error('Navigation error:', navigateError);
          setError('Error navigating to the dashboard');
        }
      }, 1500);
    } else {
      setError('Login failed: User data is missing');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError(
      error.response?.data?.error ||
        'Error logging in, please check your credentials.'
    );
  } finally {
    setIsLoading(false); // Set loading state back to false after the process is complete
  }
};


  return (
    <>
      <NavBar />
      <div className="login-wrapper">
        <div className="login-image">
          <img src={LoginIMG} alt="Login Visual" />
        </div>

        <div className="login-container">
          <h1 className="login-title">Login</h1>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <form onSubmit={handleLogin}>
            <div className="role-toggle">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={!isAdmin}
                  onChange={() => handleRoleToggle('user')}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={isAdmin}
                  onChange={() => handleRoleToggle('admin')}
                />
                Admin
              </label>
            </div>

            <div className="input-groupEmail">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-groupPassword">
              <label>Password:</label>
              <input
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

