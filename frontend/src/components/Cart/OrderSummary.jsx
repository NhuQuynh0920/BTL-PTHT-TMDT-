const OrderSummary = ({ totalItems, calculateTotal, onCheckout, isLoading }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-20">
      <h3 className="font-bold text-gray-800 text-[17px] mb-4">Tổng quan đơn hàng</h3>
      
      <div className="space-y-3 mb-5 border-b border-dashed border-gray-200 pb-4">
        <div className="flex justify-between items-center text-[14px] text-gray-600">
          <span>Tạm tính ({totalItems} món)</span>
          <span className="font-medium text-gray-800">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
          </span>
        </div>
        
        {/* ShopeeFood usually shows a placeholder for shipping/voucher here before actual checkout */}
        <div className="flex justify-between items-center text-[14px] text-gray-600">
          <span>Phí giao hàng</span>
          <span className="text-gray-400 italic">Tính ở bước sau</span>
        </div>
        <div className="flex justify-between items-center text-[14px] text-gray-600">
          <span>Mã giảm giá</span>
          <span className="text-gray-400 italic">Chọn ở bước sau</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-gray-800 text-[16px]">Tổng thanh toán</span>
        <div className="text-right">
          <span className="font-bold text-orange-500 text-[22px]">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
          </span>
          <p className="text-[11px] text-gray-400 font-normal mt-0.5">(Đã bao gồm VAT nếu có)</p>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        disabled={isLoading || totalItems === 0}
        className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-300 transition-colors uppercase text-[15px]"
      >
        Tiến hành thanh toán
      </button>
    </div>
  );
};

export default OrderSummary;
