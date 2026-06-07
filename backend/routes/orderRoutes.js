import express from 'express';
import { 
    addOrderItems, 
    getOrderById, 
    updateOrderStatus, 
    cancelOrder,
    getMyOrders, 
    getOrders, 
    getOrdersByUserId, 
    getSalesStats,
    getTodayStats,
    getPendingOrderCount,
    updatePaymentStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Personal Order routes (Protect only)
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
// Admin Order routes (Protect + Admin)
router.route('/all').get(protect, admin, getOrders);
router.route('/pending-count').get(protect, admin, getPendingOrderCount);
router.route('/stats').get(protect, admin, getSalesStats);
router.route('/today-stats').get(protect, admin, getTodayStats);
router.route('/user/:userId').get(protect, admin, getOrdersByUserId);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/payment-status').put(protect, admin, updatePaymentStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

// Personal Order ID route (Protect only, MUST BE AT THE BOTTOM to prevent shadowing)
router.route('/:id').get(protect, getOrderById); // Ownership check in controller

export default router;
