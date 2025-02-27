import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const validateJWT = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      msg: 'Access denied. No token provided.',
    });
  }

  // Check if the header starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token format. Expected "Bearer <token>".',
    });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default validateJWT;
