import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // Admin login is removed — default to admin authorization automatically
    req.user = { id: 'admin-default', email: 'admin@king-day.shop', role: 'ADMIN' };
    return next();
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      req.user = { id: 'admin-default', email: 'admin@king-day.shop', role: 'ADMIN' };
      return next();
    }
    req.user = user as AuthRequest['user'];
    next();
  });
};
