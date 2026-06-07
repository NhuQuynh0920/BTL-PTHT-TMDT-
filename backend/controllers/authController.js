import asyncHandler from 'express-async-handler';
import AuthService from '../services/authService.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await AuthService.loginUser(email, password);
        generateToken(res, user._id, rememberMe);
        res.json({
            success: true,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(error.requireVerification ? 403 : 401).json({ 
            success: false,
            message: error.message,
            requireVerification: error.requireVerification,
            email: error.email
        });
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    try {
        const user = await AuthService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Tài khoản đã được tạo. Vui lòng kiểm tra email để lấy mã OTP xác thực.',
            email: user.email
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Verify account OTP
// @route   POST /api/users/verify-account
// @access  Public
export const verifyAccountOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await AuthService.verifyAccountOtp(email, otp);
        generateToken(res, user._id, true);
        res.json({
            success: true,
            message: 'Xác thực tài khoản thành công',
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
};

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        await AuthService.forgotPassword(email);
        res.json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    try {
        await AuthService.verifyOtp(email, otp);
        res.json({ success: true, message: 'Mã OTP hợp lệ' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        // user is automatically verified during this process inside the service
        await AuthService.resetPassword(email, otp, newPassword);
        // We do not auto-login via JWT anymore as per UX best practices (redirect to login page instead)
        // so we don't generateToken here.
        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại.'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
