import express from 'express';
import User from '../../models/User.js'; // Ensure you have access to the User model

const router = express.Router();

// Route to verify the account via the user ID
router.get('/verifyAccount/:id', async (req, res) => {
  try {
    const { id } = req.params; // Retrieve the user ID from the URL parameter
    console.log('User ID received:', id); // Log the ID to check what is being passed

    // Find user by the provided ID
    const user = await User.findById(id);
    console.log('User Data:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ status: false, error: 'User not found' });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      console.log('User already verified');
      return res
        .status(400)
        .json({ status: false, error: 'Account already verified' });
    }

    // Check if the password is already verified
    if (user.verifypwd) {
      console.log('Password already verified');
      return res
        .status(400)
        .json({ status: false, error: 'Password already verified' });
    }

    // Update both the isVerified and verifypwd fields to true
    user.isVerified = true;
    user.verifypwd = true;
    await user.save();
    console.log('User verified successfully');
    return res
      .status(200)
      .json({ status: true, message: 'Account successfully verified' });
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ status: false, error: 'Server error' });
  }
});

// Export the router
export default router;
