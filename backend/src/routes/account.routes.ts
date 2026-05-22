import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
  updateProfile,
} from '../controllers/account.controller.js';

const router = Router();

router.use(requireAuth);

router.patch('/profile', updateProfile);
router.get('/addresses', listAddresses);
router.post('/addresses', createAddress);
router.patch('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
