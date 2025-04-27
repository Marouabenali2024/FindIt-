import express from 'express';
import checkAuth from '../../middlewares/authMiddleware/checkAuth.js';
import checkAdmin from '../../middlewares/authMiddleware/checkAdmin.js';
import User from '../../models/User.js';

const router = express.Router();

// Get User by ID with checkAuth and checkAdmin middleware
router.get('/getUser/:id', checkAuth, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the URL parameter

    // Find the user by ID and select only the required fields
    const user = await User.findById(id, {
      fullName: 1,
      email: 1,
      address: 1,
      phone: 1,
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: '❌ User not found' });
    }

    return res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
