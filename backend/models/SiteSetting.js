import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        default: 'Cà phê nguyên bản đánh thức giác quan'
    },
    heroSubtitle: {
        type: String,
        default: 'Đậm đà hương vị Việt'
    },
    heroDesc: {
        type: String,
        default: 'Sự kết hợp hoàn hảo giữa hạt cà phê Robusta & Arabica thượng hạng được trồng trên những vùng cao nguyên Việt Nam bạt ngàn.'
    },
    heroBtn: {
        type: String,
        default: 'Xem chi tiết →'
    },
    heroLink: {
        type: String,
        default: '/menu/products?category=CaPhe'
    },
    heroBannerLeft: {
        type: String,
        default: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1920&q=80'
    },
    heroBannerRight: {
        type: String,
        default: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1920&q=80'
    },
    contactPhone: {
        type: String,
        default: '1900 6936'
    },
    contactEmail: {
        type: String,
        default: 'hi@moratea.vn'
    },
    contactAddress: {
        type: String,
        default: 'Tầng 3-4 Hub Building, 195/10E Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh'
    },
    openingHours: {
        type: String,
        default: '07:00 - 22:00'
    },
    estimatedWaitTime: {
        type: String,
        default: '15-20 phút'
    }
}, { timestamps: true });

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;
