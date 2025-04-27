import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import VerifyUserEmail from '../../lib/VerifyUserEmail.js';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().trim().min(3).max(50).required(),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string()
        .min(8)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/
        )
        .required()
        .messages({
          'string.pattern.base':
            'Password must have at least one uppercase, lowercase, number, and special character.',
        }),
      address: Joi.string().trim().min(5).max(100).required(),
      phone: Joi.string()
        .pattern(/^[0-9]{8,15}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid phone number format.',
        }),
    });

    const { fullName, email, password, address, phone } = req.body;
    const { error } = schema.validate({
      fullName,
      email,
      password,
      address,
      phone,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      fullName,
      email,
      password: hashedPassword,
      address,
      phone,
    }).save();

    await VerifyUserEmail(fullName, email, newUser._id);

    return res.status(201).json({
      message: 'User registered successfully!',
      user: { fullName, email },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res
      .status(500)
      .json({ error: 'Internal server error. Please try again later.' });
  }
};
