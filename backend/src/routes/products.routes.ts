import { Router } from 'express';
import { getBestsellers, getProduct, getRelatedProducts, listProducts } from '../controllers/products.controller.js';
import { createReview, listReviews } from '../controllers/reviews.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
// Static routes must precede the catch-all "/:slug".
router.get('/bestsellers', getBestsellers);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug/reviews', listReviews);
router.post('/:slug/reviews', requireAuth, createReview);

export default router;
