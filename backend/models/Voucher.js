import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
        default: 'fixed',
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minOrderValue: {
        type: Number,
        required: true,
        default: 0,
    },
    maxDiscount: {
        type: Number, // Only relevant if discountType is percentage
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: 0, // 0 = unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;
