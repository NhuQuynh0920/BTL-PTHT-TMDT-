import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Coffee, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/admin';
  const errorParam = params.get('error');

  useEffect(() => {
    if (user && !loading) {
      navigate(redirect);
    }
  }, [navigate, user, redirect, loading]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#b22830] rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
              <Coffee size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">MoRa Tea Admin</h1>
            <p className="text-gray-500 text-sm">Hệ thống quản trị nội bộ</p>
          </div>

          {errorParam === 'not_admin' && (
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm mb-4 border border-orange-100">
              ⚠️ Tài khoản này không có quyền quản trị viên.
            </div>
          )}

          {errorParam === 'expired' && (
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm mb-4 border border-blue-100">
              ℹ️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
            </div>
          )}

          {message && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
              {message}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b22830] focus:border-transparent outline-none transition-all"
                  placeholder="admin@moratea.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật mã truy cập</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b22830] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-[#b22830] text-white rounded-xl font-bold uppercase tracking-wide hover:bg-[#8e1f26] transform active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
            </button>
          </form>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Bản quyền © 2026 MoRa Tea
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
