import { useState, useEffect } from "react";
import axios from "axios";

// This modal serves both CREATE and EDIT modes.
const ReviewModal = ({ productId, user, existingReview, onClose, onSuccess }) => {
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 5);
  const [comment, setComment] = useState(existingReview ? existingReview.comment : "");
  const [image, setImage] = useState(existingReview ? existingReview.image : "");
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!existingReview;

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("");
      if (file.size > 5 * 1024 * 1024) {
        setError("Chỉ chấp nhận ảnh dưới 5MB");
        e.target.value = null;
        return;
      }
      setIsImageProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsImageProcessing(false);
      };
      reader.onerror = () => {
        setError("Lỗi khi đọc file ảnh");
        setIsImageProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Vui lòng đăng nhập để đánh giá");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (isEditMode) {
        await axios.put(`/api/reviews/${existingReview._id}`, { rating, comment, image }, config);
      } else {
        await axios.post("/api/reviews", { productId, rating, comment, image }, config);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#1a1a1a]/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fadeIn"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
       <div 
        className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl animate-modalIn relative flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ borderRadius: '28px' }}
        onClick={e => e.stopPropagation()}
       >
          {/* Top Bar Edge */}
          <div className="absolute top-0 left-0 w-full h-3 bg-orange-600" style={{ borderTopLeftRadius: '28px', borderTopRightRadius: '28px' }}></div>
          
          {/* Close Button UI */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-gray-50/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-90"
            aria-label="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 md:p-8 flex flex-col items-center text-center mt-2">
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
              {isEditMode ? "Chỉnh sửa đánh giá" : "Đánh giá hương vị"}
            </h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{isEditMode ? "Cập nhật trải nghiệm của bạn" : "Hãy chia sẻ cảm nhận!"}</p>

            <form onSubmit={submitHandler} className="w-full mt-6 space-y-4">
               
               {error && (
                 <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold animate-pulse">
                   {error}
                 </div>
               )}

               {/* Unified Input Frame */}
               <div className="bg-orange-50/30 border border-orange-100 p-5 rounded-3xl space-y-5">
                 
                 {/* Star Rating */}
                 <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button"
                          onClick={() => setRating(star)}
                          className={`text-4xl transition-all transform hover:scale-110 active:scale-90 ${star <= rating ? 'text-orange-500' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-3 py-1 bg-white rounded-full shadow-sm">
                      {rating === 5 ? 'Tuyệt vời, ngon bá cháy!' : rating >= 4 ? 'Khá ngon, rất hài lòng' : rating === 3 ? 'Bình thường, uống được' : rating === 2 ? 'Không ngon lắm' : 'Tệ, cần cải thiện'}
                    </p>
                 </div>

                 {/* Divider */}
                 <div className="h-px w-full bg-orange-100/50"></div>

                 <div className="space-y-2 text-left">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhận xét của bạn</label>
                    <textarea 
                      className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium text-gray-800 outline-none min-h-[80px] resize-none shadow-sm"
                      placeholder="Bạn thấy trà có đậm vị không? Trân châu có dai ngon không?..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                 </div>

                 <div className="space-y-2 text-left">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Hình ảnh (Tùy chọn)</label>
                    <div className="flex items-center gap-4">
                       <label className="flex-1 cursor-pointer bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-2xl py-3 px-4 transition-all text-center shadow-sm">
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                          <span className="text-sm font-bold text-gray-500 hover:text-orange-600">📸 Chọn ảnh từ máy</span>
                       </label>
                       
                       {image && !isImageProcessing && (
                         <div className="relative inline-block">
                           <img src={image} alt="Preview" className="h-12 w-12 object-cover rounded-xl border border-orange-200 shadow-sm" />
                           <button type="button" onClick={() => setImage("")} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md">X</button>
                         </div>
                       )}
                        {isImageProcessing && (
                         <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                           <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                         </div>
                       )}
                    </div>
                 </div>
               </div>

               <div className="pt-2">
                 <button 
                  type="submit" 
                  disabled={loading || isImageProcessing}
                  className="w-full bg-orange-600 text-white font-black py-3.5 rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                 >
                    {loading ? (
                       <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {isEditMode ? 'Đang lưu...' : 'Đang gửi...'}
                       </div>
                    ) : (isEditMode ? 'Lưu thay đổi' : 'Gửi phản hồi cho MoRa')}
                 </button>
               </div>
            </form>
            <div className="h-8 w-full shrink-0"></div>
          </div>
       </div>
    </div>
  );
};

export default ReviewModal;
