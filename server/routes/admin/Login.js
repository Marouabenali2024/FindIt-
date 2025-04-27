import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin.js'; // Ensure this model is defined and imported correctly

// Login function for admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body; // Get the email and password from the request body

    // Find the admin by email in the database
    const admin = await Admin.findOne({ email });

    // If no admin is found, send a 404 error with a message
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare the given password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, admin.password);

    // If passwords don't match, send a 401 error with a message
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: 'Server misconfiguration: JWT_SECRET not found' });
    }

    // If login is successful, create a JWT token
    const token = jwt.sign(
      {
        id: admin._id, // Store admin's unique ID in the token
        isAdmin: admin.isAdmin, // Store whether the user is an admin
        isMainAdmin: admin.isMainAdmin, // Store main admin role status
        isSubAdmin: admin.isSubAdmin, // Store sub admin role status
      },
      process.env.JWT_SECRET, // Secret key for JWT, stored in environment variable
      { expiresIn: '1h' } // Set the token to expire in 1 hour
    );

    // Send the token and user data in the response
    res.status(200).json({
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: admin._id, // Return the user ID
          email: admin.email, // Return the user's email
          isAdmin: admin.isAdmin, // Include admin roles, as needed
        },
      },
    });
  } catch (error) {
    // Log the error for internal debugging (don't send the full error message to the client)
    console.error('Login error:', error);

    // If there's any error, send a 500 response with a generic error message
    res.status(500).json({ message: 'Internal server error' });
  }
};


export default loginAdmin;
