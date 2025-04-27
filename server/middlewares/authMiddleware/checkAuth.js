import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // لتحميل المتغيرات من ملف .env

const checkAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: '❌ No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '❌ Invalid or expired token' });
  }
};

export default checkAuth;
