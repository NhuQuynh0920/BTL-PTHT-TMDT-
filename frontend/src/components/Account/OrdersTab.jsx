import { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewModal from '../ReviewModal.jsx';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewItem, setReviewItem] = useState(null); // { orderId, productId, name }

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get('/api/orders/myorders', config),
          axios.get('/api/reviews/mine/all', config).catch(() => ({ data: [] }))
        ]);
        
        setOrders(ordersRes.data);
        setUserReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Delivered': return { label: 'Đã hoàn thành', color: 'bg-green-500', bg: 'bg-green-50 text-green-700' };
      case 'Processing': return { label: 'Đang xử lý', color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' };
      case 'Cancelled': return { label: 'Đã hủy', color: 'bg-red-500', bg: 'bg-red-50 text-red-700' };
      default: return { label: 'Chờ xác nhận', color: 'bg-orange-500', bg: 'bg-orange-50 text-orange-700' };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải đơn hàng...</p>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl font-black text-gray-900">Lịch sử đơn hàng</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-[32px] p-20 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
            </div>
            <p className="text-gray-400 font-bold">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = getStatusInfo(order.status);
            return (
              <div key={order._id} className="bg-white border border-gray-100 rounded-[28px] p-6 md:p-8 hover:shadow-2xl hover:shadow-orange-100/30 transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-10 px-4 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-widest ${status.bg}`}>
                   {status.label}
                </div>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">#{order._id.substring(order._id.length - 8).toUpperCase()}</h3>
                    <p className="text-sm font-medium text-gray-400">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                    <p className="text-2xl font-black text-orange-600">{order.totalPrice?.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                   {order.products.map((item, idx) => (
                     <div key={idx} className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-xs font-bold text-gray-600 truncate max-w-[120px]">{item.name}</span>
                        <span className="text-[10px] font-black text-gray-400">x{item.qty}</span>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                   <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 bg-gray-50 text-gray-600 font-black py-4 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all text-sm border border-transparent hover:border-orange-100"
                   >
                     Xem chi tiết đơn hàng
                   </button>
                   {order.status === 'Delivered' && (
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-orange-50 text-orange-600 font-black py-4 rounded-2xl hover:bg-orange-100 transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Đánh giá sản phẩm
                      </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedOrder(null)}>
           <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-modalIn" onClick={e => e.stopPropagation()}>
              
              <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Chi tiết đơn hàng</h3>
                    <p className="text-gray-400 font-bold text-sm">#{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50">
                       <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Trạng thái</p>
                       <p className="font-black text-orange-600 uppercase text-sm">{getStatusInfo(selectedOrder.status).label}</p>
                    </div>
                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Thời gian đặt</p>
                       <p className="font-bold text-gray-800 text-sm">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm đã đặt</p>
                    <div className="space-y-4">
                        {selectedOrder.products.map((item, idx) => {
                          const review = userReviews.find(r => r.productId.toString() === item.product.toString());
                          
                          return (
                          <div key={idx} className="flex flex-col gap-3 p-5 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors bg-white">
                             <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                   <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[10px] font-black text-orange-400 border border-orange-100 flex-shrink-0">TEA</div>
                                   <div>
                                      <p className="font-black text-gray-900 mb-1">{item.name}</p>
                                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md inline-block">
                                         {item.size} | {item.qty} món
                                      </p>
                                   </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                   <p className="font-black text-gray-900">{(item.price * item.qty).toLocaleString('vi-VN')}đ</p>
                                   {selectedOrder.status === 'Delivered' && !review && (
                                     <button 
                                      onClick={() => setReviewItem({ orderId: selectedOrder._id, productId: item.product, name: item.name })}
                                      className="text-[10px] font-black text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-orange-100 transition-all flex items-center gap-1.5"
                                     >
                                       ⭐ Đánh giá ngay
                                     </button>
                                   )}
                                </div>
                             </div>

                             {/* Render Review block if user has reviewed this item */}
                             {review && (
                                <div className="mt-3 bg-[#fafafa] border border-gray-100 rounded-2xl p-5">
                                   <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                         <div className="flex text-orange-400 text-sm tracking-widest">
                                            {'★'.repeat(review.rating)}
                                            <span className="text-gray-200">{'★'.repeat(5-review.rating)}</span>
                                         </div>
                                         <span className="text-[10px] font-bold text-gray-400">• {new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                                            ✓ Đã đánh giá
                                         </span>
                                         <button 
                                            onClick={() => setReviewItem({ 
                                                orderId: selectedOrder._id, 
                                                productId: item.product, 
                                                name: item.name,
                                                review: review 
                                            })}
                                            className="text-[10px] font-black text-orange-500 hover:text-orange-600 px-2 py-1 rounded-lg uppercase tracking-wider border border-orange-100 hover:bg-orange-50 transition-all"
                                         >
                                            Sửa
                                         </button>
                                      </div>
                                   </div>
                                   
                                   <p className="text-sm font-medium text-gray-800 leading-relaxed mb-4">{review.comment}</p>
                                   
                                   {review.image && (
                                      <img src={review.image} alt="Review" className="h-20 w-20 object-cover rounded-xl border-2 border-white shadow-sm mb-4 cursor-zoom-in hover:scale-105 transition-transform" onClick={() => window.open(review.image, '_blank')} />
                                   )}

                                   {review.adminReply && (
                                      <div className="bg-orange-50/60 border border-orange-100/60 rounded-xl p-4 pt-5 relative mt-4 shadow-[0_2px_10px_-3px_rgba(251,146,60,0.1)]">
                                         <div className="absolute -top-2.5 left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                            MoRa Tea Cảm ơn
                                         </div>
                                         <p className="text-gray-800 text-xs font-bold leading-relaxed mt-1 whitespace-pre-line">{review.adminReply}</p>
                                      </div>
                                   )}
                                </div>
                             )}
                          </div>
                        )})}
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                       <span>Tạm tính</span>
                       <span>{selectedOrder.totalPrice?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                       <span>Phí vận chuyển</span>
                       <span className="text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                       <span className="text-xl font-black text-gray-900">Tổng thanh toán</span>
                       <span className="text-3xl font-black text-orange-600">{selectedOrder.totalPrice?.toLocaleString('vi-VN')}đ</span>
                    </div>
                 </div>

                 <div className="p-8 bg-gray-50 rounded-[32px] space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 flex-shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Giao đến</p>
                           <p className="text-sm font-black text-gray-800 leading-relaxed">{selectedOrder.address}</p>
                           <p className="text-[11px] font-bold text-gray-400 mt-1">SĐT nhận hàng: {selectedOrder.phone}</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 flex-shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Thanh toán</p>
                           <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">{selectedOrder.paymentMethod}</p>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewItem && (
        <ReviewModal
          productId={reviewItem.productId}
          user={JSON.parse(localStorage.getItem('userInfo'))}
          existingReview={reviewItem.review}
          onClose={() => setReviewItem(null)}
          onSuccess={() => {
            const fetchUpdatedReviews = async () => {
              const userInfo = JSON.parse(localStorage.getItem('userInfo'));
              const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
              const res = await axios.get('/api/reviews/mine/all', config).catch(() => ({ data: [] }));
              setUserReviews(res.data);
            };
            fetchUpdatedReviews();
            setReviewItem(null);
            alert("Cảm ơn bạn đã đánh giá sản phẩm!");
          }}
        />
      )}
    </div>
  );
};

export default OrdersTab;
