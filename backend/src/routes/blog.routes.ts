import { Router } from 'express';
import { getBlogMeta, getPost, listPosts } from '../controllers/blog.controller.js';

const router = Router();

router.get('/', listPosts);
// Static `/meta` must precede the catch-all `/:slug`.
router.get('/meta', getBlogMeta);
router.get('/:slug', getPost);

export default router;
