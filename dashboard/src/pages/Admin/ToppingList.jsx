import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import './Admin.css';

const ToppingList = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  // State for Add/Edit Modal or Inline form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const fetchToppings = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/toppings');
      setToppings(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, [user]);

  const deleteHandler = async (id) => {
    if (window.confirm('Xóa topping này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/toppings/${id}`);
        fetchToppings();
      } catch (error) {
        alert('Lỗi khi xóa topping');
      }
    }
  };

  const startEdit = (topping) => {
    setIsEditing(true);
    setEditId(topping._id);
    setName(topping.name);
    setPrice(topping.price);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setPrice(0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editId) {
        await axios.put(`/api/toppings/${editId}`, { name, price });
      } else {
        await axios.post('/api/toppings', { name, price });
      }
      fetchToppings();
      cancelEdit();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi lưu topping');
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Quản Lý Topping & Size</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Tùy chỉnh các lựa chọn thêm cho khách hàng</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-2 bg-[#b22830] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8e1f26] transition-all shadow-lg"
          >
            <Plus size={20} /> Thêm Topping
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fadeIn">
          <h4 className="font-bold mb-4">{editId ? 'Sửa Topping' : 'Thêm Topping Mới'}</h4>
          <form onSubmit={submitHandler} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tên Topping</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#b22830]"
                placeholder="Ví dụ: Trân châu đen"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Giá (VNĐ)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#b22830]"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#b22830] text-white p-3 rounded-xl hover:bg-[#8e1f26] transition-all">
                <Save size={20} />
              </button>
              <button type="button" onClick={cancelEdit} className="bg-gray-100 text-gray-500 p-3 rounded-xl hover:bg-gray-200 transition-all">
                <X size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-20">
           <div className="w-10 h-10 border-4 border-[#b22830] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>TÊN TOPPING</th>
              <th style={{ width: '200px' }}>GIÁ THÊM</th>
              <th style={{ width: '150px' }}>TRẠNG THÁI</th>
              <th style={{ width: '150px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {toppings.map((t) => (
              <tr key={t._id}>
                <td style={{ fontWeight: '700', color: '#1e293b' }}>{t.name}</td>
                <td style={{ fontWeight: '800', color: '#b22830' }}>
                  {t.price.toLocaleString()}đ
                </td>
                <td>
                   <span className={`status-badge ${t.isAvailable !== false ? 'delivered' : 'cancelled'}`} style={{ fontSize: '10px' }}>
                      {t.isAvailable !== false ? 'Hoạt động' : 'Tạm dừng'}
                   </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteHandler(t._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default ToppingList;
