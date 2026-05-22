import jwt from 'jsonwebtoken';
import { env } from './env.js';

export type Role = 'CUSTOMER' | 'ADMIN';

export interface AccessPayload {
  sub: number; // user id
  email: string;
  role: Role;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: number): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as AccessPayload;
}

export function verifyRefreshToken(token: string): { sub: number } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as { sub: number };
}
