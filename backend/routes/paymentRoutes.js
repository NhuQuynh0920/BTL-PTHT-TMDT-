import express from 'express';
import { createVnPayUrl, vnpayReturn } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/vnpay/create').post(protect, createVnPayUrl);
router.route('/vnpay_return').get(vnpayReturn); // vnpay redirects here with GET

export default router;
