import { useState } from 'react';
import axios from 'axios';

const ChangePasswordTab = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, config);
      
      setMessage({ type: 'success', text: 'Mật khẩu của bạn đã được thay đổi thành công!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Mật khẩu hiện tại không chính xác' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl animate-fadeIn">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl font-black text-gray-900">Đổi mật khẩu</h2>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-8 font-bold text-sm flex items-center gap-3 animate-slideDown ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
           </svg>
           {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
          <input 
            type="password" 
            className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
          <input 
            type="password" 
            className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            placeholder="Tối thiểu 6 ký tự"
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
          <input 
            type="password" 
            className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-[20px] px-6 py-4 text-sm focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            placeholder="Nhập lại mật khẩu mới"
            required
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto min-w-[200px] bg-orange-600 text-white font-black px-12 py-5 rounded-[24px] hover:bg-orange-700 shadow-2xl shadow-orange-100 transition-all transform active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? (
               <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
               </div>
            ) : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
