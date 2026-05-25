import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import {
  createOrder,
  getOrder,
  listOrders,
  trackOrder,
  cancelOrder,
  requestReturn,
} from '../controllers/orders.controller.js';

const router = Router();

// Public guest tracking by order number + email.
router.get('/track', trackOrder);

// Checkout works for guests and logged-in users.
router.post('/', optionalAuth, createOrder);

// Account-only routes.
router.get('/', requireAuth, listOrders);
router.get('/:id', requireAuth, getOrder);
router.post('/:id/cancel', requireAuth, cancelOrder);
router.post('/:id/return', requireAuth, requestReturn);

export default router;
