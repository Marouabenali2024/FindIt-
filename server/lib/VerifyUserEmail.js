import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Ensure correct import for your User model

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email validation function
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

const VerifyUserEmail = async (fullName, userEmail, id, userType = 'user') => {
  console.log('📧 Sending verification email to:', userEmail);
  console.log('📛 Full Name:', fullName);
  console.log('🧑‍💼 User Type:', userType);

  try {
    // Ensure environment variables exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        '❌ Missing EMAIL_USER or EMAIL_PASS in environment variables.'
      );
      return null; // Avoid throwing errors that crash the app
    }

    // Validate email format
    if (!isValidEmail(userEmail)) {
      console.error('❌ Invalid email address provided!');
      return null;
    }

    // Check if user exists in the database
    const user = await User.findById(id);
    if (!user) {
      console.log('❌ User not found in the database');
      return null; // Return null instead of throwing
    }

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Generate verification URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Use environment variable
    const verificationUrl = `${baseUrl}/api/user/verifyAccount/${id}`;

    // Define email subject and body
    const subject =
      userType === 'admin'
        ? 'Admin Account Verification'
        : 'Account Verification';

    const htmlContent = `
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Welcome to <strong>FindIt</strong>! ${
        userType === 'user' ? 'Your account has been created successfully.' : ''
      }</p>
      <p>Please click the link below to verify your account:</p>
      <p><a href="${verificationUrl}" style="color: blue; font-weight: bold;">Verify Your Account</a></p>
      <p>If you did not sign up for FindIt, please ignore this email.</p>
      <p>Best regards,<br>FindIt Team</p>
    `;

    // Email options
    const mailOptions = {
      from: `FindIt <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html: htmlContent, // Use HTML for better formatting
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return null; // Avoid throwing errors that crash the app
  }
};

export default VerifyUserEmail;
