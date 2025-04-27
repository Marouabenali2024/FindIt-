import axios from 'axios';
import { useState } from 'react';

// Setting up axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Ensure this is the correct path
  headers: {
    'Content-Type': 'application/json',
  },
});
// Attach token if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleRegister = async (values, { setSubmitting }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    // Pass form values directly to the API request
    const response = await API.post('/register', values); // 'values' contain the user input from the form
    setSuccess(response.data.message || 'Registration successful!');
  } catch (error) {
    console.error(
      'Registration error:',
      error.response?.data?.error || error.message
    );
    setError(error.response?.data?.error || 'Error registering user');
  } finally {
    setIsLoading(false);
    setSubmitting(false);
  }
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
        const { token, user } = response.data.data;

        // Store the token and user details
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setError(''); // Clear any previous error
        setSuccess('Login successful!');

        // Navigate based on user type
        setTimeout(() => {
          if (isAdmin) {
            navigate('/admin/dashboard'); // Admin dashboard
          } else {
            navigate('/user/dashboard'); // User dashboard
          }
        }, 1500);
      } else {
        setError('Login failed: User data is missing');
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      setError(
        error.response?.data?.error ||
          'Error logging in, please check your credentials.'
      );
    } finally {
      setIsLoading(false); // Set loading state back to false after the process is complete
    }
  };
  
export default API;
