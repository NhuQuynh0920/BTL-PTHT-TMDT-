import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPages.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullNameError, setFullNameError] = useState('');

  const { register, verifyAccount, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  const verifyEmailParam = searchParams.get('verifyEmail');

  // Regex for letters and spaces only
  const nameRegex = /^[\p{L}\s]*$/u;

  useEffect(() => {
    if (user && !loading) {
      navigate(redirect);
    }
  }, [navigate, user, redirect, loading]);

  useEffect(() => {
    if (verifyEmailParam) {
      setEmail(verifyEmailParam);
      setStep(2);
    }
  }, [verifyEmailParam]);

  const handleFullNameChange = (e) => {
    // Lọc bỏ tất cả ký tự không phải chữ cái và khoảng trắng
    const filtered = e.target.value.replace(/[^\p{L}\s]/gu, '');
    setFullName(filtered);
    if (filtered !== '' && !nameRegex.test(filtered)) {
      setFullNameError('Họ tên chỉ được chứa chữ cái và khoảng trắng');
    } else {
      setFullNameError('');
    }
  };


  const submitRegisterHandler = async (e) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }


    if (!agreed) {
      toast.error('Bạn phải đồng ý với Điều khoản và Dịch vụ');
      return;
    }

    const result = await register(trimmedName, trimmedEmail, password);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success('Mã OTP đã được gửi đến email của bạn!');
      setStep(2); // Go to OTP verification step
    }
  };

  const submitOtpHandler = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast.error('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    const result = await verifyAccount(email, otp);
    if (result.success) {
      toast.success('Xác thực thành công! Đang đăng nhập...');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="auth-modern-container">
      <div className="auth-modern-card">
        {step === 1 ? (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Tạo Tài Khoản</h1>
              <p className="auth-subtitle">Gia nhập cộng đồng MoRa Tea ngay hôm nay</p>
            </div>
            
            <form onSubmit={submitRegisterHandler} className="auth-form">
              <div className="form-group-modern">
                <label htmlFor="fullName">Họ và tên</label>
                <div className="input-modern-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Nhập họ tên (VD: Nguyễn Văn A)"
                    value={fullName}
                    onChange={handleFullNameChange}
                    required
                  />
                </div>
                {fullNameError && <span className="field-error-modern">{fullNameError}</span>}
              </div>

              <div className="form-group-modern">
                <label htmlFor="email">Email</label>
                <div className="input-modern-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    placeholder="Ít nhất 8 ký tự, 1 hoa, 1 số, 1 ký tự ĐB"
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
                    placeholder="Nhập lại mật khẩu"
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

              <label className="checkbox-modern" style={{ marginBottom: '1.5rem' }}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="checkmark"></span>
                <span>Tôi đồng ý với <Link to="/terms">Điều khoản</Link> và <Link to="/privacy">Bảo mật</Link></span>
              </label>
              
              <button type="submit" className="btn-modern-primary" disabled={loading || !agreed}>
                {loading ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng Ký'
                )}
              </button>
            </form>
            
            <div className="auth-footer-modern">
              Đã có tài khoản? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Đăng nhập</Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Xác thực Email</h1>
              <p className="auth-subtitle">Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến <strong>{email}</strong>.</p>
            </div>

            <form onSubmit={submitOtpHandler} className="auth-form">
              <div className="form-group-modern">
                <input
                  type="text"
                  id="otp"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="otp-input-modern"
                  required
                />
              </div>

              <button type="submit" className="btn-modern-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="spinner" size={20} />
                    Đang xác thực...
                  </>
                ) : (
                  'Xác nhận OTP'
                )}
              </button>

              <div className="auth-footer-modern" style={{ marginTop: '1.5rem' }}>
                Không nhận được mã? <button type="button" className="btn-link-modern" onClick={() => setStep(1)}>Quay lại</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
