import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { env } from '../lib/env.js';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: REFRESH_MAX_AGE,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
}

/** Persist a refresh token (hashed) so it can be rotated/revoked. */
async function issueRefreshToken(userId: number, res: Response) {
  const token = signRefreshToken(userId);
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + REFRESH_MAX_AGE),
    },
  });
  setRefreshCookie(res, token);
}

function publicUser(u: { id: number; email: string; displayName: string | null; role: string; photoURL: string | null }) {
  return { id: u.id, email: u.email, displayName: u.displayName, role: u.role, photoURL: u.photoURL };
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1).max(80),
});

/** POST /api/auth/register */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { email, password, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, 'This email is already registered');

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      displayName,
      cart: { create: {} }, // give every user a cart up front
    },
  });

  await issueRefreshToken(user.id, res);
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  res.status(201).json({ user: publicUser(user), accessToken });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** POST /api/auth/login */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  await issueRefreshToken(user.id, res);
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ user: publicUser(user), accessToken });
});

/** POST /api/auth/refresh — rotates the refresh token. */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw new HttpError(401, 'No refresh token');

  let payload: { sub: number };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearRefreshCookie(res);
    throw new HttpError(401, 'Invalid refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!stored || stored.expiresAt < new Date()) {
    clearRefreshCookie(res);
    throw new HttpError(401, 'Refresh token expired or revoked');
  }

  // Rotate: delete the used token, issue a fresh one.
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new HttpError(401, 'User no longer exists');

  await issueRefreshToken(user.id, res);
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ user: publicUser(user), accessToken });
});

/** POST /api/auth/logout */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  clearRefreshCookie(res);
  res.json({ success: true });
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) throw new HttpError(404, 'User not found');
  res.json({ user: publicUser(user) });
});
