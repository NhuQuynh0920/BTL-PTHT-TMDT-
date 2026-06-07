import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Search, Trash2, 
  MessageSquare, User, Clock,
  CheckCircle, AlertCircle, Quote,
  Coffee, Send, CornerDownRight, X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/reviews');
      setReviews(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/reviews/admin/${id}`, config);
        toast.success('Đã xóa đánh giá');
        fetchReviews();
      } catch (error) {
        toast.error('Lỗi khi xóa đánh giá');
        console.error(error);
      }
    }
  };

  const submitReplyHandler = async (id, isDelete = false) => {
    if (!isDelete && !replyText.trim()) {
      toast.error('Vui lòng nhập nội dung trả lời');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/reviews/admin/${id}/reply`, { adminReply: isDelete ? '' : replyText }, config);
      toast.success(isDelete ? 'Đã xóa phản hồi' : 'Lưu phản hồi thành công');
      setReplyingId(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      toast.error('Lỗi khi xử lý phản hồi');
      console.error(error);
    }
  };

  const deleteReplyHandler = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      submitReplyHandler(id, true);
    }
  };

  return (
    <div className="space-y-10">
      <div>
         <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Đánh giá Khách hàng</h2>
         <p className="text-mora-primary font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Lắng nghe phản hồi để nâng cao chất lượng dịch vụ</p>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
           {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] border border-slate-50 shadow-premium"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div 
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 10 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-50 group flex flex-col md:flex-row gap-8 items-start relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1.5 h-full bg-mora-primary/10 group-hover:bg-mora-primary transition-colors"></div>
                <div className="absolute right-8 top-8 opacity-[0.03] transform rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                   <Quote className="w-24 h-24" />
                </div>

                <div className="flex flex-col items-center gap-3 w-full md:w-32 shrink-0">
                   <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl shadow-sm">
                      {(review.user?.fullName || review.userName || 'K')[0]}
                   </div>
                   <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-orange-400 fill-current' : 'text-slate-200'}`} />
                      ))}
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-lg font-black text-slate-800 tracking-tight">
                           {review.user?.fullName || review.userName || 'Người dùng ẩn danh'}
                         </h4>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <Clock className="w-3.5 h-3.5" /> {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                         </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button 
                          onClick={() => deleteHandler(review._id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Xóa đánh giá"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                   
                   <div className="bg-slate-50/50 p-6 rounded-3xl relative">
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">"{review.comment}"</p>
                   </div>
                   
                   {!review.adminReply && replyingId !== review._id && (
                     <div className="mt-3 ml-2 flex justify-start">
                        <button 
                          onClick={() => { setReplyingId(review._id); setReplyText(''); }}
                          className="text-xs font-bold text-slate-400 hover:text-mora-primary flex items-center gap-2 transition-colors px-3 py-1.5 rounded-xl hover:bg-mora-primary/5"
                        >
                           <MessageSquare className="w-3.5 h-3.5" /> Thêm phản hồi
                        </button>
                     </div>
                   )}

                   {review.adminReply && replyingId !== review._id ? (
                     <div className="bg-slate-800 p-5 rounded-3xl ml-6 mt-4 relative shadow-md group/reply">
                        <CornerDownRight className="absolute -left-5 top-5 w-4 h-4 text-slate-300" />
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white/90">
                                <User className="w-3.5 h-3.5" />
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">MoRa Tea phản hồi</p>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                             <button 
                               onClick={() => { setReplyingId(review._id); setReplyText(review.adminReply); }}
                               className="text-[10px] font-bold text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                             >
                               SỬA
                             </button>
                             <button 
                               onClick={() => deleteReplyHandler(review._id)}
                               className="text-[10px] font-bold text-white/50 hover:text-red-400 px-2 py-1 rounded bg-white/5 hover:bg-red-500/10 transition-colors"
                             >
                               XÓA
                             </button>
                           </div>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed font-medium">{review.adminReply}</p>
                     </div>
                   ) : replyingId === review._id ? (
                     <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 ml-6 relative bg-white border border-slate-200 p-2 rounded-2xl flex flex-col gap-3 shadow-sm focus-within:border-mora-primary focus-within:ring-4 focus-within:ring-mora-primary/10 transition-all"
                     >
                        <textarea 
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           placeholder="Nhập phản hồi dành cho khách hàng..."
                           className="w-full text-sm p-3 min-h-[80px] focus:outline-none resize-none bg-transparent text-slate-700 placeholder-slate-400 font-medium"
                           autoFocus
                        />
                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 px-1">
                          <button 
                            onClick={() => { setReplyingId(null); setReplyText(''); }} 
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-4 py-2 rounded-lg transition-colors"
                          >
                            Hủy
                          </button>
                          <button 
                            onClick={() => submitReplyHandler(review._id)} 
                            className={`text-xs font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-2 ${replyText.trim() ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                            disabled={!replyText.trim()}
                          >
                            Gửi phản hồi <Send className="w-3 h-3" />
                          </button>
                        </div>
                     </motion.div>
                   ) : null}

                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-50">
                         <Coffee className="w-3.5 h-3.5 text-mora-primary" /> {review.product?.name || 'Sản phẩm đã xóa'}
                      </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {reviews.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
               <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Chưa có đánh giá nào được ghi nhận</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
