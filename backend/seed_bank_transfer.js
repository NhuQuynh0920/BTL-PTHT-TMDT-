import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaymentMethod from './models/PaymentMethod.js';

dotenv.config();

const seedBankTransfer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const methodExists = await PaymentMethod.findOne({ name: 'Chuyển khoản ngân hàng' });
        if (!methodExists) {
            await PaymentMethod.create({
                name: 'Chuyển khoản ngân hàng',
                icon: '🏦',
                description: 'Chuyển khoản qua quét mã QR (VietQR)',
                isActive: true
            });
            console.log('Đã thêm phương thức Chuyển khoản ngân hàng thành công.');
        } else {
            console.log('Phương thức Chuyển khoản ngân hàng đã tồn tại.');
        }
        process.exit();
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

seedBankTransfer();
