const CheckoutSummary = ({ subtotal, shippingFee, discount, tip, total }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Tạm tính ({subtotal / 1000}k)</span>
          <span className="font-bold text-gray-800">{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Phí giao hàng</span>
          <span className="font-bold text-gray-800">+{new Intl.NumberFormat('vi-VN').format(shippingFee)}đ</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600">
            <span className="font-medium">Voucher giảm giá</span>
            <span className="font-black">-{new Intl.NumberFormat('vi-VN').format(discount)}đ</span>
          </div>
        )}
        {tip > 0 && (
          <div className="flex justify-between items-center text-sm text-blue-600">
            <span className="font-medium">Tiền tip tài xế</span>
            <span className="font-black">+{new Intl.NumberFormat('vi-VN').format(tip)}đ</span>
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
        <div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng cộng thanh toán</p>
           <p className="text-3xl font-black text-orange-600 tracking-tighter">{new Intl.NumberFormat('vi-VN').format(total)}đ</p>
        </div>
        <div className="bg-orange-50 px-3 py-1 rounded-full">
           <span className="text-[10px] font-black text-orange-500">VAT Đã bao gồm</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
