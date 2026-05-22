import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';
import { HttpError } from './error.js';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/** Requires a valid access token; attaches req.user. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(new HttpError(401, 'Authentication required'));
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

/** Attaches req.user if a valid token is present, but never rejects. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      /* ignore invalid token for optional routes */
    }
  }
  next();
}

/** Requires an authenticated ADMIN user. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, 'Authentication required'));
  if (req.user.role !== 'ADMIN') return next(new HttpError(403, 'Admin access required'));
  next();
}
