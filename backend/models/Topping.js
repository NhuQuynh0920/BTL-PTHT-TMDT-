import mongoose from 'mongoose';

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Topping = mongoose.model('Topping', toppingSchema);
export default Topping;
