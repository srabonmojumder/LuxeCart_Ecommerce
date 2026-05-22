import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createPaymentIntent, stripeWebhook } from '../controllers/payments.controller.js';

const router = Router();

// Webhook is unauthenticated (verified via Stripe signature) and needs the raw
// body, which is configured in app.ts before the JSON parser.
router.post('/webhook', stripeWebhook);

router.post('/create-intent', requireAuth, createPaymentIntent);

export default router;
