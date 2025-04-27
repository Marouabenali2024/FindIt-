import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!secret || !refreshSecret) {
  console.error(
    '❌ JWT_SECRET or REFRESH_TOKEN_SECRET is missing in environment variables!'
  );
  process.exit(1);
}

// Middleware to validate JWT token
const validateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the auth header
  console.log('🔐 Authorization Header:', authHeader); // Debugging

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '❌ Access denied. No token provided.',
    });
  }

  if (!authHeader.startsWith('Bearer ') || authHeader.split(' ').length !== 2) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid token format. Expected "Bearer <token>".',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  console.log('🧪 Extracted Token:', token); // Debugging

  try {
    const decoded = jwt.verify(token, secret); // Decode and verify the token
    req.user = decoded; // Store the decoded user data (including userId) in req.user

    console.log('✅ Decoded JWT:', decoded); // Debugging

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error('❌ JWT verification failed:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token has expired. Please log in again.',
      });
    }

    return res.status(400).json({
      success: false,
      message: '❌ Invalid token. Please provide a valid token.',
    });
  }
};

export default validateJWT;
