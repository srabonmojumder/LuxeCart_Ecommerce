import { Router } from 'express';
import { getProduct, getRelatedProducts, listProducts } from '../controllers/products.controller.js';
import { createReview, listReviews } from '../controllers/reviews.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug/reviews', listReviews);
router.post('/:slug/reviews', requireAuth, createReview);

export default router;
