import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const generateJWT = async (user) => {
  return jwt.sign({ id: user._id }, secret, {
    expiresIn: '24h',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email); // Debugging

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ ok: false, msg: 'Email not found' });
    }

    // Compare passwords
    const isMatchPassword = await bcrypt.compareSync(password, user.password);
    if (!isMatchPassword) {
      return res.status(200).json({ ok: false, msg: 'Incorrect Password' });
    }

    // Generate JWT
    const token = await generateJWT(user);

    res.status(200).json({
      ok: true,
      user: user,
      msg: 'User Logged',
      token,
      id: user._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, msg: 'Please contact the administrator' });
  }
};

export default loginUser;
