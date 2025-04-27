import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import RegisterIMG from './../../assets/RegisterIMG.jpg';
import * as Yup from 'yup';
import axios from 'axios';
import './Register.css';
import NavBar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

// Validation schema
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().trim().required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref('email'), null], 'Emails must match')
    .required('Confirm Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  address: Yup.string().trim().required('Address is required'),
  phone: Yup.string()
    .matches(/^[0-9]{8,15}$/, 'Invalid phone number')
    .required('Phone is required'),
  role: Yup.string().required('Role is required'),
});

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRoleToggle = (role) => setIsAdmin(role === 'admin');

  const handleRegister = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const API_URL = isAdmin
        ? 'http://localhost:3000/api/admin/register'
        : 'http://localhost:3000/api/user/register';
      const response = await axios.post(API_URL, values);
      setSuccess(response.data.message || 'Registration successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration error');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="register-wrapper">
        <div className="register-container">
          <h1 className="register-title">
            {isAdmin ? 'Admin Registration' : 'User Registration'}
          </h1>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              confirmEmail: '',
              password: '',
              confirmPassword: '',
              address: '',
              phone: '',
              role: isAdmin ? 'admin' : 'user',
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="role-toggle">
                  <label>
                    <Field
                      type="radio"
                      name="role"
                      value="user"
                      checked={!isAdmin}
                      onChange={() => handleRoleToggle('user')}
                    />
                    User
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="role"
                      value="admin"
                      checked={isAdmin}
                      onChange={() => handleRoleToggle('admin')}
                    />
                    Admin
                  </label>
                </div>

                {[
                  'fullName',
                  'email',
                  'confirmEmail',
                  'password',
                  'confirmPassword',
                  'address',
                  'phone',
                ].map((field) => (
                  <div className="input-group" key={field}>
                    <label htmlFor={field}>
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <Field
                      id={field}
                      type={
                        field.includes('password')
                          ? 'password'
                          : field.includes('email')
                            ? 'email'
                            : 'text'
                      }
                      name={field}
                      placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1')}`}
                    />
                    <ErrorMessage
                      name={field}
                      component="p"
                      className="error-msg"
                    />
                  </div>
                ))}

                <button
                  className="Register-btn"
                  type="submit"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>

        <div className="image-container">
          <img src={RegisterIMG} alt="Register Visual" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
