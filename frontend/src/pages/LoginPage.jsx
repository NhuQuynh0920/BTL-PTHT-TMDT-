import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // For unverified users who try to log in
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, user, redirect, loading]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowVerifyLink(false);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const result = await login(trimmedEmail, password, rememberMe);
    
    if (result.success) {
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error(result.error);
      if (result.requireVerification) {
        setShowVerifyLink(true);
        setUnverifiedEmail(result.email);
      }
    }
  };

  return (
    <div className="auth-modern-container">
      <div className="auth-modern-card">
        <div className="auth-header">
          <h1 className="auth-title">Đăng nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn quay lại với MoRa Tea</p>
        </div>
        
        {showVerifyLink && (
          <div className="alert-error" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span>Bạn cần xác thực tài khoản trước khi đăng nhập.</span>
            <Link to={`/register?verifyEmail=${unverifiedEmail}`} className="btn-link" style={{ alignSelf: 'flex-start', color: '#3498db' }}>
              Tiến hành xác thực ngay
            </Link>
          </div>
        )}
        
        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group-modern">
            <label htmlFor="email">Email</label>
            <div className="input-modern-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group-modern">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-modern-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="btn-toggle-password-modern"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="form-row-between">
            <label className={`checkbox-modern ${loading ? 'disabled' : ''}`}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} />
              <span className="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
          </div>
          
          <button type="submit" className="btn-modern-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spinner" size={20} />
                Đang xử lý...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
        
        <div className="auth-footer-modern">
          Chưa có tài khoản?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
