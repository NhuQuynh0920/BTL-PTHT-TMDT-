import express from 'express';
import { getToppings, createTopping, updateTopping, deleteTopping } from '../controllers/toppingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getToppings)
    .post(protect, admin, createTopping);

router.route('/:id')
    .put(protect, admin, updateTopping)
    .delete(protect, admin, deleteTopping);

export default router;
