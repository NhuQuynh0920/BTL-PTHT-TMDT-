import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ArrowLeft, Save, Ticket } from 'lucide-react';
import './Admin.css';

const VoucherEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const { data } = await axios.get(`/api/vouchers/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setCode(data.code);
          setDescription(data.description);
          setDiscountType(data.discountType);
          setDiscountValue(data.discountValue);
          setMinOrderValue(data.minOrderValue);
          setMaxDiscount(data.maxDiscount || 0);
          setExpirationDate(new Date(data.expirationDate).toISOString().split('T')[0]);
          setIsActive(data.isActive);
        } catch (error) {
          console.error(error);
        }
      };
      fetchVoucher();
    }
  }, [id, user.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const voucherData = {
        code,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: parseFloat(maxDiscount) || 0,
        expirationDate,
        isActive
      };
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      if (id) {
        await axios.put(`/api/vouchers/${id}`, voucherData);
        alert('Cập nhật voucher thành công!');
      } else {
        await axios.post('/api/vouchers', voucherData);
        alert('Tạo voucher mới thành công!');
      }
      navigate('/admin/vouchers');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi lưu voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-view">
      <div className="mb-8">
        <Link to="/admin/vouchers" className="flex items-center gap-2 text-gray-500 hover:text-[#b22830] font-bold text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>
          {id ? 'Chỉnh Sửa Voucher' : 'Tạo Mã Giảm Giá Mới'}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-4xl">
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Code & Type */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Mã Code (In hoa)</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b22830]" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all font-black uppercase"
                    placeholder="MORATEA2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Loại giảm giá</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="fixed">Số tiền cố định (đ)</option>
                  <option value="percentage">Phần trăm (%)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá trị giảm</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Right Side: Constraints & Date */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Đơn hàng tối thiểu (đ)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  required
                />
              </div>

              {discountType === 'percentage' && (
                <div className="form-group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Giảm tối đa (đ)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Ngày hết hạn</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chương trình</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
              placeholder="Ví dụ: Giảm 20k cho đơn hàng từ 100k..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
             <Link to="/admin/vouchers" className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Hủy</Link>
             <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-3 bg-[#b22830] text-white rounded-xl font-bold hover:bg-[#8e1f26] transition-all shadow-lg shadow-red-100 flex items-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Đang lưu...' : 'Lưu Voucher'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherEdit;
