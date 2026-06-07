import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import ReviewModal from "./ReviewModal.jsx";

const ProductReviews = ({ productId, onReviewDataChanged }) => {
  const { user } = useContext(AuthContext);
  const [reviewsData, setReviewsData] = useState({ reviews: [], totalReviews: 0, averageRating: 0 });
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/${productId}`);
      setReviewsData(data);
      if (onReviewDataChanged) onReviewDataChanged();
    } catch (error) {
      console.error("Lỗi tải đánh giá", error);
    }
  };

  const fetchMyReview = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/reviews/${productId}/me`, config);
      setMyReview(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setMyReview(null); // Not reviewed yet
      }
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchReviews(), fetchMyReview()]);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) loadAllData();
  }, [productId, user]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await axios.delete(`/api/reviews/${reviewId}`, { headers: { Authorization: `Bearer ${user.token}` } });
      loadAllData();
    } catch (err) {
      alert("Lỗi xóa: " + (err.response?.data?.message || err.message));
    }
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    loadAllData();
  };

  if (loading) return (
    <div className="flex justify-center py-10">
       <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto px-6 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Đánh giá từ khách hàng</h3>
            <p className="text-gray-400 font-bold mt-1">Khám phá trải nghiệm thực tế về sản phẩm này</p>
         </div>
         
         <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-3xl border border-orange-100/50">
           <div className="text-5xl font-black text-orange-600 drop-shadow-sm leading-none">{reviewsData.averageRating}</div>
           <div>
             <div className="text-orange-400 text-xl tracking-widest">
                {'★'.repeat(Math.round(reviewsData.averageRating || 0))}
                <span className="text-orange-200">{'★'.repeat(5 - Math.round(reviewsData.averageRating || 0))}</span>
             </div>
             <div className="text-[10px] font-black uppercase tracking-widest text-orange-800/60 mt-1">Dựa trên {reviewsData.totalReviews} đánh giá</div>
           </div>
         </div>
      </div>

      {/* Write / Edit Review Section */}
      <div className="mb-12">
        {!user ? (
          <div className="bg-gray-50 p-8 text-center border-2 border-dashed border-gray-200" style={{ borderRadius: '32px' }}>
             <p className="text-gray-500 font-bold mb-4">Bạn đã từng thử món này chưa?</p>
             <a href="/login" className="inline-block bg-white text-orange-600 font-black px-8 py-3 rounded-2xl hover:bg-orange-50 transition-colors shadow-sm border border-gray-100 uppercase tracking-wider text-sm">
                Đăng nhập để đánh giá
             </a>
          </div>
        ) : myReview ? (
          // My Review Card
          <div className="bg-orange-50/30 p-8 relative overflow-hidden border border-orange-100" style={{ borderRadius: '32px' }}>
             <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
             <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 bg-orange-100 inline-block px-3 py-1 rounded-full">Đánh giá của bạn</p>
                   <div className="flex items-center gap-2">
                      <div className="text-orange-500 text-xl tracking-widest">
                         {'★'.repeat(myReview.rating)}
                         <span className="text-orange-200">{'★'.repeat(5 - myReview.rating)}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">• {new Date(myReview.createdAt).toLocaleDateString("vi-VN")}</span>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowModal(true)} className="p-2.5 bg-white text-gray-500 hover:text-orange-600 rounded-xl shadow-sm border border-gray-100 transition-all group" title="Sửa đánh giá">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
                   <button onClick={() => handleDelete(myReview._id)} className="p-2.5 bg-white text-gray-500 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 transition-all group" title="Xóa đánh giá">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
             </div>
             
             <p className="text-gray-800 font-bold leading-relaxed">{myReview.comment}</p>
             
             {myReview.image && (
                <div className="mt-6">
                  <img 
                    src={myReview.image} 
                    alt="My Review" 
                    className="h-24 w-24 object-cover rounded-[20px] shadow-sm border-2 border-white hover:scale-105 transition-transform cursor-zoom-in" 
                    onClick={() => window.open(myReview.image, '_blank')}
                  />
                </div>
             )}

             {myReview.adminReply && (
                <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 relative shadow-sm">
                   <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-orange-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                      MoRa Tea Phản hồi
                   </div>
                   <p className="text-gray-800 text-sm font-bold leading-relaxed mt-2 whitespace-pre-line">{myReview.adminReply}</p>
                </div>
             )}
          </div>
        ) : (
          <div className="bg-[#f8f9fa] p-10 flex flex-col items-center justify-center text-center" style={{ borderRadius: '32px' }}>
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-300 shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-1.236 2.043-2.097 1.398l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.861.645-2.397-.476-2.097-1.398l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
             </div>
             <p className="text-gray-900 font-black text-lg mb-2">Đánh giá sản phẩm</p>
             <p className="text-gray-500 text-sm font-medium mb-6 max-w-sm">Chia sẻ cảm nhận của bạn để giúp những khách hàng khác có sự lựa chọn tốt nhất nhé!</p>
             <button onClick={() => setShowModal(true)} className="bg-orange-600 text-white font-black px-10 py-4 rounded-[20px] shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all transform active:scale-95 uppercase tracking-wider text-xs">
                Viết đánh giá
             </button>
          </div>
        )}
      </div>

      {/* Other Reviews List */}
      <div className="space-y-6 mb-16">
        {reviewsData.reviews.filter(r => r._id !== myReview?._id).length === 0 ? (
           !myReview && <p className="text-gray-400 font-bold italic text-center py-10">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          reviewsData.reviews.filter(r => r._id !== myReview?._id).map(review => (
            <div key={review._id} className="bg-white p-8 border border-gray-100 hover:shadow-xl hover:shadow-orange-50/50 transition-all group relative" style={{ borderRadius: '32px' }}>
              <div className="flex items-start gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-black text-lg flex-shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1">
                    <h5 className="font-black text-gray-900">{review.userName}</h5>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                       <div className="text-orange-400 text-sm tracking-widest">
                          {'★'.repeat(review.rating)}
                          <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                       </div>
                       <span className="text-[10px] font-bold text-gray-400">• {new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                       <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Đã mua hàng
                       </span>
                    </div>
                 </div>
              </div>
              
              <p className="text-gray-700 font-medium leading-relaxed mb-4 pl-16 pr-4">{review.comment}</p>
              
              {review.image && (
                <div className="pl-16">
                  <img 
                    src={review.image} 
                    alt="Review" 
                    className="h-28 w-28 object-cover rounded-[20px] shadow-sm border border-gray-100 cursor-zoom-in hover:scale-105 transition-transform" 
                    onClick={() => window.open(review.image, '_blank')}
                  />
                </div>
              )}
              
              {review.adminReply && (
                <div className="ml-16 mr-4 mt-8 bg-orange-50/60 rounded-2xl p-6 border border-orange-100/60 relative shadow-[0_2px_10px_-3px_rgba(251,146,60,0.15)]">
                   <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-orange-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                      MoRa Tea Phản hồi
                   </div>
                   <p className="text-gray-800 text-sm font-bold leading-relaxed mt-2 whitespace-pre-line">{review.adminReply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ReviewModal 
          productId={productId} 
          user={user} 
          existingReview={myReview} 
          onClose={() => setShowModal(false)} 
          onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
};

export default ProductReviews;
