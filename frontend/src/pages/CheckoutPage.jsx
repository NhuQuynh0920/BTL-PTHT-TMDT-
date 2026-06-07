import { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import axios from 'axios';

import CheckoutAddress from '../components/Checkout/CheckoutAddress.jsx';
import CheckoutTime from '../components/Checkout/CheckoutTime.jsx';
import CheckoutItems from '../components/Checkout/CheckoutItems.jsx';

import CheckoutVoucher from '../components/Checkout/CheckoutVoucher.jsx';
import CheckoutTip from '../components/Checkout/CheckoutTip.jsx';
import CheckoutOptions from '../components/Checkout/CheckoutOptions.jsx';
import CheckoutPayment from '../components/Checkout/CheckoutPayment.jsx';
import CheckoutSummary from '../components/Checkout/CheckoutSummary.jsx';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Address
  const [addressObj, setAddressObj] = useState({
    name: user?.name || '',
    phone: '',
    address: ''
  });

  // Dynamic Shipping
  const [shippingFee, setShippingFee] = useState(0);
  const [distance, setDistance] = useState(0);

  // States
  const [deliveryTime, setDeliveryTime] = useState('immediate');
  const [doorDelivery, setDoorDelivery] = useState(false);
  const [cutlery, setCutlery] = useState(false);
  const [note, setNote] = useState('');
  const [tip, setTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Generate a unique order code for this checkout session
  const orderCode = useMemo(() => {
    return `MORA-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0 && !orderSuccess) {
      // Nếu giỏ hàng trống và chưa đặt hàng thành công, đẩy về menu
      navigate('/menu');
    }
  }, [navigate, user, cartItems.length, orderSuccess]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  
  const total = useMemo(() => {
    return Math.max(0, subtotal + shippingFee - discount + tip);
  }, [subtotal, shippingFee, discount, tip]);

  const handleShippingUpdate = (fee, dist) => {
    setShippingFee(fee);
    setDistance(dist);
  };

  const handleApplyVoucher = async (code) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/vouchers/apply', { code, orderValue: subtotal }, config);
      setAppliedVoucher(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi áp dụng voucher');
    }
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) return;
    if (!addressObj.phone || !addressObj.address) {
      setMessage('Vui lòng cập nhật số điện thoại và địa chỉ giao hàng.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const products = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        price: item.price,
        size: item.size,
        sugarLevel: item.sugarLevel,
        iceLevel: item.iceLevel,
        toppings: item.toppings,
        note: item.note,
      }));

      const { data: createdOrder } = await axios.post('/api/orders', {
        orderCode,
        products,
        address: addressObj.address,
        phone: addressObj.phone,
        paymentMethod,
        totalPrice: total,
        deliveryTime,
        doorDelivery,
        cutlery,
        note,
        tip,
        shippingFee,
        distance,
        voucher: appliedVoucher ? appliedVoucher.voucherId : null
      }, config);

      clearCart();
      setLoading(false);
      
      if (paymentMethod === 'VNPAY') {
        const vnpayRes = await axios.post('/api/payment/vnpay/create', { orderId: createdOrder._id }, config);
        if (vnpayRes.data && vnpayRes.data.url) {
          window.location.href = vnpayRes.data.url;
        }
      } else {
        setOrderSuccess(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
       setLoading(false);
       setMessage(error.response?.data?.message || 'Lỗi đặt hàng, vui lòng thử lại sau');
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full animate-fadeIn border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-black text-gray-800 mb-2">Đặt hàng thành công!</h1>
          <p className="text-sm font-medium text-gray-500 mb-8">
            Đơn hàng của bạn đã được ghi nhận. Tài xế sẽ sớm liên hệ giao hàng!
          </p>
          
          <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex items-center justify-between border border-gray-100">
            <span className="text-gray-500 font-medium text-sm">Mã đơn hàng</span>
            <span className="font-black text-gray-800 tracking-wider">{orderCode}</span>
          </div>

          <div className="space-y-3">
             <Link to="/history" className="block w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
               Theo dõi đơn hàng
             </Link>
             <Link to="/" className="block w-full bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
               Quay lại trang chủ
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12 font-sans">
      <div className="container mx-auto max-w-[1200px] pt-8 px-4">
        <h1 className="hidden md:block text-2xl font-black text-gray-800 mb-8 tracking-tight">Thanh toán</h1>
        
        {message && (
          <div className="mb-6 p-5 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center gap-4 animate-shake shadow-sm">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <p className="font-bold text-sm">{message}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE */}
          <div className="lg:w-2/3 space-y-6">
            <CheckoutAddress 
                name={addressObj.name} 
                phone={addressObj.phone} 
                address={addressObj.address} 
                onUpdate={setAddressObj}
                onShippingUpdate={handleShippingUpdate}
            />
            
            {(distance > 0 || shippingFee > 0) && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-[2rem] shadow-lg shadow-blue-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-white border border-blue-400">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Quãng đường giao hàng</p>
                    <p className="text-lg font-black">{distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Phí ship ước tính</p>
                    <p className="text-lg font-black">+{new Intl.NumberFormat('vi-VN').format(shippingFee)}đ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Trạng thái</p>
                    <p className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full shadow-sm">Sẵn sàng giao</p>
                  </div>
                </div>
              </div>
            )}
            
            <CheckoutTime deliveryTime={deliveryTime} setDeliveryTime={setDeliveryTime} />
            <CheckoutItems items={cartItems} />
            <CheckoutOptions 
                doorDelivery={doorDelivery} setDoorDelivery={setDoorDelivery}
                cutlery={cutlery} setCutlery={setCutlery}
                note={note} setNote={setNote}
            />
            <CheckoutTip tip={tip} setTip={setTip} />
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-1/3">
             <div className="sticky top-24 space-y-6">
               <CheckoutVoucher 
                  appliedVoucher={appliedVoucher} 
                  setAppliedVoucher={setAppliedVoucher} 
                  onApply={handleApplyVoucher} 
                  orderValue={subtotal}
               />
               
               <CheckoutPayment 
                  selectedMethod={paymentMethod} 
                  setSelectedMethod={setPaymentMethod}
                  orderCode={orderCode}
                  totalAmount={total}
               />
               
               <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
                 <CheckoutSummary subtotal={subtotal} shippingFee={shippingFee} discount={discount} tip={tip} total={total} />
                 
                 <button 
                    onClick={submitOrder} 
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-orange-500 text-white font-black py-4 mt-6 rounded-2xl shadow-lg shadow-orange-200/50 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none transition-all transform active:scale-95 flex items-center justify-center gap-2"
                 >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ĐANG XỬ LÝ...
                      </>
                    ) : (
                      `ĐẶT HÀNG • ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}`
                    )}
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 flex items-center justify-between md:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.05)] z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Tổng cộng</span>
          <span className="font-black text-orange-500 text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
        </div>
        <button 
          onClick={submitOrder}
          disabled={loading || cartItems.length === 0}
          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-orange-200/50 active:scale-95 transition-all flex items-center justify-center"
        >
          {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
