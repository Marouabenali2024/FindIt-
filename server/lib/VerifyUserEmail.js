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

const VerifyUserEmail = async (fullName, userEmail, userType = 'user') => {
  console.log('📧 Sending verification email to:', userEmail);
  console.log('📛 Full Name:', fullName);
  console.log('🧑‍💼 User Type:', userType);

  try {
    // Log sensitive info with caution
    console.log('📨 EMAIL_USER:', process.env.EMAIL_USER);
    if (process.env.EMAIL_PASS) {
      console.warn('🔑 EMAIL_PASS: *****'); // Don't log the actual password in production
    } else {
      console.error('❌ EMAIL_PASS not set!');
    }

    // Create a transport for the email sending
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const filePath = path.join(__dirname, '..', 'content', 'about.html');
    const docPath = path.join(__dirname, '..', 'assets', 'doc.pdf');

    // Check if the required files exist
    try {
      await fs.access(filePath); // Check if about.html exists
      await fs.access(docPath); // Check if doc.pdf exists
    } catch (err) {
      throw new Error(`❌ File(s) not found: ${err.message}`);
    }

    // Read email content (HTML) and PDF attachment
    const emailContent = await fs.readFile(filePath, 'utf-8'); // Asynchronously read HTML file
    const docContent = await fs.readFile(docPath); // Asynchronously read binary content for PDF

    // Define email subject and text based on user type
    const subject =
      userType === 'admin'
        ? 'Admin Account Verification'
        : 'Account Verification';
    const text =
      userType === 'admin'
        ? `Hello ${fullName},\n\nWelcome to FindIt! Your admin account has been created successfully. Please verify your admin account.`
        : `Hello ${fullName},\n\nWelcome to FindIt! Please verify your account.`;

    // Prepare email options
    const mailOptions = {
      from: `FindIt <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      text: text,
      html: emailContent,
      attachments: [
        {
          filename: 'doc.pdf',
          content: docContent,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error; // Rethrow error for proper handling
  }
};


export default VerifyUserEmail;
