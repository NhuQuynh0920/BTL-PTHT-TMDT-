import express from 'express';
import { 
    authUser, 
    registerUser, 
    logoutUser, 
    forgotPassword, 
    verifyOtp, 
    resetPassword,
    verifyAccountOtp
} from '../controllers/authController.js';
import {
    getMyProfile,
    updateMyProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    changeMyPassword
} from '../controllers/userController.js';
import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} from '../controllers/addressController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { registerValidationRules, loginValidationRules, validate } from '../validators/userValidator.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 10 : 100, // 10 in prod, 100 in dev
    message: 'Quá nhiều lần đăng nhập sai từ IP này, vui lòng thử lại sau 15 phút.',
    skipSuccessfulRequests: true, // Don't count successful logins
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth Routes
router.post('/', registerValidationRules(), validate, registerUser);
router.post('/login', loginLimiter, loginValidationRules(), validate, authUser);
router.post('/logout', logoutUser);
router.post('/verify-account', verifyAccountOtp);
router.post('/forgotpassword', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// User Profile Routes
router.route('/profile')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

router.put('/change-password', protect, changeMyPassword);

// User Addresses Routes
router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);

router.route('/addresses/:id')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

// Admin Routes
router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

export default router;
