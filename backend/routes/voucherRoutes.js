import express from 'express';
import { applyVoucher, getVouchers, getVoucherById, createVoucher, updateVoucher, deleteVoucher } from '../controllers/voucherController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyVoucher);
router.route('/').get(protect, admin, getVouchers).post(protect, admin, createVoucher);
router.route('/:id')
  .get(protect, admin, getVoucherById)
  .put(protect, admin, updateVoucher)
  .delete(protect, admin, deleteVoucher);

export default router;
