import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connect } from './connect.js';
import colors from 'colors';
import UserRoutes from './routes/user/index.js';
import AdminRoutes from './routes/admin/index.js';
import cors from 'cors';

// Load env vars
dotenv.config(); 
// Log MONGO_URI to check if it's loaded correctly
console.log('MongoDB URI:', process.env.MONGO_URI);

// Initialize express
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Connect to MongoDB
connect();

// Add this middleware before your routes
app.use(express.json());

// Routes
app.use('/api/user', UserRoutes);
app.use('/api/admin', AdminRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`.bgGreen.bold);
});
