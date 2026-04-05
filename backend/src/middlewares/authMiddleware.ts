import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import ApiError from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // Syntax precisely verifies 'Bearer <token>' mapping safely gracefully resolving out
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
};
