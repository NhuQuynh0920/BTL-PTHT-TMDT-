import asyncHandler from 'express-async-handler';
import UserNotification from '../models/UserNotification.js';

// @desc    Lấy danh sách thông báo của user đang đăng nhập
// @route   GET /api/user-notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await UserNotification.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ notifications, unreadCount });
});

// @desc    Đánh dấu một thông báo là đã đọc
// @route   PUT /api/user-notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res) => {
    const notif = await UserNotification.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!notif) {
        res.status(404);
        throw new Error('Thông báo không tồn tại');
    }

    notif.isRead = true;
    await notif.save();
    res.json({ success: true });
});

// @desc    Đánh dấu tất cả thông báo là đã đọc
// @route   PUT /api/user-notifications/read-all
// @access  Private
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await UserNotification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    );
    res.json({ success: true });
});
