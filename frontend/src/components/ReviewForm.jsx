import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ productId, user, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("");
      if (file.size > 10 * 1024 * 1024) {
        setError("Chỉ chấp nhận ảnh dưới 10MB");
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
      await axios.post("/api/reviews", { productId, rating, comment, image }, config);
      setComment("");
      setRating(5);
      setImage("");
      onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-50 border rounded text-center text-gray-600">
        Vui lòng <a href="/login" className="text-orange-600 font-semibold underline">đăng nhập</a> để viết đánh giá.
      </div>
    );
  }

  return (
    <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
      <h4 className="text-xl font-semibold mb-2 text-orange-900">Viết đánh giá của bạn</h4>
      <p className="text-sm text-gray-500 mb-4">Bạn chỉ được phép đánh giá khi đơn hàng mua sản phẩm này đã ở trạng thái &quot;Đã giao&quot;.</p>
      {error && <div className="text-red-500 mb-3 bg-red-50 p-2 rounded">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Số sao (1-5)</label>
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onClick={() => setRating(num)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={num <= rating ? "#f1c40f" : "none"}
                stroke={num <= rating ? "#f1c40f" : "#d1d5db"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          ))}
          <span className="ml-3 text-orange-700 font-medium text-lg">
            {rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Tạm khỏe" : "Không hài lòng"}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nhận xét</label>
        <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-3 border border-gray-300 rounded focus:border-orange-500 focus:outline-none" placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Đính kèm ảnh (Tùy chọn)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
        {isImageProcessing && <p className="text-xs text-orange-500 mt-1">⏳ Đang xử lý ảnh...</p>}
        {image && !isImageProcessing && (
          <div className="mt-2 relative inline-block">
            <img src={image} alt="Preview" className="h-24 w-24 object-cover rounded border border-gray-200" />
            <button type="button" onClick={() => setImage("")} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
          </div>
        )}
      </div>
      <button type="submit" disabled={loading || isImageProcessing} className="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700 transition duration-200 disabled:opacity-50">
        {loading ? "Đang gửi..." : isImageProcessing ? "Đang xử lý ảnh..." : "Gửi đánh giá"}
      </button>
    </form>
  );
};

export default ReviewForm;
