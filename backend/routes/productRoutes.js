import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload, { optionalUpload } from '../middleware/upload.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/add', protect, admin, optionalUpload('image'), createProduct);
router.post('/', protect, admin, optionalUpload('image'), createProduct);
router.post('/:id/upload-image', protect, admin, upload.single('image'), uploadProductImage);

router.put('/:id', protect, admin, optionalUpload('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
