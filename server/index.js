import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import colors from 'colors';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import cors from 'cors';

// Load env vars
dotenv.config();

// Initialize express
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Connect to MongoDB
connectDB();

// Add this middleware before your routes
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`.bgGreen.bold);
});
