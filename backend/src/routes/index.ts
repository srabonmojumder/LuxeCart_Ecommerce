import { Router } from 'express';
import productsRouter from './products.routes.js';
import categoriesRouter from './categories.routes.js';
import authRouter from './auth.routes.js';
import cartRouter from './cart.routes.js';
import wishlistRouter from './wishlist.routes.js';
import accountRouter from './account.routes.js';
import ordersRouter from './orders.routes.js';
import paymentsRouter from './payments.routes.js';
import settingsRouter from './settings.routes.js';
import couponsRouter from './coupons.routes.js';
import bannersRouter from './banners.routes.js';
import newsletterRouter from './newsletter.routes.js';
import contactRouter from './contact.routes.js';
import publicRouter from './public.routes.js';
import blogRouter from './blog.routes.js';
import loyaltyRouter from './loyalty.routes.js';
import contentRouter from './content.routes.js';
import adminRouter from './admin.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/account', accountRouter);
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/settings', settingsRouter);
router.use('/coupons', couponsRouter);
router.use('/banners', bannersRouter);
router.use('/newsletter', newsletterRouter);
router.use('/contact', contactRouter);
router.use('/', publicRouter); // /stats, /testimonials
router.use('/blog', blogRouter);
router.use('/loyalty', loyaltyRouter);
router.use('/content', contentRouter);
router.use('/admin', adminRouter);

export default router;
