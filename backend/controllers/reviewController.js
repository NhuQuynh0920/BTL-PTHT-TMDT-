import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const updateProductRating = async (productId) => {
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const rating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;
    
    await Product.findByIdAndUpdate(productId, {
        rating: Number(rating.toFixed(1)),
        numReviews
    });
};

export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment, image } = req.body;

    const orders = await Order.find({ user: req.user._id, status: 'Delivered' });
    const hasBought = orders.some(order => 
        order.products.some(p => p.product.toString() === productId.toString())
    );

    if (!hasBought) {
        res.status(400);
        throw new Error('Bạn cần mua và nhận hàng thành công để đánh giá sản phẩm này.');
    }

    const alreadyReviewed = await Review.findOne({ productId, userId: req.user._id });
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }
    
    try {
        const review = await Review.create({ productId, userId: req.user._id, userName: req.user.fullName, rating, comment, image });
        await updateProductRating(productId);
        res.status(201).json(review);
    } catch (createErr) {
        if (createErr.code === 11000) {
            res.status(400);
            throw new Error('Bạn đã đánh giá sản phẩm này rồi');
        }
        throw createErr;
    }
});

// @desc    Get user's review for a product
// @route   GET /api/reviews/:productId/me
// @access  Private
export const getMyReview = asyncHandler(async (req, res) => {
    const review = await Review.findOne({ 
        productId: req.params.productId, 
        userId: req.user._id 
    });
    
    if (review) {
        res.json(review);
    } else {
        // Trả về 200 kèm null thay vì 404 để frontend không bị văng lỗi vào catch block không cần thiết
        res.json(null);
    }
});

// @desc    Get all reviews of the logged-in user
// @route   GET /api/reviews/mine/all
// @access  Private
export const getMyAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.user._id });
    res.json(reviews);
});

export const getReviewsByProduct = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1) : 0;
    res.json({ reviews, totalReviews, averageRating });
});

export const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment, image } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (review) {
      if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Không có quyền chỉnh sửa đánh giá này');
      }

      review.rating = rating ?? review.rating;
      review.comment = comment ?? review.comment;
      review.image = image ?? review.image;

      await review.save();
      await updateProductRating(review.productId);
      
      res.json(review);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy đánh giá');
    }
});

export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Không tìm thấy đánh giá');
    }
    if (review.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Không có quyền');
    }
    
    const productId = review.productId;
    await review.deleteOne();
    
    await updateProductRating(productId);
    
    res.json({ message: 'Đã xóa đánh giá' });
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({})
      .populate('productId', 'name')
      .populate('userId', 'name fullName')
      .sort({ createdAt: -1 });

    const mappedReviews = reviews.map(review => ({
      ...review.toObject(),
      product: review.productId,
      user: review.userId
    }));

    res.json(mappedReviews);
});

// @desc    Delete review by admin
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
export const deleteReviewAdmin = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Không tìm thấy đánh giá');
    }
    
    const productId = review.productId;
    await review.deleteOne();
    await updateProductRating(productId);
    
    res.json({ message: 'Admin đã xóa đánh giá thành công' });
});

// @desc    Add admin reply to review
// @route   PUT /api/reviews/admin/:id/reply
// @access  Private/Admin
export const replyToReview = asyncHandler(async (req, res) => {
    const { adminReply } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        res.status(404);
        throw new Error('Không tìm thấy đánh giá');
    }
    
    review.adminReply = adminReply;
    await review.save();
    
    res.json(review);
});
