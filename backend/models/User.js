
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\p{L}\s]+$/u.test(v);
            },
            message: props => `${props.value} không phải là họ tên hợp lệ! Họ tên chỉ được chứa chữ cái và khoảng trắng.`
        }
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (!this.isModified('password')) return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
    phone: { type: String },
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Khác' },
    birthday: { type: Date },
    avatar: { type: String },
    addresses: [
        {
            label: { type: String, default: 'Nhà riêng' },
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
