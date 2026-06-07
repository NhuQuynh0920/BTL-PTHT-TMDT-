import Promotion from '../models/Promotion.js';

// @desc    Fetch all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({});
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get promotion by ID
// @route   GET /api/promotions/:id
// @access  Public
export const getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (promotion) {
            res.json(promotion);
        } else {
            res.status(404).json({ message: 'Thông tin khuyến mãi không tồn tại' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Thông tin khuyến mãi không tồn tại' });
    }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = async (req, res) => {
    try {
        const promotion = new Promotion({
            title: 'Khuyến mãi mẫu',
            description: 'Mô tả khuyến mãi',
            discount: '10%',
            bannerImage: '/images/sample-banner.jpg',
        });

        const createdPromotion = await promotion.save();
        res.status(201).json(createdPromotion);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo khuyến mãi' });
    }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = async (req, res) => {
    try {
        const { title, description, discount, bannerImage } = req.body;
        const promotion = await Promotion.findById(req.params.id);

        if (promotion) {
            promotion.title = title || promotion.title;
            promotion.description = description || promotion.description;
            promotion.discount = discount || promotion.discount;
            promotion.bannerImage = bannerImage || promotion.bannerImage;

            const updatedPromotion = await promotion.save();
            res.json(updatedPromotion);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Lỗi cập nhật khuyến mãi' });
    }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);

        if (promotion) {
            await promotion.deleteOne();
            res.json({ message: 'Đã xóa khuyến mãi' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
        }
    } catch(error) {
        res.status(404).json({ message: 'Lỗi xóa khuyến mãi' });
    }
};
