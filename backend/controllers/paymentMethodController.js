import PaymentMethod from '../models/PaymentMethod.js';

// @desc    Get all active payment methods
// @route   GET /api/payment-methods
// @access  Public
export const getPaymentMethods = async (req, res) => {
    const methods = await PaymentMethod.find({ isActive: true });
    res.json(methods);
};
