import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chatAi, chatMessage, getPublicStats, getTestimonials, notifyBackInStock } from '../controllers/public.controller.js';

const router = Router();

// Anti-spam on the chat forwarder (10 messages / 10 min / IP).
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages — please wait a moment.' },
});

// AI chat is chattier (one call per question) — allow more, still IP-bounded.
const aiChatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages — please wait a moment.' },
});

router.get('/stats', getPublicStats);
router.get('/testimonials', getTestimonials);
router.post('/notify-back-in-stock', notifyBackInStock);
router.post('/chat-message', chatLimiter, chatMessage);
router.post('/chat-ai', aiChatLimiter, chatAi);

export default router;
