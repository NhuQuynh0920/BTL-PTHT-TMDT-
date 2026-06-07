import Voucher from '../models/Voucher.js';

// @desc    Validate and apply a voucher
// @route   POST /api/vouchers/apply
// @access  Private
export const applyVoucher = async (req, res) => {
    const { code, orderValue } = req.body;

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
        return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
    }

    if (!voucher.isActive) {
        return res.status(400).json({ message: 'Mã giảm giá này đã hết hạn hoặc không còn áp dụng' });
    }

    if (new Date() > voucher.expirationDate) {
        return res.status(400).json({ message: 'Mã giảm giá đã quá thời hạn sử dụng' });
    }

    // Check usage limit
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
        return res.status(400).json({ message: 'Mã giảm giá đã đạt giới hạn sử dụng' });
    }

    if (orderValue < voucher.minOrderValue) {
        return res.status(400).json({ message: `Đơn hàng tối thiểu để áp dụng mã này là ${voucher.minOrderValue}đ` });
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discountType === 'fixed') {
        discountAmount = voucher.discountValue;
    } else if (voucher.discountType === 'percentage') {
        discountAmount = (orderValue * voucher.discountValue) / 100;
        if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
            discountAmount = voucher.maxDiscount;
        }
    }

    // Increment usedCount
    voucher.usedCount = (voucher.usedCount || 0) + 1;
    await voucher.save();

    res.json({
        voucherId: voucher._id,
        code: voucher.code,
        discountAmount,
        message: 'Áp dụng mã giảm giá thành công'
    });
};

// @desc    Get all vouchers
// @route   GET /api/vouchers
// @access  Private/Admin
export const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find({});
        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Get voucher by ID
// @route   GET /api/vouchers/:id
// @access  Private/Admin
export const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (voucher) {
            res.json(voucher);
        } else {
            res.status(404).json({ message: 'Voucher không tồn tại' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Voucher không tồn tại' });
    }
};

// @desc    Create a voucher
// @route   POST /api/vouchers
// @access  Private/Admin
export const createVoucher = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expirationDate, isActive } = req.body;

        const voucherExists = await Voucher.findOne({ code: code.toUpperCase() });
        if (voucherExists) {
            return res.status(400).json({ message: 'Mã giảm giá này đã tồn tại' });
        }

        const voucher = new Voucher({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            minOrderValue: minOrderValue || 0,
            maxDiscount: maxDiscount || 0,
            expirationDate,
            isActive: isActive !== undefined ? isActive : true
        });

        const createdVoucher = await voucher.save();
        res.status(201).json(createdVoucher);
    } catch (error) {
        console.error('createVoucher error:', error);
        const message = error.name === 'ValidationError'
            ? Object.values(error.errors).map(e => e.message).join(', ')
            : (error.code === 11000 ? 'Mã giảm giá này đã tồn tại' : (error.message || 'Lỗi server khi tạo voucher'));
        res.status(500).json({ message });
    }
};

// @desc    Update a voucher
// @route   PUT /api/vouchers/:id
// @access  Private/Admin
export const updateVoucher = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expirationDate, isActive } = req.body;
        const voucher = await Voucher.findById(req.params.id);

        if (voucher) {
            voucher.code = code ?? voucher.code;
            voucher.description = description ?? voucher.description;
            voucher.discountType = discountType ?? voucher.discountType;
            voucher.discountValue = discountValue !== undefined && discountValue !== null ? discountValue : voucher.discountValue;
            voucher.minOrderValue = minOrderValue !== undefined && minOrderValue !== null ? minOrderValue : voucher.minOrderValue;
            voucher.maxDiscount = maxDiscount !== undefined ? maxDiscount : voucher.maxDiscount;
            voucher.expirationDate = expirationDate ?? voucher.expirationDate;
            voucher.isActive = isActive !== undefined ? isActive : voucher.isActive;

            const updatedVoucher = await voucher.save();
            res.json(updatedVoucher);
        } else {
            res.status(404).json({ message: 'Không tìm thấy voucher' });
        }
    } catch (error) {
        console.error('updateVoucher error:', error);
        const message = error.name === 'ValidationError'
            ? Object.values(error.errors).map(e => e.message).join(', ')
            : (error.message || 'Lỗi cập nhật voucher');
        res.status(500).json({ message });
    }
};

// @desc    Delete a voucher
// @route   DELETE /api/vouchers/:id
// @access  Private/Admin
export const deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (voucher) {
            await voucher.deleteOne();
            res.json({ message: 'Đã xóa voucher' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy voucher' });
        }
    } catch(error) {
        res.status(404).json({ message: 'Lỗi xóa voucher' });
    }
};
