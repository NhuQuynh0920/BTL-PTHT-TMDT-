import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProfileTab = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Khác',
    birthday: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fullNameError, setFullNameError] = useState('');
  const fileInputRef = useRef(null);

  // Chỉ cho phép chữ cái (bao gồm tiếng Việt) và khoảng trắng
  const handleFullNameChange = (e) => {
    const filtered = e.target.value.replace(/[^\p{L}\s]/gu, '');
    setUser(prev => ({ ...prev, fullName: filtered }));
    setFullNameError(filtered.trim() === '' ? 'Vui lòng nhập họ tên' : '');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/profile', config);
        setUser({
          ...data,
          birthday: data.birthday ? data.birthday.split('T')[0] : ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('/api/users/profile', user, config);
      
      const updatedUserInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      setMessage({ type: 'success', text: 'Thông tin của bạn đã được cập nhật thành công!' });
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi cập nhật' });
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl font-black text-gray-900">Thông tin cá nhân</h2>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-2xl mb-8 font-bold text-sm flex items-center gap-3 animate-slideDown ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-100">
           <div className="relative group">
              <div className="w-28 h-28 rounded-[36px] bg-orange-50 flex items-center justify-center text-orange-600 text-3xl font-black overflow-hidden border-4 border-white shadow-xl shadow-orange-100/50">
                {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (user.fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100 text-gray-600 hover:text-orange-600 hover:scale-110 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
           </div>
           <div className="text-center md:text-left">
              <h4 className="font-black text-gray-900 text-lg">Ảnh đại diện</h4>
           </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="space-y-2">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
            <input 
              type="text" 
              className={`w-full bg-[#f8f9fa] border-2 rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none ${
                fullNameError ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-orange-500/20'
              }`}
              value={user.fullName}
              onChange={handleFullNameChange}
              placeholder="Ví dụ: Nguyễn Văn A"
            />
            {fullNameError && (
              <span className="text-xs font-bold text-red-500 ml-2 mt-1 block">{fullNameError}</span>
            )}
          </div>
          <div className="space-y-2 opacity-70">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
            <div className="w-full bg-gray-100 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-sm font-bold text-gray-500 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
               {user.email} (Cố định)
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
            <input 
              type="tel" 
              className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
              value={user.phone || ''}
              onChange={(e) => setUser({...user, phone: e.target.value})}
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
            <input 
              type="date" 
              className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
              value={user.birthday}
              onChange={(e) => setUser({...user, birthday: e.target.value})}
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-4 pt-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Giới tính</label>
          <div className="flex flex-wrap gap-4">
            {['Nam', 'Nữ', 'Khác'].map((g) => (
              <label key={g} className="flex-1 min-w-[100px] cursor-pointer group">
                <input 
                  type="radio" name="gender" value={g} 
                  className="hidden" 
                  checked={user.gender === g}
                  onChange={(e) => setUser({...user, gender: e.target.value})}
                />
                <div className={`text-center py-4 rounded-2xl border-2 transition-all font-black text-sm ${user.gender === g ? 'border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-100' : 'border-gray-100 bg-[#f8f9fa] text-gray-400 group-hover:border-orange-200 group-hover:text-gray-600'}`}>
                   {g}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-10 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto min-w-[200px] bg-orange-600 text-white font-black px-12 py-5 rounded-[24px] hover:bg-orange-700 shadow-2xl shadow-orange-100 transition-all transform active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? (
               <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
               </div>
            ) : 'Lưu thay đổi hồ sơ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
