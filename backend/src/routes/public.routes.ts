import { Router } from 'express';
import { getPublicStats, getTestimonials } from '../controllers/public.controller.js';

const router = Router();

router.get('/stats', getPublicStats);
router.get('/testimonials', getTestimonials);

export default router;
