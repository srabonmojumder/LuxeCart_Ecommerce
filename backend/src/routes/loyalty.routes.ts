import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyLoyalty } from '../controllers/loyalty.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMyLoyalty);

export default router;
