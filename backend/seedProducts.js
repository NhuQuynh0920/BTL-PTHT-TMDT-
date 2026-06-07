import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  // ===== TRÀ SỮA (12 sản phẩm) =====
  { name: 'Trà Sữa MoRa Trân Châu', price: 35000, description: 'Trà sữa đậm vị kèm trân châu dai giòn thơm ngon', image: 'https://images.unsplash.com/photo-1544787210-2211d44b5642?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:35000},{size:'L',price:42000}], isMustTry: true },
  { name: 'Matcha Đậu Đỏ', price: 45000, description: 'Matcha Nhật Bản kết hợp đậu đỏ ngọt bùi thơm lừng', image: 'https://images.unsplash.com/photo-1515822338988-184c963f1ec1?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:45000},{size:'L',price:52000}], isMustTry: true },
  { name: 'Trà Sữa Hoàng Kim', price: 38000, description: 'Pha từ trà vàng thượng hạng, vị đậm đà quyến rũ', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:38000},{size:'L',price:45000}] },
  { name: 'Trà Sữa Khoai Môn', price: 40000, description: 'Khoai môn Đà Lạt béo ngậy, màu tím hấp dẫn', image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:40000},{size:'L',price:47000}] },
  { name: 'Trà Sữa Đường Đen', price: 42000, description: 'Đường đen Đài Loan thơm, béo ngậy khó cưỡng', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:42000},{size:'L',price:50000}], isMustTry: true },
  { name: 'Trà Sữa Truyền Thống', price: 32000, description: 'Hương vị trà sữa kinh điển, thanh mát dịu nhẹ', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:32000},{size:'L',price:38000}] },
  { name: 'Trà Sữa MoRa Đặc Biệt', price: 55000, description: 'Công thức độc quyền MoRa, hương vị không nơi nào có', image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaNuong', sizes: [{size:'M',price:55000},{size:'L',price:63000}], isMustTry: true },
  { name: 'Trà Sữa Nướng MoRa', price: 48000, description: 'Sữa nướng thơm béo, hương vị đặc trưng riêng của MoRa', image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaNuong', sizes: [{size:'M',price:48000},{size:'L',price:55000}], isMustTry: true },
  { name: 'Trà Sữa Caramel Nướng', price: 50000, description: 'Caramel đắng nhẹ quyện vào sữa nướng thơm ngon', image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaNuong', sizes: [{size:'M',price:50000},{size:'L',price:58000}] },
  { name: 'Trà Sữa Oolong Kem Muối', price: 52000, description: 'Trà Oolong thanh mát phủ kem muối béo nhẹ', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaNuong', sizes: [{size:'M',price:52000},{size:'L',price:60000}] },
  { name: 'Trà Sữa Chocolate', price: 42000, description: 'Chocolate Bỉ nguyên chất tan chảy trong từng ngụm trà sữa', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:42000},{size:'L',price:49000}] },
  { name: 'Trà Sữa Dâu Tây', price: 40000, description: 'Dâu tây tươi ngọt kết hợp trà sữa mịn béo', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80', category: 'TraSua', subCategory: 'TraSuaTruyenThong', sizes: [{size:'M',price:40000},{size:'L',price:47000}] },

  // ===== TRÀ TRÁI CÂY (10 sản phẩm) =====
  { name: 'Trà Đào Cam Sả', price: 39000, description: 'Thanh mát giải nhiệt mùa hè với đào, cam, sả tươi', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:39000},{size:'L',price:45000}], isMustTry: true },
  { name: 'Trà Vải Nhãn', price: 38000, description: 'Vải nhãn Hưng Yên ngọt mát, thơm dịu tự nhiên', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:38000},{size:'L',price:44000}] },
  { name: 'Trà Chanh Leo Việt Quất', price: 42000, description: 'Chanh leo chua nhẹ, việt quất tím đẹp mắt', image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:42000},{size:'L',price:48000}], isMustTry: true },
  { name: 'Trà Dứa Bạc Hà', price: 37000, description: 'Dứa tươi ngọt chua kết hợp bạc hà thơm mát', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:37000},{size:'L',price:43000}] },
  { name: 'Trà Xoài Chanh', price: 40000, description: 'Xoài Cát Hòa Lộc chín mọng, chua ngọt hài hòa', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:40000},{size:'L',price:46000}] },
  { name: 'Trà Dưa Hấu Mint', price: 38000, description: 'Dưa hấu mùa hè tươi mát, thêm mint lạnh sảng khoái', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:38000},{size:'L',price:44000}] },
  { name: 'Trà Táo Quế', price: 39000, description: 'Táo đỏ thơm ngọt quyện với quế ấm nồng', image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:39000},{size:'L',price:45000}] },
  { name: 'Trà Lựu Hoa Hồng', price: 45000, description: 'Lựu đỏ tươi, cánh hoa hồng lãng mạn và thơm ngát', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:45000},{size:'L',price:52000}] },
  { name: 'Trà Kiwi Chanh Leo', price: 41000, description: 'Kiwi xanh tươi chua ngọt, kết hợp chanh leo nhiệt đới', image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:41000},{size:'L',price:48000}] },
  { name: 'Trà Bưởi Gừng', price: 37000, description: 'Bưởi Năm Roi thanh chua, gừng tươi ấm nồng tốt cho sức khỏe', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80', category: 'TraTraiCay', sizes: [{size:'M',price:37000},{size:'L',price:43000}] },

  // ===== CÀ PHÊ (10 sản phẩm) =====
  { name: 'Cà Phê Sữa Đá', price: 35000, description: 'Cà phê Robusta đậm đà, sữa ngọt béo kiểu Việt Nam', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:35000},{size:'L',price:42000}], isMustTry: true },
  { name: 'Bạc Xỉu', price: 32000, description: 'Cà phê nhẹ nhàng nhiều sữa, thích hợp cho người mới uống cà phê', image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d3?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:32000},{size:'L',price:38000}] },
  { name: 'Cold Brew MoRa', price: 48000, description: 'Ủ lạnh 24 giờ, hương vị đậm sâu, không đắng gắt', image: 'https://images.unsplash.com/photo-1504627298434-2b1268f4c94f?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:48000},{size:'L',price:55000}], isMustTry: true },
  { name: 'Cappuccino', price: 52000, description: 'Espresso Arabica, sữa tươi phủ bọt mịn theo phong cách Ý', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:52000},{size:'L',price:60000}] },
  { name: 'Latte Caramel', price: 55000, description: 'Caramel thơm ngọt hòa quyện cùng espresso và sữa tươi', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:55000},{size:'L',price:62000}] },
  { name: 'Cà Phê Cốt Dừa', price: 45000, description: 'Cà phê Việt đậm đà kết hợp nước cốt dừa béo ngậy', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:45000},{size:'L',price:52000}], isMustTry: true },
  { name: 'Americano Đá', price: 40000, description: 'Espresso pha loãng với nước, uống đá thanh mát sảng khoái', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:40000},{size:'L',price:47000}] },
  { name: 'Mocha Đá', price: 52000, description: 'Chocolate, espresso và sữa tươi - bộ ba hoàn hảo', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:52000},{size:'L',price:60000}] },
  { name: 'Cà Phê Trứng', price: 45000, description: 'Trứng gà đánh bông mịn phủ lên cà phê đậm đà kiểu Hà Nội', image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:45000},{size:'L',price:52000}] },
  { name: 'Espresso Tonic', price: 50000, description: 'Espresso rót vào nước tonic sủi bọt - xu hướng cà phê hiện đại', image: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=500&q=80', category: 'CaPhe', sizes: [{size:'M',price:50000},{size:'L',price:58000}] },

  // ===== KHÁC (10 sản phẩm) =====
  { name: 'Bánh Mochi Matcha', price: 25000, description: 'Bánh mochi mềm dẻo nhân kem matcha thơm ngon', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80', category: 'Khac', subCategory: 'BanhNgot', sizes: [{size:'1 cái',price:25000},{size:'3 cái',price:65000}] },
  { name: 'Bánh Tiramisu', price: 45000, description: 'Tiramisu Ý truyền thống, mềm xốp tan chảy trong miệng', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', category: 'Khac', subCategory: 'BanhNgot', sizes: [{size:'1 phần',price:45000}], isMustTry: true },
  { name: 'Bánh Croissant Bơ', price: 30000, description: 'Croissant bơ Pháp giòn tan, thơm béo tươi mỗi ngày', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', category: 'Khac', subCategory: 'BanhNgot', sizes: [{size:'1 cái',price:30000}] },
  { name: 'Bánh Cheesecake Dâu', price: 48000, description: 'Cheesecake New York mịn béo, topping dâu tươi đỏ mọng', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80', category: 'Khac', subCategory: 'BanhNgot', sizes: [{size:'1 phần',price:48000}] },
  { name: 'Bánh Waffle Mật Ong', price: 35000, description: 'Waffle giòn xốp, rưới mật ong thơm và bơ tan chảy', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80', category: 'Khac', subCategory: 'BanhNgot', sizes: [{size:'1 phần',price:35000}] },
  { name: 'Cà Phê Rang Xay MoRa', price: 120000, description: 'Hạt cà phê Arabica Đà Lạt rang mộc, xay sẵn đóng gói 250g', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80', category: 'Khac', subCategory: 'CaPheDongGoi', sizes: [{size:'250g',price:120000},{size:'500g',price:220000}] },
  { name: 'Trà Oolong Túi Lọc', price: 85000, description: 'Trà Oolong Đài Loan cao cấp, hộp 20 túi lọc tiện lợi', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80', category: 'Khac', subCategory: 'CaPheDongGoi', sizes: [{size:'Hộp 20 túi',price:85000}] },
  { name: 'Bột Matcha Latte', price: 150000, description: 'Matcha Nhật Bản xay mịn, pha latte ngay tại nhà', image: 'https://images.unsplash.com/photo-1515822338988-184c963f1ec1?w=500&q=80', category: 'Khac', subCategory: 'CaPheDongGoi', sizes: [{size:'100g',price:150000}] },
  { name: 'Ly Giữ Nhiệt MoRa', price: 250000, description: 'Ly inox 304 giữ nhiệt 12 giờ, in logo MoRa Tea độc quyền', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', category: 'Khac', subCategory: 'DoLuuNiem', sizes: [{size:'350ml',price:250000},{size:'500ml',price:290000}] },
  { name: 'Túi Vải Canvas MoRa', price: 95000, description: 'Túi canvas tái chế thân thiện môi trường, in họa tiết MoRa Tea', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', category: 'Khac', subCategory: 'DoLuuNiem', sizes: [{size:'One Size',price:95000}] },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Đã xóa sản phẩm cũ');

    const inserted = await Product.insertMany(
      products.map(p => ({
        ...p,
        rating: +(Math.random() * 2 + 3).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isAvailable: true,
      }))
    );

    console.log(`🎉 Đã thêm ${inserted.length} sản phẩm thành công!`);
    process.exit();
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
};

seed();
