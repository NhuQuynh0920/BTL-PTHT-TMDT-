import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/forgotpassword', { email });
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Vui lòng nhập đủ mã OTP');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/verify-otp', { email, otp });
      toast.success(data.message);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/reset-password', { email, otp, newPassword });
      toast.success(data.message);
      navigate('/login');
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
          <h1 className="auth-title">Khôi phục mật khẩu</h1>
        </div>
        
        {step === 1 && (
          <>
            <p className="auth-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>
              Nhập email đã đăng ký của bạn để nhận mã OTP khôi phục.
            </p>
            <form onSubmit={handleSendEmail} className="auth-form">
              <div className="form-group-modern">
                <label htmlFor="email">Email</label>
                <div className="input-modern-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-modern-primary" disabled={loading}>
                {loading ? <><Loader2 className="spinner" size={20} /> Đang gửi...</> : 'Gửi mã OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="auth-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>
              Nhập mã OTP 6 số vừa được gửi tới email <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-group-modern">
                <input
                  type="text"
                  id="otp"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="otp-input-modern"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="button" className="btn-link-modern" style={{ flex: 1, padding: '0.9rem', border: '1px solid var(--auth-border)', borderRadius: '12px', background: '#fff' }} onClick={() => setStep(1)} disabled={loading}>
                  Quay lại
                </button>
                <button type="submit" className="btn-modern-primary" style={{ flex: 1, marginTop: 0 }} disabled={loading}>
                  {loading ? <><Loader2 className="spinner" size={20} /> Xử lý...</> : 'Xác nhận OTP'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="auth-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>
              Thiết lập mật khẩu mới cho tài khoản của bạn.
            </p>
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group-modern">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <div className="input-modern-wrapper">
                  <ShieldCheck className="input-icon" size={20} />
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-modern-primary" disabled={loading}>
                {loading ? <><Loader2 className="spinner" size={20} /> Cập nhật...</> : 'Đổi mật khẩu'}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer-modern" style={{ marginTop: '2rem' }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
