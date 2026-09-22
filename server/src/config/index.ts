import dotenv from 'dotenv';
import path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Absolute SQLite path resolution fallback for local development
const defaultDbPath = path.resolve(__dirname, '../../../prisma/dev.db');
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = `file:${defaultDbPath}`;
}

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'kingday_super_secret_jwt_key_2026_change_in_production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  whatsappNumber: process.env.VITE_WHATSAPP_NUMBER || '919495902904',
};
