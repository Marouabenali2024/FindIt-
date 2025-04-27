import express from 'express';
import User from '../models/User.js'; // Ensure correct path
import bcrypt from 'bcryptjs'; // ✅ Correct import

const router = express.Router();

// Update user information (email, password)
router.put('/updateInformations/:id', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Hash the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10); // Generates salt
      const hashedPassword = await bcrypt.hash(password, salt); // Hashes password
      user.password = hashedPassword;
    }

    // Save updated user
    await user.save();

    return res.status(200).json({
      message: '✅ User information updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Error updating user:', error); // Debugging log
    return res.status(500).json({
      message: '❌ Error updating user information',
      error: error.message,
    });
  }
});

export default router;
