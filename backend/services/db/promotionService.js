import Voucher from '../../models/Voucher.js';

export const getPromotions = async () => {
  try {
    const activeVouchers = await Voucher.find({ 
      isActive: true, 
      expiryDate: { $gt: Date.now() },
      quantity: { $gt: 0 }
    }).select('code discount description minOrderValue expiryDate');
    
    if (activeVouchers.length === 0) {
      return [{ message: 'Hiện tại chưa có chương trình khuyến mãi nào.' }];
    }
    
    return activeVouchers.map(v => ({
      code: v.code,
      discount: `${v.discount}%`,
      description: v.description,
      minOrderValue: v.minOrderValue,
      expiresAt: v.expiryDate.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [{ error: 'Không thể lấy thông tin khuyến mãi lúc này.' }];
  }
};

export const getBranches = async () => {
  return [
    { name: "Cơ sở 1", address: "Học viện Công nghệ Bưu chính Viễn thông, Hà Đông, Hà Nội", hours: "08:00 - 22:30" },
    { name: "Cơ sở 2", address: "Quận 1, TP. Hồ Chí Minh", hours: "07:00 - 23:00" }
  ];
};
