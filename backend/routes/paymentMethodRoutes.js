import express from 'express';
import { getPaymentMethods } from '../controllers/paymentMethodController.js';

const router = express.Router();

router.get('/', getPaymentMethods);

export default router;
