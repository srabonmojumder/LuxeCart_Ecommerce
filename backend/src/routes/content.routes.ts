import { Router } from 'express';
import { getSiteContent } from '../controllers/content.controller.js';

const router = Router();
router.get('/', getSiteContent);
export default router;
