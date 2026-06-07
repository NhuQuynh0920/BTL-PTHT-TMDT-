import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const PromotionEdit = () => {
  const { id: promoId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const { data } = await axios.get(`/api/promotions/${promoId}`);
        setTitle(data.title);
        setDescription(data.description);
        setDiscount(data.discount);
        setBannerImage(data.bannerImage);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPromo();
  }, [promoId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `/api/promotions/${promoId}`,
        { title, description, discount, bannerImage },
        config
      );
      navigate('/promotions');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật bài khuyến mãi');
    }
  };

  return (
    <div className="admin-view">
      <Link to="/promotions" className="btn btn-light mb-3">
        Quay Lại
      </Link>
      <div className="admin-view-header">
        <h2>Chỉnh Sửa Khuyến Mãi</h2>
      </div>

      {loading ? (
        <h3>Đang tải...</h3>
      ) : (
        <form onSubmit={submitHandler} className="admin-form">
          <div className="form-group mb-3">
            <label>Tiêu Đề (Title)</label>
            <input
              type="text"
              placeholder="Ví dụ: Giảm 20% khi mua Trà Sữa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Mức Giảm (Discount Label)</label>
            <input
              type="text"
              placeholder="Ví dụ: 20% OFF hoặc GIẢM 15K"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Ảnh Banner (URL)</label>
            <input
              type="text"
              placeholder="Nhập đường dẫn ảnh từ mạng / Unsplash"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Nội Dung (Description)</label>
            <textarea
              rows="5"
              placeholder="Nhập thể lệ chương trình"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Cập Nhật
          </button>
        </form>
      )}
    </div>
  );
};

export default PromotionEdit;
