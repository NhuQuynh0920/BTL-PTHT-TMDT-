const CheckoutItems = ({ items }) => {
  return (
    <div className="bg-white p-4 mt-2">
      <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Danh sách sản phẩm</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              {item.isFlashSale && (
                <span className="absolute bottom-0 left-0 bg-red-500 text-white text-[10px] w-full text-center py-[2px] font-bold">SALE</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-gray-800 font-medium">{item.name}</div>
              <div className="text-gray-500 text-sm mt-1">
                <p>Size: {item.size} | {item.sugarLevel} Đường, {item.iceLevel}</p>
                {item.toppings && item.toppings.length > 0 && <p>Topping: {item.toppings.join(', ')}</p>}
                {item.note && <p className="italic">Ghi chú: {item.note}</p>}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-800">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
              </div>
              <div className="text-gray-500 text-sm">x{item.qty}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutItems;
