import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
