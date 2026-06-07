import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// @desc    Create VNPAY payment url
// @route   POST /api/payment/vnpay/create
// @access  Private
export const createVnPayUrl = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    
    if (!orderId) {
        res.status(400);
        throw new Error('Thiếu orderId');
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
        res.status(404);
        throw new Error('Đơn hàng không tồn tại');
    }

    let ipAddr = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress || 
                 req.connection.socket.remoteAddress;

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;
    
    if(!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
         res.status(500);
         throw new Error('Chưa cấu hình VNPAY trong .env');
    }

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let bankCode = '';
    let amount = order.totalPrice;
    
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = order.orderCode; // Use orderCode as transaction ref
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + order.orderCode;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    res.json({ url: vnpUrl });
});

// @desc    Handle VNPAY Return URL
// @route   GET /api/payment/vnpay_return
// @access  Public
export const vnpayReturn = asyncHandler(async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = process.env.VNP_HASHSECRET;

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     

    if (secureHash === signed) {
        // Kiểm tra xem dữ liệu trong db có hợp lệ hay không và thông báo kết quả
        let orderCode = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        
        const order = await Order.findOne({ orderCode });
        
        if(order) {
            let frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            if (rspCode === '00') {
                // Thanh toán thành công
                order.paymentStatus = 'Paid';
                order.status = 'Processing';
                await order.save();
                res.redirect(`${frontEndUrl}/payment-result?status=success&orderCode=${orderCode}&amount=${vnp_Params['vnp_Amount']}`);
            } else {
                // Thanh toán thất bại
                order.paymentStatus = 'Failed';
                await order.save();
                res.redirect(`${frontEndUrl}/payment-result?status=failed&orderCode=${orderCode}&amount=${vnp_Params['vnp_Amount']}`);
            }
        } else {
             res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } else {
        res.status(400).json({ message: 'Lỗi chữ ký bảo mật' });
    }
});

