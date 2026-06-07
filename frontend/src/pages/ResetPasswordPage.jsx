import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put(`/api/users/resetpassword/${token}`, { password }, config);
      toast.success(data.message + ' (Đang chuyển hướng...)');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modern-container">
      <div className="auth-modern-card">
        <div className="auth-header">
          <h1 className="auth-title">Đặt lại mật khẩu</h1>
          <p className="auth-subtitle">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
        </div>
        
        <form onSubmit={submitHandler} className="auth-form">
          <div className="form-group-modern">
            <label htmlFor="password">Mật khẩu mới</label>
            <div className="input-modern-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn-toggle-password-modern"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group-modern">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="input-modern-wrapper">
              <ShieldCheck className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn-toggle-password-modern"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn-modern-primary" disabled={loading}>
            {loading ? <><Loader2 className="spinner" size={20} /> Đang cập nhật...</> : 'Cập nhật mật khẩu'}
          </button>
        </form>
        
        <div className="auth-footer-modern">
          <Link to="/login">Hủy bỏ</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
