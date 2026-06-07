import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: { type: String },
  adminReply: { type: String, default: '' }
}, { timestamps: true });

// Prevent user from submitting more than one review per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
