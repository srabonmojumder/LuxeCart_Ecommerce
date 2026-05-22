import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  addToCart,
  clearCart,
  getCart,
  mergeCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cart.controller.js';

const router = Router();

router.use(requireAuth); // all cart routes require a logged-in user

router.get('/', getCart);
router.post('/', addToCart);
router.post('/merge', mergeCart);
router.patch('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
