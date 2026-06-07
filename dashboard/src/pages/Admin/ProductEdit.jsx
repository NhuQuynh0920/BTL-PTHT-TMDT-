import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ArrowLeft, Save } from 'lucide-react';
import './Admin.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [category, setCategory] = useState('TraSua');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isMustTry, setIsMustTry] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setImagePreview(data.image);
          setCategory(data.category);
          setSubCategory(data.subCategory || '');
          setDescription(data.description);
          setIsAvailable(data.isAvailable);
          setIsMustTry(data.isMustTry || false);
        } catch (error) {
          console.error('Lỗi tải sản phẩm:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Kích thước ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 50MB.');
        e.target.value = ''; // clear input
        setImageFile(null);
        setImagePreview(image);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(image);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, imageFile]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !category.trim() || Number(price) <= 0 || (!imageFile && !image.trim())) {
      alert('Vui lòng nhập đủ tên, giá, ảnh và danh mục hợp lệ.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', String(price));
      formData.append('category', category.trim());
      if (subCategory.trim()) formData.append('subCategory', subCategory.trim());
      formData.append('description', description.trim() || 'Không có mô tả');
      formData.append('isAvailable', String(isAvailable));
      formData.append('isMustTry', String(isMustTry));

      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('image', image.trim());
      }

      const savedUser = user || JSON.parse(localStorage.getItem('userInfo') || 'null');
      const token = savedUser?.token;
      if (!user) {
        alert('Vui lòng đăng nhập lại để thực hiện thao tác này.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {
        await axios.put(`/api/products/${id}`, formData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await axios.post('/api/products', formData);
        alert('Thêm sản phẩm mới thành công!');
      }
      navigate(-1);
    } catch (error) {
      console.error('Product save error:', error);
      const message = error.response?.data?.message || error.message || 'Lỗi khi lưu sản phẩm';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-view">
      <div className="mb-8">
        <Link to="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-[#b22830] font-bold text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>
          {id ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-4xl">
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Basic Info */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  placeholder="Ví dụ: Trà sữa Trân Châu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                <div className="grid grid-cols-1 gap-4">
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
                    value={`${category}_${subCategory || ''}`}
                    onChange={(e) => {
                      const [cat, sub] = e.target.value.split('_');
                      setCategory(cat);
                      setSubCategory(sub || '');
                    }}
                  >
                    <optgroup label="Trà Sữa">
                      <option value="TraSua_TraSuaTruyenThong">Trà Sữa Truyền Thống</option>
                      <option value="TraSua_TraSuaNuong">Trà Sữa MoRa</option>
                    </optgroup>
                    <optgroup label="Trà Trái Cây">
                      <option value="TraTraiCay_">Trà Trái Cây</option>
                    </optgroup>
                    <optgroup label="Cà Phê">
                      <option value="CaPhe_">Cà Phê</option>
                    </optgroup>
                    <optgroup label="Khác">
                      <option value="Khac_BanhNgot">Bánh Ngọt</option>
                      <option value="Khac_CaPheDongGoi">Cà Phê Đóng Gói</option>
                      <option value="Khac_DoLuuNiem">Đồ Lưu Niệm</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Side: Image & Status */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh sản phẩm</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="w-full file:px-4 file:py-2 file:rounded-xl file:border-none file:bg-[#b22830] file:text-white file:font-semibold"
                  />
                  {imagePreview && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Ảnh sản phẩm" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  {!imagePreview && (
                    <p className="text-sm text-gray-500">Chọn file JPG/PNG/WebP để upload ảnh sản phẩm.</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Đánh dấu Nổi Bật</label>
                <div className="flex items-center gap-4 mt-2 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMustTry}
                      onChange={(e) => setIsMustTry(e.target.checked)}
                      className="w-4 h-4 accent-[#b22830]"
                    />
                    <span className="text-sm font-medium">Sản phẩm Nổi Bật (Must Try)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái bán</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isAvailable}
                      onChange={() => setIsAvailable(true)}
                      className="w-4 h-4 accent-[#b22830]"
                    />
                    <span className="text-sm font-medium">Đang kinh doanh</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isAvailable}
                      onChange={() => setIsAvailable(false)}
                      className="w-4 h-4 accent-[#b22830]"
                    />
                    <span className="text-sm font-medium">Tạm ngưng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả sản phẩm</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#b22830] transition-all"
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Hủy</button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-[#b22830] text-white rounded-xl font-bold hover:bg-[#8e1f26] transition-all shadow-lg shadow-red-100 flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
