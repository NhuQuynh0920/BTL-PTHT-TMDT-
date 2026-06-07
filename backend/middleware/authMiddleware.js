import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token = req.cookies.jwt;
    console.log(`[Auth Debug] Path: ${req.path}`);
    console.log(`[Auth Debug] Cookie token exists: ${!!token}`);
    console.log(`[Auth Debug] Auth Header: ${req.headers.authorization}`);

    // Fallback if needed for testing via Postman
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Phiên làm việc hết hạn, vui lòng đăng nhập lại' });
    }
};

const admin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Bạn không có quyền quản trị viên' });
};

export { protect, admin };
