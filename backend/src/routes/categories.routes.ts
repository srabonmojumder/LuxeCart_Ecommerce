import { Router } from 'express';
import { getCategory, listCategories } from '../controllers/categories.controller.js';

const router = Router();

router.get('/', listCategories);
router.get('/:slug', getCategory);

export default router;
