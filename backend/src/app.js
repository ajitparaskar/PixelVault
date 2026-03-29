import './config/env.js';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes import
import imageRoutes from './routes/images.routes.js';
import authRoutes from './routes/auth.routes.js';

// Route declaration
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => res.status(200).send('API is running ok'));

// Error handling middleware
app.use(errorHandler);

export { app };
