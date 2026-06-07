const SHOP_ADDRESS = '96A Đ. Trần Phú, Hà Đông, Hà Nội, Việt Nam';

const calculateShippingFee = (distanceKm) => {
  const baseFee = 15000; // Phí cơ bản cho 5km đầu

  if (distanceKm <= 5) {
    return baseFee;
  }

  // Trên 5km, mỗi km cộng thêm 3000đ
  return baseFee + (distanceKm - 5) * 3000;
};

export const getShippingInfo = async (customerAddress) => {
  try {
    // Vì không dùng API bản đồ thực tế, ta sẽ tạo khoảng cách ảo (mock distance).
    // Để khoảng cách nhất quán với cùng một địa chỉ, ta dùng một hàm hash cơ bản.
    let hash = 0;
    const addressStr = (customerAddress || '').toLowerCase();
    for (let i = 0; i < addressStr.length; i++) {
      hash = addressStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Tạo khoảng cách ngẫu nhiên từ 1.0 km đến 12.0 km dựa trên hash của địa chỉ
    const distanceKm = (Math.abs(hash) % 110) / 10 + 1; 

    // Tính phí vận chuyển
    const shippingFee = calculateShippingFee(distanceKm);

    return {
      distanceKm: Number(distanceKm.toFixed(1)),
      shippingFee: Math.round(shippingFee),
      shopAddress: SHOP_ADDRESS,
      customerAddress: customerAddress
    };
  } catch (error) {
    // Fallback an toàn
    return {
      distanceKm: 0,
      shippingFee: 15000,
      shopAddress: SHOP_ADDRESS,
      customerAddress: customerAddress
    };
  }
};
