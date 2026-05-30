import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chatMessage, getPublicStats, getTestimonials, notifyBackInStock } from '../controllers/public.controller.js';

const router = Router();

// Anti-spam on the chat forwarder (10 messages / 10 min / IP).
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages — please wait a moment.' },
});

router.get('/stats', getPublicStats);
router.get('/testimonials', getTestimonials);
router.post('/notify-back-in-stock', notifyBackInStock);
router.post('/chat-message', chatLimiter, chatMessage);

export default router;
