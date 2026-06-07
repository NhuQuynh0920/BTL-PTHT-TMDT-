import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import UserNotification from '../models/UserNotification.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const { 
        products, 
        address, 
        phone, 
        paymentMethod, 
        totalPrice,
        deliveryTime,
        scheduledTime,
        doorDelivery,
        cutlery,
        tip,
        shippingFee,
        distance,
        note,
        pointsUsed,
        voucher,
        orderCode
    } = req.body;

    if (products && products.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            products,
            user: req.user._id,
            address,
            phone,
            deliveryTime,
            scheduledTime,
            doorDelivery,
            cutlery,
            tip: tip || 0,
            shippingFee: shippingFee || 0,
            distance: distance || 0,
            note: note || '',
            pointsUsed,
            voucher,
            paymentMethod,
            paymentStatus: 'Pending',
            totalPrice,
            orderCode: orderCode || `MORA-${Date.now()}` // Fallback if frontend doesn't send
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email fullName');

    if (order) {
        // Check if the user is the owner OR is an admin
        if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Không có quyền truy cập đơn hàng này');
        }
    } else {
        res.status(404);
        throw new Error('Đơn hàng không tồn tại');
    }
});

// @desc    Update order status to specific status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const oldStatus = order.status;
        order.status = req.body.status || order.status;
        // Auto-update payment status based on rules
        if (order.paymentMethod === 'COD' && order.status === 'Delivered') {
            order.paymentStatus = 'Paid';
        }

        const updatedOrder = await order.save();

        // Tạo thông báo cho user nếu trạng thái thay đổi
        if (order.status !== oldStatus && order.user) {
            const statusLabels = {
                Processing: 'Đang pha chế',
                Shipped:    'Đang giao hàng',
                Delivered:  'Đã giao thành công',
                Cancelled:  'Đã bị hủy',
            };
            const statusMessages = {
                Processing: `Đơn hàng ${order.orderCode} của bạn đang được pha chế. Vui lòng chờ trong giây lát nhé! ☕`,
                Shipped:    `Đơn hàng ${order.orderCode} đang trên đường đến bạn. Shipper sẽ liên hệ sớm! 🛵`,
                Delivered:  `Đơn hàng ${order.orderCode} đã được giao thành công. Cảm ơn bạn đã tin dùng MoRa Tea! 🎉`,
                Cancelled:  `Đơn hàng ${order.orderCode} đã bị hủy. Liên hệ hỗ trợ nếu bạn cần giúp đỡ.`,
            };
            const label = statusLabels[order.status];
            if (label) {
                await UserNotification.create({
                    user:      order.user,
                    order:     order._id,
                    orderCode: order.orderCode,
                    type:      'order_status',
                    title:     label,
                    message:   statusMessages[order.status],
                    status:    order.status,
                    isRead:    false,
                });
            }
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Cancel order by user (only if status is Pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Đơn hàng không tồn tại');
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Bạn không có quyền hủy đơn hàng này');
    }

    // Only allow cancellation if order is still Pending
    if (order.status !== 'Pending') {
        res.status(400);
        throw new Error('Không thể hủy đơn hàng đang được xử lý hoặc đã giao');
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const newPaymentStatus = req.body.paymentStatus || order.paymentStatus;
        order.paymentStatus = newPaymentStatus;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Đơn hàng không tồn tại');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name fullName').sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get orders by User ID
// @route   GET /api/orders/user/:userId
// @access  Private/Admin
export const getOrdersByUserId = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get sales statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getSalesStats = asyncHandler(async (req, res) => {
    const timeRange = req.query.timeRange || 'week'; // 'week', 'month', 'year', 'day', 'custom'

    // Determine startDate and initialize revenueByDate grouping
    const revenueByDate = {};
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    if (timeRange === 'custom') {
        const queryStart = req.query.startDate ? new Date(req.query.startDate) : new Date();
        const queryEnd = req.query.endDate ? new Date(req.query.endDate) : new Date();
        
        startDate = new Date(queryStart.getFullYear(), queryStart.getMonth(), queryStart.getDate());
        endDate = new Date(queryEnd.getFullYear(), queryEnd.getMonth(), queryEnd.getDate(), 23, 59, 59, 999);

        let loopDate = new Date(startDate);
        while (loopDate <= endDate) {
            revenueByDate[loopDate.toISOString().split('T')[0]] = 0;
            loopDate.setDate(loopDate.getDate() + 1);
        }
    } else if (timeRange === 'year') {
        const currentYear = new Date().getFullYear();
        startDate = new Date(currentYear, 0, 1); // Jan 1st of current year
        endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999); // Dec 31st
        
        // Populate 12 months for current year
        for (let i = 1; i <= 12; i++) {
            const monthStr = i.toString().padStart(2, '0');
            revenueByDate[`${currentYear}-${monthStr}`] = 0;
        }
    } else if (timeRange === 'month') {
        startDate.setDate(startDate.getDate() - 29); // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            revenueByDate[dateString] = 0;
        }
    } else if (timeRange === 'day') {
        const currentDate = new Date();
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        for (let i = 0; i < 24; i++) {
            const hourStr = i.toString().padStart(2, '0');
            revenueByDate[`${hourStr}:00`] = 0;
        }
    } else {
        // default to 'week' (7 days)
        startDate.setDate(startDate.getDate() - 6);
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            revenueByDate[dateString] = 0;
        }
    }

    // Fetch orders only within the selected time range
    const orders = await Order.find({
        status: { $ne: 'Cancelled' },
        createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalRevenue = orders
        .filter(o => o.status === 'Delivered')
        .reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    
    let totalProductsSold = 0;
    const productStats = {};

    orders.forEach(order => {
        // Calculate revenue grouping only if Delivered
        if (order.status === 'Delivered') {
            if (timeRange === 'year') {
                const monthStr = order.createdAt.toISOString().slice(0, 7); // format: YYYY-MM
                if (revenueByDate[monthStr] !== undefined) {
                    revenueByDate[monthStr] += order.totalPrice;
                }
            } else if (timeRange === 'day') {
                const localHour = order.createdAt.getHours().toString().padStart(2, '0');
                const hourKey = `${localHour}:00`;
                if (revenueByDate[hourKey] !== undefined) {
                    revenueByDate[hourKey] += order.totalPrice;
                }
            } else {
                const dateStr = order.createdAt.toISOString().split('T')[0]; // format: YYYY-MM-DD
                if (revenueByDate[dateStr] !== undefined) {
                    revenueByDate[dateStr] += order.totalPrice;
                }
            }
        }

        // Calculate product stats
        order.products.forEach(item => {
            totalProductsSold += item.qty;
            if (productStats[item.name]) {
                productStats[item.name] += item.qty;
            } else {
                productStats[item.name] = item.qty;
            }
        });
    });

    // Top 5 products
    const topProducts = Object.entries(productStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

    res.json({
        totalRevenue,
        totalOrders,
        totalProductsSold,
        topProducts,
        revenueByDate
    });
});

// @desc    Get today's summary statistics
// @route   GET /api/orders/today-stats
// @access  Private/Admin
export const getTodayStats = asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const orders = await Order.find({
        createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const totalRevenue = orders
        .filter(o => o.status === 'Delivered')
        .reduce((acc, order) => acc + order.totalPrice, 0);
        
    const totalOrders = orders.length;

    const statusCounts = {
        Pending: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0
    };

    const productStats = {};
    orders.forEach(order => {
        statusCounts[order.status]++;
        if (order.status !== 'Cancelled') {
            order.products.forEach(item => {
                if (productStats[item.name]) {
                    productStats[item.name] += item.qty;
                } else {
                    productStats[item.name] = item.qty;
                }
            });
        }
    });

    const topProduct = Object.entries(productStats)
        .sort((a, b) => b[1] - a[1])[0] || null;

    res.json({
        totalRevenue,
        totalOrders,
        topProduct: topProduct ? { name: topProduct[0], qty: topProduct[1] } : null,
        statusCounts
    });
});

// @desc    Get total count of pending orders
// @route   GET /api/orders/pending-count
// @access  Private/Admin
export const getPendingOrderCount = asyncHandler(async (req, res) => {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.json({ count });
});
