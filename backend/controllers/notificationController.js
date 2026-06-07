import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// @desc    Get aggregated notifications
// @route   GET /api/notifications
// @access  Private/Admin
export const getNotifications = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 0; // 0 = lấy tất cả

    // 1. Lấy tất cả đơn hàng Pending hoặc Processing mới nhất
    const pendingOrdersQuery = Order.find({ status: { $in: ['Pending', 'Processing'] } })
        .sort({ createdAt: -1 })
        .populate('user', 'name fullName');
    const pendingOrders = await pendingOrdersQuery;

    // 2. Lấy tất cả đánh giá chưa được admin trả lời mới nhất
    const unrepliedReviews = await Review.find({ 
        $or: [
            { adminReply: '' },
            { adminReply: null },
            { adminReply: { $exists: false } }
        ]
    })
        .sort({ createdAt: -1 })
        .populate('productId', 'name')
        .populate('userId', 'name fullName');

    // 3. Chuẩn hóa thành định dạng Notification
    let notifications = [];

    pendingOrders.forEach(order => {
        const isPaid = order.paymentStatus === 'Paid';
        notifications.push({
            id: order._id.toString() + (isPaid ? '-paid' : '-pending'),
            type: 'order',
            title: isPaid ? 'Thanh toán thành công' : 'Đơn hàng mới',
            message: isPaid 
                ? `Đơn hàng #${(order.orderCode || '').split('-')[1] || order._id.toString().slice(-5).toUpperCase()} của khách hàng ${order.user?.name || order.user?.fullName || 'Khách vãng lai'} đã thanh toán thành công. Đang chờ pha chế.`
                : `Khách hàng ${order.user?.name || order.user?.fullName || 'Khách vãng lai'} vừa đặt một đơn hàng trị giá ${(order.totalPrice || 0).toLocaleString()}đ.`,
            createdAt: order.createdAt || new Date(),
            link: '/admin/orders'
        });
    });

    unrepliedReviews.forEach(review => {
        notifications.push({
            id: review._id.toString(),
            type: 'review',
            title: 'Đánh giá mới',
            message: `Sản phẩm "${review.productId?.name}" vừa nhận được đánh giá ${review.rating} sao từ khách hàng.`,
            createdAt: review.createdAt || new Date(),
            link: '/admin/reviews'
        });
    });

    // Sắp xếp giảm dần theo thời gian
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Áp dụng giới hạn nếu có (limit > 0), ngược lại trả về tất cả
    const total = notifications.length;
    if (limit > 0) {
        notifications = notifications.slice(0, limit);
    }

    // Tính tổng số lượng
    const totalPendingOrders = await Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } });
    const totalUnrepliedReviews = await Review.countDocuments({ 
        $or: [
            { adminReply: '' },
            { adminReply: null },
            { adminReply: { $exists: false } }
        ]
    });
    
    const unreadCount = totalPendingOrders + totalUnrepliedReviews;

    res.json({
        notifications,
        unreadCount,
        total
    });
});
