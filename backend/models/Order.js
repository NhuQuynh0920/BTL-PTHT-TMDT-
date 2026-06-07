import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderCode: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            size: { type: String },
            sugarLevel: { type: String },
            iceLevel: { type: String },
            toppings: [{ type: String }],
            note: { type: String }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        default: 'immediate'
    },
    scheduledTime: {
        type: Date
    },
    doorDelivery: {
        type: Boolean,
        default: false
    },
    cutlery: {
        type: Boolean,
        default: false
    },
    tip: {
        type: Number,
        default: 0
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    distance: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ''
    },
    pointsUsed: {
        type: Number,
        default: 0
    },
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        default: null
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'VNPAY', 'BANKING'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Waiting Confirmation', 'Paid', 'Failed'],
        default: 'Pending'
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

// Create indexes for faster query performance (Admin dashboard & User history)
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
