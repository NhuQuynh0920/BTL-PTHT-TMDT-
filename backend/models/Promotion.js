import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;
