import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Ensure .env is loaded before Prisma initializes
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// Find actual database file if using SQLite
function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) {
    const candidates = [
      path.resolve(process.cwd(), 'prisma/dev.db'),
      path.resolve(process.cwd(), 'dev.db'),
      path.resolve(__dirname, '../../prisma/dev.db'),
      path.resolve(__dirname, '../../../prisma/dev.db'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return `file:${c}`;
      }
    }
    return `file:${candidates[0]}`;
  }

  // If url is relative SQLite like 'file:./dev.db' or 'file:./prisma/dev.db'
  if (url.startsWith('file:')) {
    const rawPath = url.slice(5);
    if (!path.isAbsolute(rawPath)) {
      const absPath = path.resolve(process.cwd(), rawPath);
      if (fs.existsSync(absPath)) {
        return `file:${absPath}`;
      }
      const prismaDevPath = path.resolve(process.cwd(), 'prisma/dev.db');
      if (fs.existsSync(prismaDevPath)) {
        return `file:${prismaDevPath}`;
      }
    }
  }

  return url;
}

const dbUrl = resolveDbUrl();
if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
}

export const prisma = new PrismaClient(
  dbUrl
    ? {
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      }
    : undefined
);
