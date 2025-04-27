import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import { connect } from './connect.js';
import path from 'path'; // استيراد path

// للحصول على __dirname باستخدام ES module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Import Routes
import authRoutes from './routes/auth.js';
import UserRoutes from './routes/user/index.js';
import AdminRoutes from './routes/admin/index.js';
import itemRouter from './routes/item/index.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware (Ensure this is before routes)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // الآن المسار يعمل
app.options('*', cors()); // Allow pre-flight OPTIONS requests globally

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/item', itemRouter);

// Health Check
app.get('/ping', (req, res) => res.send('✅ Server is running'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ message: '❌ Validation error', details: err.errors });
  }
  next(err);
});

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ message: '❌ Something went wrong!' });
});

// Start Server Only If DB Connects
(async () => {
  const isConnected = await connect();
  if (isConnected) {
    app.listen(port, () => {
      console.log(colors.bgGreen.bold(`🚀 Server running on port ${port}`));
    });
  } else {
    console.error(
      colors.red('❌ Server failed to start due to DB connection issues')
    );
  }
})();
