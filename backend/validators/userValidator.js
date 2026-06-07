import { check, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: extractedErrors,
    });
};

export const registerValidationRules = () => {
    return [
        check('fullName')
            .trim()
            .notEmpty()
            .withMessage('Họ tên không được để trống')
            .matches(/^[\p{L}\s]+$/u)
            .withMessage('Họ tên chỉ được chứa chữ cái và khoảng trắng'),
        check('email')
            .trim()
            .isEmail()
            .withMessage('Email không hợp lệ')
            .normalizeEmail(),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
            .withMessage('Mật khẩu phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)')
    ];
};

export const loginValidationRules = () => {
    return [
        check('email')
            .trim()
            .notEmpty()
            .withMessage('Vui lòng nhập email')
            .isEmail()
            .withMessage('Email không hợp lệ')
            .normalizeEmail(),
        check('password')
            .notEmpty()
            .withMessage('Vui lòng nhập mật khẩu')
    ];
};
