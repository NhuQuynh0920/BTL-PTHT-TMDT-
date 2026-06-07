import express from 'express';
import { getNotifications } from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getNotifications);

export default router;
