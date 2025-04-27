import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is loaded correctly
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('❌ JWT_SECRET is missing in environment variables!');
  process.exit(1);
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Debugging: Log headers to verify the request contains the Authorization header
  console.log('Request headers:', req.headers);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '❌ Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the authorization header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '❌ Access denied. Token is missing or malformed.',
    });
  }

  try {
    const decoded = jwt.verify(token, secret); // Verify the token with the secret

    // Attach userId to the request object
    req.userId = decoded.id;

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 User ID extracted from token:', req.userId);
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({
      success: false,
      message:
        err.name === 'TokenExpiredError'
          ? '❌ Token has expired.'
          : '❌ Invalid token.',
    });
  }
};

console.log('JWT Middleware Loaded');

export default verifyToken;
