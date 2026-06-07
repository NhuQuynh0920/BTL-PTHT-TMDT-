import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Search, Plus } from 'lucide-react';
import './Admin.css';

const CATEGORY_LABELS = {
  TraSua: 'Trà Sữa',
  TraTraiCay: 'Trà Trái Cây',
  CaPhe: 'Cà Phê',
  Khac: 'Khác',
};

const getCategoryLabel = (code) => CATEGORY_LABELS[code] || code;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Lưu bộ lọc vào URL để giữ nguyên khi quay lại
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const filterCategory = searchParams.get('category') || 'All';
  const filterStatus = searchParams.get('status') || 'All';

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'All' || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'All'
      ? true
      : (filterStatus === 'Available' ? product.isAvailable : !product.isAvailable);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="admin-view">
      <div className="admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Danh Sách Sản Phẩm</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Quản lý kho hàng và thực đơn MoRa Tea</p>
        </div>
        <Link to="/admin/products/add" className="flex items-center gap-2 bg-[#b22830] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8e1f26] transition-all shadow-lg shadow-red-100">
          <Plus size={20} />
          Thêm Món Mới
        </Link>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchTerm}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-12 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830]/20 focus:border-[#b22830] text-sm font-medium transition-all"
          />
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830]/20 text-sm font-medium transition-all min-w-[160px]"
          >
            <option value="All">Tất cả danh mục</option>
            <option value="TraSua">Trà Sữa</option>
            <option value="TraTraiCay">Trà Trái Cây</option>
            <option value="CaPhe">Cà Phê</option>
            <option value="Khac">Khác</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilter('status', e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830]/20 text-sm font-medium transition-all min-w-[160px]"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Available">Đang bán</option>
            <option value="Unavailable">Hết hàng</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
           <div className="w-10 h-10 border-4 border-[#b22830] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ẢNH</th>
                <th>TÊN SẢN PHẨM</th>
                <th style={{ width: '150px' }}>DANH MỤC</th>
                <th style={{ width: '120px' }}>GIÁ GỐC</th>
                <th style={{ width: '110px' }}>TRẠNG THÁI</th>
                <th style={{ width: '160px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #f1f5f9' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      color: '#475569',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '3px 10px',
                      borderRadius: '5px',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap'
                    }}>
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td style={{ fontWeight: '800', color: '#b22830' }}>
                    {product.price.toLocaleString()}đ
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      background: product.isAvailable ? '#f0fdf4' : '#fef2f2',
                      color: product.isAvailable ? '#16a34a' : '#dc2626',
                      border: `1px solid ${product.isAvailable ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      {product.isAvailable ? 'Đang bán' : 'Hết hàng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          background: '#fff',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        Chỉnh sửa
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          background: '#fff',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
