import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './lib/socket.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

// 1. basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);

// 2. routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// 3. error handling middleware
app.use('*', (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// 4. error handling middleware(must be the last one)
app.use(errorHandler);

// First connect to database, then start the server, if not connected, then don't start the server
const startServer = async () => {
  try {
    // try to connect to database
    await connectDB();
    // if connected, then start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Error in starting server', error);
    process.exit(1);
  }
};

startServer();
