import express from 'express';
import { createReview, getReviewsByProduct, updateReview, deleteReview, getAllReviews, deleteReviewAdmin, getMyReview, getMyAllReviews, replyToReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, admin, getAllReviews);
router.get('/mine/all', protect, getMyAllReviews); // Must be before /:productId to avoid route collision
router.get('/:productId', getReviewsByProduct);
router.get('/:productId/me', protect, getMyReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.delete('/admin/:id', protect, admin, deleteReviewAdmin);
router.put('/admin/:id/reply', protect, admin, replyToReview);

export default router;
