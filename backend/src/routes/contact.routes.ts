import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendContact } from '../controllers/contact.controller.js';

const router = Router();

// Anti-spam: cap submissions per IP. Generous enough for legit users.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages from this IP — please try again later.' },
});

router.post('/', limiter, sendContact);
export default router;
