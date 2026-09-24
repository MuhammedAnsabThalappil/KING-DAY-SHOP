import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration supporting Vercel production, localhost, and custom domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile, curl, health checks)
    if (!origin) return callback(null, true);

    // If explicit origin matches allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all Vercel deployment preview and production URLs
    if (origin.endsWith('.vercel.app') || /^https:\/\/king-day-shop[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Allow comma-separated CLIENT_URL if provided
    if (process.env.CLIENT_URL) {
      const origins = process.env.CLIENT_URL.split(',').map((u) => u.trim());
      if (origins.includes(origin)) return callback(null, true);
    }

    // Default: allow origin to avoid blocking
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Login Rate Limiter (Prevent Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
});
app.use(['/api/admin/login', '/api/auth/login'], loginLimiter);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'KING DAY',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Serve frontend static build in production if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');

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

const PORT = Number(process.env.PORT) || Number(config.port) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KING DAY Server listening on 0.0.0.0:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'Local SQLite'}`);
});
