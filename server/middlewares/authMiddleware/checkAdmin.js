import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// checkAdmin: Middleware to ensure the user is an admin
 const checkAdmin = (req, res, next) => {
  // If the user is not an admin, return a Forbidden error
  if (!req.isAdmin) {
    return res.status(403).json({
      status: false,
      error: 'Access denied. Admins only.',
    });
  }

  // Proceed if the user is an admin
  next();
};
export default checkAdmin;
