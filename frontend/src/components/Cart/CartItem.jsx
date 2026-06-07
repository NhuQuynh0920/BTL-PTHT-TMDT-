import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onRemove, onChangeQty }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDecrease = () => {
    if (item.qty <= 1) {
      setShowConfirm(true);
    } else {
      onChangeQty(item.cartItemId, item.qty - 1);
    }
  };

  const handleIncrease = () => {
    if (item.qty < 50) {
      onChangeQty(item.cartItemId, item.qty + 1);
    }
  };

  const confirmDelete = () => {
    onRemove(item.cartItemId);
    setShowConfirm(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 relative">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 pr-8">
          <Link to={`/product/${item.product}`}>
            <h3 className="font-semibold text-gray-800 text-[15px] hover:text-orange-500 line-clamp-2 leading-snug">
              {item.name}
            </h3>
          </Link>
          
          <div className="mt-1 text-[13px] text-gray-500 space-y-0.5">
            <p className="flex items-center gap-1">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Size {item.size}</span>
            </p>
            <p>Đường: {item.sugarLevel} • Đá: {item.iceLevel}</p>
            {item.toppings && item.toppings.length > 0 && (
              <p className="text-gray-400">Topping: {item.toppings.join(', ')}</p>
            )}
            {item.note && (
              <p className="text-orange-400 italic">Ghi chú: {item.note}</p>
            )}
          </div>

          <div className="mt-2 font-bold text-orange-500">
             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
          </div>
        </div>
      </div>

      {/* Delete Icon Top Right */}
      <button 
        onClick={() => setShowConfirm(true)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1"
        aria-label="Xóa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Qty Controls Bottom Right */}
      <div className="absolute bottom-4 right-4 flex items-center border border-gray-200 rounded-md overflow-hidden h-7 bg-white">
        <button 
          onClick={handleDecrease}
          className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 border-r border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <span className="w-8 h-full flex items-center justify-center text-[13px] font-medium text-gray-700">
          {item.qty}
        </span>
        <button 
          onClick={handleIncrease}
          className="w-7 h-full flex items-center justify-center text-green-600 hover:bg-green-50 border-l border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-[320px] shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Xóa sản phẩm</h3>
            <p className="text-[15px] text-gray-600 text-center mb-6">
              Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-[15px]"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors text-[15px]"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
