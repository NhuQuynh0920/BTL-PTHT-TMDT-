import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch site settings', error);
      }
    };
    fetchSettings();
  }, []);
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">

          {/* Cột 1: Giới thiệu */}
          <div className="footer-col">
            <h4 className="footer-heading">GIỚI THIỆU</h4>
            <ul className="footer-links">
              <li><Link to="/about">Về Chúng Tôi</Link></li>
              <li><Link to="/menu">Sản phẩm</Link></li>
              <li><Link to="/promotions">Khuyến mãi</Link></li>
              <li><Link to="/blog">Chuyện Nhà MoRa</Link></li>
              <li><Link to="/careers">Tuyển dụng</Link></li>
            </ul>
          </div>

          {/* Cột 2: Điều khoản */}
          <div className="footer-col">
            <h4 className="footer-heading">ĐIỀU KHOẢN</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy">Chính sách bảo mật thông tin</Link></li>
              <li><Link to="/invoice-guide">Hướng dẫn xuất hóa đơn GTGT</Link></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="footer-col footer-contact">
            <h4 className="footer-heading">MORA TEA © {new Date().getFullYear()}</h4>
            <p className="footer-address">
              <span className="footer-label">Trụ sở:</span> {settings ? settings.contactAddress : 'Đang tải...'}
            </p>
            <p className="footer-contact-item">
              <span className="footer-label">Hotline:</span> {settings ? settings.contactPhone : 'Đang tải...'}
            </p>
            <p className="footer-contact-item">
              <span className="footer-label">Email:</span> {settings ? settings.contactEmail : 'Đang tải...'}
            </p>
          </div>

          {/* Cột 4: Logo & mạng xã hội */}
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-text">MoRa Tea</span>
            </div>
            <h4 className="footer-heading" style={{ margin: "1rem 0 0" }}>FOLLOW US</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon fill="#1a1a1a" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Dải dưới cùng */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>Công ty cổ phần thương mại dịch vụ Trà Sữa MoRa VN</p>
          <p>Mã số DN: 0123456789 do sở kế hoạch và đầu tư tp. HN cấp ngày 01/01/2026. Người đại diện: Hồ Ngọc Linh</p>
          <p>Địa chỉ: 96A, Nguyễn Trãi, Hà Đông, TP Hà Nội &nbsp; Điện thoại: 0865386069 &nbsp; Email: Linhngocho0912@gmail.com</p>
          <p>© {new Date().getFullYear()} Công ty cổ phần thương mại dịch vụ Trà Sữa MoRa VN mọi quyền bảo lưu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
