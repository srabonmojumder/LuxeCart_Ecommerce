import { Router } from 'express';
import {
  login,
  logout,
  me,
  refresh,
  register,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  changePassword,
  googleLogin,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

// Tighter limiter for sensitive auth actions (login, password reset, etc.).
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

router.post('/verify-email', verifyEmail);
router.post('/resend-verification', requireAuth, resendVerification);
router.post('/forgot-password', authLimiter, requestPasswordReset);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/change-password', requireAuth, changePassword);

export default router;
