import nodemailer from 'nodemailer';
import fs from 'fs/promises'; // Use promises-based API for async file reading
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Email validation function
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};
import nodemailer from 'nodemailer';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_USER,
    pass: process.env.ADMIN_PASS,
  },
});


export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, confirmEmail, confirmPassword, phone } =
      req.body;

    // Email Validation
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, error: 'Invalid email format' });
    }

    // Check if emails match
    if (email !== confirmEmail) {
      return res
        .status(400)
        .json({ status: false, error: 'Emails do not match' });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ status: false, error: 'Email is already registered' });
    }

    // Password Validation
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ status: false, error: 'Invalid password format' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ status: false, error: 'Passwords do not match' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new Admin
    const newAdmin = new Admin({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    // Save to MongoDB
    await newAdmin.save();

    // Send Verification Email
    await VerifyUserEmail(fullName, email); // If this function is used for verification

    // Send Success Response
    res.status(201).json({
      status: true,
      message: 'Admin registered successfully!',
      admin: {
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
      },
    });
  } catch (error) {
    console.error('❌ Error during registration:', error);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }
};
