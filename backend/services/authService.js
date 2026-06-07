import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

class AuthService {
    static async loginUser(email, password) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.matchPassword(password))) {
            throw new Error('Sai email hoặc mật khẩu');
        }
        if (!user.isVerified) {
            const error = new Error('Vui lòng xác thực tài khoản qua email trước khi đăng nhập');
            error.requireVerification = true;
            error.email = user.email;
            throw error;
        }
        return user;
    }

    static async registerUser(data) {
        const { fullName, email, password } = data;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('Email đã được sử dụng');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetPasswordOtpExpires = Date.now() + 5 * 60 * 1000;

        const user = await User.create({
            fullName,
            email,
            password,
            isVerified: false,
            resetPasswordOtp: otp,
            resetPasswordOtpExpires
        });

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">MoRa Tea</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #333; margin-top: 0;">Xin chào, ${user.fullName}!</h2>
                    <p style="color: #555; line-height: 1.6; font-size: 16px;">
                        Mã OTP xác thực tài khoản của bạn tại <strong>MoRa Tea</strong> là:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <strong style="font-size: 32px; color: #3498db; letter-spacing: 8px; background: #f4f6f8; padding: 15px 30px; border-radius: 8px; display: inline-block;">${otp}</strong>
                    </div>
                    <p style="color: #555; line-height: 1.6; font-size: 16px;">
                        Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.
                    </p>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Xác thực tài khoản - MoRa Tea',
                message: `Mã OTP của bạn là: ${otp}`,
                html: htmlTemplate,
            });
        } catch (error) {
            await user.deleteOne();
            throw new Error('Lỗi khi gửi email OTP, vui lòng thử lại sau');
        }

        return user;
    }

    static async verifyAccountOtp(email, otp) {
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        user.isVerified = true;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();

        return user;
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại trong hệ thống');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">MoRa Tea</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #333; margin-top: 0;">Xin chào, ${user.fullName || 'bạn'}!</h2>
                    <p style="color: #555; line-height: 1.6; font-size: 16px;">
                        Bạn nhận được email này vì bạn đã yêu cầu khôi phục mật khẩu.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <strong style="font-size: 32px; color: #3498db; letter-spacing: 8px; background: #f4f6f8; padding: 15px 30px; border-radius: 8px; display: inline-block;">${otp}</strong>
                    </div>
                    <p style="color: #555; line-height: 1.6; font-size: 16px;">
                        Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.
                    </p>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Mã OTP đặt lại mật khẩu - MoRa Tea',
                message: `Mã OTP của bạn là: ${otp}`,
                html: htmlTemplate,
            });
        } catch (error) {
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpires = undefined;
            await user.save();
            throw new Error('Không thể gửi email, vui lòng thử lại sau');
        }

        return true;
    }

    static async verifyOtp(email, otp) {
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        return true;
    }

    static async resetPassword(email, otp, newPassword) {
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Hết phiên làm việc, vui lòng lấy mã OTP mới');
        }

        // UX improvement: if reset password succeeds, user is automatically verified
        if (!user.isVerified) {
            user.isVerified = true;
        }

        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();

        return user;
    }
}

export default AuthService;
