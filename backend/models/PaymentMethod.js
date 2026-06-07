import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export default PaymentMethod;
