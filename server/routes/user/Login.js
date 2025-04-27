import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

// ✅ LOGIN FUNCTION for User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in environment variables');
      return res
        .status(500)
        .json({ status: false, error: 'Server error, JWT_SECRET is missing' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, error: 'Invalid credentials' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, error: 'Invalid credentials' });
    }

    // Check if the user has verified their email
    if (!user.verifypwd) {
      return res
        .status(401)
        .json({ status: false, error: 'Please verify your account' });
    }

    // Check if the account is banned
    if (user.isBanned) {
      return res
        .status(401)
        .json({ status: false, error: 'Your account is banned' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res
      .status(500)
      .json({ status: false, error: 'Server error, please try again later' });
  }
};
