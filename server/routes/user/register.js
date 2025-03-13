import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import VerifyUserEmail from '../../lib/VerifyUserEmail.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    let {
      fullName,
      email,
      password,
      confirmEmail,
      confirmPassword,
      address,
      phone,
    } = req.body;

    // ✅ Check if all fields are provided
    if (
      !fullName ||
      !email ||
      !confirmEmail ||
      !password ||
      !confirmPassword ||
      !address ||
      !phone
    ) {
      return res
        .status(400)
        .json({ status: false, error: 'All fields are required.' });
    }

    // ✅ Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, error: 'Invalid email format.' });
    }

    // ✅ Check if email matches confirmation email
    if (email !== confirmEmail) {
      return res
        .status(400)
        .json({ status: false, error: 'Emails do not match.' });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, error: 'Email is already registered.' });
    }

    // ✅ Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        error:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // ✅ Check if password matches confirmation password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ status: false, error: 'Passwords do not match.' });
    }

    // ✅ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await newUser.save();

    // ✅ Send verification email
    await VerifyUserEmail(fullName, email); // Call with full name and email

    // ✅ Send success response
    return res.status(201).json({
      status: true,
      message: 'User registered successfully!',
      user: {
        fullName,
        email,
        address,
        phone,
      },
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    return res.status(500).json({
      status: false,
      error: 'Internal server error. Please try again later.',
    });
  }
};

