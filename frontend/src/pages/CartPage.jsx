import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import CartItem from '../components/Cart/CartItem.jsx';
import OrderSummary from '../components/Cart/OrderSummary.jsx';

const CartPage = () => {
  const { cartItems, removeFromCart, changeQty } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center -mt-8 px-4 bg-gray-50">
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-[15px] text-gray-500 mb-8 text-center max-w-sm">
          Hãy xem menu của MoRa Tea và chọn những món đồ uống thật ngon nhé!
        </p>
        <Link 
          to="/menu" 
          className="btn btn-primary"
          style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}
        >
          Khám phá Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f3] min-h-screen pb-28 md:pb-12">
      {/* Mobile Header */}
      <div className="bg-white p-4 sticky top-0 z-30 flex items-center md:hidden border-b border-[#ede0d4] shadow-sm">
        <button onClick={() => navigate('/')} className="text-[#2d1a0e] p-1 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[18px] font-bold text-[#2d1a0e] flex-1 text-center pr-10">Giỏ hàng</h1>
      </div>

      <div className="container mx-auto max-w-5xl md:pt-8 px-0 md:px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">Giỏ hàng ({totalItems} món)</h1>
        
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Cart Items List */}
          <div className="lg:w-[65%] px-3 md:px-0">
            {cartItems.map((item) => (
              <CartItem 
                key={item.cartItemId} 
                item={item} 
                onRemove={removeFromCart} 
                onChangeQty={changeQty} 
              />
            ))}
            
            <Link to="/menu" className="mt-6 block text-center py-3.5 border-2 border-[var(--primary)] text-[var(--primary)] rounded-xl font-bold hover:bg-[var(--primary)] hover:text-white transition-all bg-white shadow-sm hover:shadow-md">
              + Thêm món khác
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-[35%] px-3 md:px-0">
            <OrderSummary 
              totalItems={totalItems} 
              calculateTotal={calculateTotal} 
              onCheckout={checkoutHandler} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#ede0d4] p-4 flex items-center justify-between md:hidden z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="pl-2">
          <div className="text-[13px] text-[#8c7b72] font-semibold mb-1">Tổng thanh toán</div>
          <div className="font-extrabold text-[var(--primary)] text-[22px] leading-none">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
          </div>
        </div>
        <button 
          onClick={checkoutHandler}
          className="btn btn-primary shadow-lg"
          style={{ padding: '0.85rem 1.8rem', borderRadius: '12px' }}
        >
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default CartPage;
