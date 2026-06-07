import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ success: true, message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.fullName = req.body.fullName ?? user.fullName;
        user.email = req.body.email ?? user.email;
        user.role = req.body.role ?? user.role;
        user.phone = req.body.phone ?? user.phone;
        user.gender = req.body.gender ?? user.gender;
        user.birthday = req.body.birthday ?? user.birthday;
        user.avatar = req.body.avatar ?? user.avatar;

        const updatedUser = await user.save();

        res.json({
            success: true,
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            birthday: updatedUser.birthday,
            avatar: updatedUser.avatar
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            success: true,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            gender: user.gender,
            birthday: user.birthday,
            avatar: user.avatar
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update logged in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateMyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.fullName = req.body.fullName ?? user.fullName;
        user.phone = req.body.phone ?? user.phone;
        user.gender = req.body.gender ?? user.gender;
        user.birthday = req.body.birthday ?? user.birthday;
        user.avatar = req.body.avatar ?? user.avatar;

        const updatedUser = await user.save();

        res.json({
            success: true,
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            birthday: updatedUser.birthday,
            avatar: updatedUser.avatar
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change logged in user password
// @route   PUT /api/users/change-password
// @access  Private
export const changeMyPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Cập nhật mật khẩu thành công' });
    } else {
        res.status(401);
        throw new Error('Mật khẩu hiện tại không đúng');
    }
});
