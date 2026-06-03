import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createPaymentIntent,
  stripeWebhook,
  getPaymentMethods,
  initSslcommerz,
  sslcommerzSuccess,
  sslcommerzFail,
  sslcommerzCancel,
  sslcommerzIpn,
} from '../controllers/payments.controller.js';

const router = Router();

// Which methods to show on checkout (public).
router.get('/methods', getPaymentMethods);

// Webhook is unauthenticated (verified via Stripe signature) and needs the raw
// body, which is configured in app.ts before the JSON parser.
router.post('/webhook', stripeWebhook);

router.post('/create-intent', requireAuth, createPaymentIntent);

// SSLCommerz (Bangladesh). init is open so guests can pay an existing order;
// success/fail/cancel/ipn are called by SSLCommerz's servers (form-encoded).
router.post('/sslcommerz/init', initSslcommerz);
router.post('/sslcommerz/success', sslcommerzSuccess);
router.get('/sslcommerz/success', sslcommerzSuccess);
router.post('/sslcommerz/fail', sslcommerzFail);
router.get('/sslcommerz/fail', sslcommerzFail);
router.post('/sslcommerz/cancel', sslcommerzCancel);
router.get('/sslcommerz/cancel', sslcommerzCancel);
router.post('/sslcommerz/ipn', sslcommerzIpn);

export default router;
