import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin.js';
// Admin login function
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Find the admin by email
  const admin = await Admin.findOne({ email }); // Use 'admin' instead of 'Admin'

  // If no admin found with the provided email
  if (!admin) {
    return res.status(400).json({ message: 'Admin not found' });
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, admin.password); // Corrected reference to 'admin.password'

  // If passwords do not match
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration time
  });

  // Send success response with token
  res.status(200).json({ message: 'Login successful', token });
};
