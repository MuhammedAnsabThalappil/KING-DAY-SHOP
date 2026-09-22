import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Login Rate Limiter (Prevent Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
});
app.use('/api/admin/login', loginLimiter);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'KING DAY', timestamp: new Date().toISOString() });
});

// Serve frontend static build in production
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Only serve static files if the dist folder exists (production)
import fs from 'fs';
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).json({ message: 'Not Found' });
      }
    });
  });
} else {
  // Development fallback: API-only message on root
  app.get('/', (_req, res) => {
    res.json({
      message: '🛍️ KING DAY API Server is running!',
      docs: 'API endpoints available at /api/*',
      health: '/health',
    });
  });
}

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 KING DAY Server listening on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local SQLite'}`);
});
