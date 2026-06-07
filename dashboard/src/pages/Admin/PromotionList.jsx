import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get('/api/promotions');
      setPromotions(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài khuyến mãi này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/promotions/${id}`);
        fetchPromotions();
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi xóa bài khuyến mãi');
      }
    }
  };

  const createPromotionHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/promotions', {});
      fetchPromotions();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi tạo mới');
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header">
        <h2>Khuyến Mãi</h2>
        <button className="btn btn-primary" onClick={createPromotionHandler}>
          + Thêm Bài Mới
        </button>
      </div>

      {loading ? (
        <h3>Đang tải...</h3>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>MÃ KHUYẾN MÃI</th>
                <th>TIÊU ĐỀ</th>
                <th>MỨC GIẢM</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo._id}>
                  <td>{promo._id}</td>
                  <td>{promo.title}</td>
                  <td>{promo.discount}</td>
                  <td>
                    <Link to={`/admin/promotions/${promo._id}/edit`} className="btn-icon" style={{ marginRight: '10px' }}>
                      ✏️
                    </Link>
                    <button className="btn-icon" onClick={() => deleteHandler(promo._id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
