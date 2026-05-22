import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  adminCreateCategory,
  adminCreateProduct,
  adminDeleteCategory,
  adminDeleteProduct,
  adminDeleteReview,
  adminDeleteUser,
  adminListOrders,
  adminListProducts,
  adminListReviews,
  adminListUsers,
  adminStats,
  adminUpdateCategory,
  adminUpdateOrderStatus,
  adminUpdateProduct,
  adminUpdateUserRole,
} from '../controllers/admin.controller.js';
import { updateSettings } from '../controllers/settings.controller.js';
import {
  adminCreateCoupon,
  adminDeleteCoupon,
  adminListCoupons,
  adminUpdateCoupon,
} from '../controllers/coupons.controller.js';
import {
  adminCreateBanner,
  adminDeleteBanner,
  adminListBanners,
  adminUpdateBanner,
} from '../controllers/banners.controller.js';
import { adminDeleteSubscriber, adminListSubscribers } from '../controllers/newsletter.controller.js';

const router = Router();

router.use(requireAuth, requireAdmin);

// Store settings
router.put('/settings', updateSettings);

// Coupons
router.get('/coupons', adminListCoupons);
router.post('/coupons', adminCreateCoupon);
router.patch('/coupons/:id', adminUpdateCoupon);
router.delete('/coupons/:id', adminDeleteCoupon);

// Banners
router.get('/banners', adminListBanners);
router.post('/banners', adminCreateBanner);
router.patch('/banners/:id', adminUpdateBanner);
router.delete('/banners/:id', adminDeleteBanner);

// Newsletter
router.get('/newsletter', adminListSubscribers);
router.delete('/newsletter/:id', adminDeleteSubscriber);

// Dashboard
router.get('/stats', adminStats);

// Products
router.get('/products', adminListProducts);
router.post('/products', adminCreateProduct);
router.patch('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Categories
router.post('/categories', adminCreateCategory);
router.patch('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// Orders
router.get('/orders', adminListOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

// Users
router.get('/users', adminListUsers);
router.patch('/users/:id/role', adminUpdateUserRole);
router.delete('/users/:id', adminDeleteUser);

// Reviews moderation
router.get('/reviews', adminListReviews);
router.delete('/reviews/:id', adminDeleteReview);

export default router;
