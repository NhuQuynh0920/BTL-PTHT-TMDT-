import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Trash2, Edit, Plus, Ticket, Lock, Unlock } from 'lucide-react';
import './Admin.css';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchVouchers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/vouchers');
      setVouchers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Xác nhận xóa mã giảm giá này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/vouchers/${id}`, config);
        fetchVouchers();
      } catch (error) {
        alert('Lỗi khi xóa voucher');
      }
    }
  };

  const toggleActiveHandler = async (id, currentStatus) => {
    if (window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} mã giảm giá này?`)) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/vouchers/${id}`, { isActive: !currentStatus }, config);
        fetchVouchers();
      } catch (error) {
        alert('Lỗi khi cập nhật trạng thái voucher');
      }
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Quản Lý Khuyến Mãi</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Phát hành và quản lý mã giảm giá (Vouchers)</p>
        </div>
        <Link to="/admin/vouchers/add" className="flex items-center gap-2 bg-[#b22830] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8e1f26] transition-all shadow-lg shadow-red-100">
          <Plus size={20} />
          Thêm Mã
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
           <div className="w-10 h-10 border-4 border-[#b22830] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>MÃ CODE</th>
              <th>MÔ TẢ</th>
              <th style={{ width: '150px' }}>MỨC GIẢM</th>
              <th style={{ width: '150px' }}>HẠN DÙNG</th>
              <th style={{ width: '120px' }}>TRẠNG THÁI</th>
              <th style={{ width: '120px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-[#b22830] rounded-lg">
                      <Ticket size={20} />
                    </div>
                    <span style={{ fontWeight: '800', color: '#b22830', letterSpacing: '1px' }}>{v.code}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{v.description}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Đơn tối thiểu: {v.minOrderValue.toLocaleString()}đ</div>
                </td>
                <td>
                  <div style={{ fontWeight: '800', color: '#1e293b' }}>
                    {v.discountType === 'percentage' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()}đ`}
                  </div>
                  {v.maxDiscount > 0 && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Tối đa: {v.maxDiscount.toLocaleString()}đ</div>}
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>
                    {new Date(v.expirationDate).toLocaleDateString('vi-VN')}
                  </span>
                </td>
                <td>
                   <span className={`status-badge ${v.isActive && new Date() < new Date(v.expirationDate) ? 'delivered' : 'cancelled'}`} style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                      {v.isActive && new Date() < new Date(v.expirationDate) ? 'Hiệu lực' : 'Hết hạn'}
                   </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleActiveHandler(v._id, v.isActive)}
                      className={`p-2 rounded-lg transition-colors ${v.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      title={v.isActive ? 'Khóa Voucher' : 'Mở khóa Voucher'}
                    >
                      {v.isActive ? <Unlock size={18} /> : <Lock size={18} />}
                    </button>
                    <Link to={`/admin/vouchers/edit/${v._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => deleteHandler(v._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VoucherList;
