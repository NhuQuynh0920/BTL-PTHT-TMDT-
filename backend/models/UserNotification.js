import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order_status'],
        default: 'order_status'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String, // trạng thái mới của đơn hàng
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userNotificationSchema.index({ user: 1, createdAt: -1 });

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
export default UserNotification;
