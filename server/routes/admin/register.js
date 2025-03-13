import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import Admin from '../../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_USER,
    pass: process.env.ADMIN_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Regular Expressions for Validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/;

// Send Confirmation Email
const sendConfirmationEmail = async (fullName, email, role) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_USER,
      to: email,
      subject: 'Account Registration Confirmation',
      text: `Hello ${fullName},\n\nThank you for registering as an ${role} on our platform! We are excited to have you on board.\n\nBest regards,\nTeam`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Error sending confirmation email');
  }
};

// Simplified Admin Registration
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
    await sendConfirmationEmail(fullName, email, 'admin');

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
