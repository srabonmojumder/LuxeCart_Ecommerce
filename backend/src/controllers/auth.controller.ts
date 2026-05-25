import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { env } from '../lib/env.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/auth-mail.js';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const VERIFY_TTL = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL = 60 * 60 * 1000; // 1 hour

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Create a single-use token, store its hash, and return the raw value for the email link. */
async function createAuthToken(userId: number, purpose: 'EMAIL_VERIFY' | 'PASSWORD_RESET', ttlMs: number) {
  const raw = crypto.randomBytes(32).toString('hex');
  await prisma.authToken.create({
    data: { userId, purpose, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + ttlMs) },
  });
  return raw;
}

/** Send (or re-send) a verification email; never throws. */
async function dispatchVerification(user: { id: number; email: string; displayName: string | null }) {
  const token = await createAuthToken(user.id, 'EMAIL_VERIFY', VERIFY_TTL);
  const link = `${env.APP_URL}/verify-email?token=${token}`;
  await sendVerificationEmail(user.email, user.displayName, link);
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

function publicUser(u: {
  id: number;
  email: string;
  displayName: string | null;
  role: string;
  photoURL: string | null;
  emailVerified?: Date | null;
}) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    photoURL: u.photoURL,
    emailVerified: Boolean(u.emailVerified),
  };
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

  void dispatchVerification(user); // fire-and-forget; never blocks signup

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
  if (!user) throw new HttpError(401, 'Invalid email or password');
  if (!user.passwordHash) {
    throw new HttpError(401, 'This account uses Google sign-in. Continue with Google, or reset your password to set one.');
  }
  if (!(await bcrypt.compare(password, user.passwordHash))) {
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

// ----------------------------- Email verification -----------------------------

const tokenSchema = z.object({ token: z.string().min(10) });

/** POST /api/auth/verify-email — confirm an email from the link token. */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'A valid token is required');

  const record = await prisma.authToken.findUnique({ where: { tokenHash: sha256(parsed.data.token) } });
  if (!record || record.purpose !== 'EMAIL_VERIFY' || record.usedAt || record.expiresAt < new Date()) {
    throw new HttpError(400, 'This verification link is invalid or has expired');
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  res.json({ success: true });
});

/** POST /api/auth/resend-verification — re-send the link to the logged-in user. */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) throw new HttpError(404, 'User not found');
  if (user.emailVerified) return res.json({ success: true, alreadyVerified: true });

  await dispatchVerification(user);
  res.json({ success: true });
});

// ----------------------------- Password reset -----------------------------

const forgotSchema = z.object({ email: z.string().email() });

/** POST /api/auth/forgot-password — always returns success (never leaks which emails exist). */
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'A valid email is required');

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = await createAuthToken(user.id, 'PASSWORD_RESET', RESET_TTL);
    const link = `${env.APP_URL}/reset-password?token=${token}`;
    void sendPasswordResetEmail(user.email, user.displayName, link);
  }
  res.json({ success: true });
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/** POST /api/auth/reset-password — set a new password from the link token. */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const record = await prisma.authToken.findUnique({ where: { tokenHash: sha256(parsed.data.token) } });
  if (!record || record.purpose !== 'PASSWORD_RESET' || record.usedAt || record.expiresAt < new Date()) {
    throw new HttpError(400, 'This reset link is invalid or has expired');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: await bcrypt.hash(parsed.data.password, 10) },
    }),
    prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    // Revoke every existing session so a leaked password can't be reused.
    prisma.refreshToken.deleteMany({ where: { userId: record.userId } }),
  ]);
  res.json({ success: true });
});

const changeSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

/** POST /api/auth/change-password — change the logged-in user's password. */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = changeSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten().fieldErrors);

  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) throw new HttpError(404, 'User not found');

  // Google-only accounts have no password yet — let them set one without a current password.
  if (user.passwordHash) {
    const ok = parsed.data.currentPassword && (await bcrypt.compare(parsed.data.currentPassword, user.passwordHash));
    if (!ok) throw new HttpError(400, 'Your current password is incorrect');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 10) },
  });
  res.json({ success: true });
});

// ----------------------------- Google sign-in -----------------------------

const googleSchema = z.object({ credential: z.string().min(10) });

interface GoogleTokenInfo {
  aud: string;
  sub: string;
  email: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
}

/** POST /api/auth/google — sign in / sign up with a Google ID token (from Google Identity Services). */
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!env.GOOGLE_CLIENT_ID) throw new HttpError(503, 'Google sign-in is not configured');
  const parsed = googleSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'A Google credential is required');

  // Verify the ID token with Google (no extra dependency needed).
  const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(parsed.data.credential)}`);
  if (!resp.ok) throw new HttpError(401, 'Invalid Google credential');
  const info = (await resp.json()) as GoogleTokenInfo;
  if (info.aud !== env.GOOGLE_CLIENT_ID) throw new HttpError(401, 'Google credential was issued for another app');
  if (!info.email) throw new HttpError(401, 'Google account has no email');

  // Match an existing user by googleId, then by email; otherwise create one.
  let user = await prisma.user.findFirst({ where: { OR: [{ googleId: info.sub }, { email: info.email }] } });
  if (user) {
    if (!user.googleId || !user.emailVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: info.sub, emailVerified: user.emailVerified ?? new Date() },
      });
    }
  } else {
    user = await prisma.user.create({
      data: {
        email: info.email,
        googleId: info.sub,
        displayName: info.name ?? info.email.split('@')[0],
        photoURL: info.picture ?? null,
        emailVerified: new Date(),
        cart: { create: {} },
      },
    });
  }

  await issueRefreshToken(user.id, res);
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ user: publicUser(user), accessToken });
});
