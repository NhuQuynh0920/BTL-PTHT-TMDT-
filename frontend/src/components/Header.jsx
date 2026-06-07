import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Header.css';

// Icon chuông
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Map trạng thái đơn hàng → emoji + màu nền
const STATUS_ICON  = { Processing: '☕', Shipped: '🛵', Delivered: '🎉', Cancelled: '❌' };
const STATUS_CLASS = { Processing: 'processing', Shipped: 'shipped', Delivered: 'delivered', Cancelled: 'cancelled' };

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · ${d.toLocaleDateString('vi-VN')}`;
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ---- Notification state ----
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const prevUnreadRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.get('/api/user-notifications', config);
      const newUnread = data.unreadCount || 0;
      // Toast khi có thông báo mới xuất hiện
      if (newUnread > prevUnreadRef.current && prevUnreadRef.current !== 0) {
        toast('🔔 Đơn hàng của bạn vừa được cập nhật!', {
          duration: 4000,
          style: { background: '#fff', color: '#1e293b', fontWeight: '700', borderLeft: '4px solid #b22830' }
        });
      }
      prevUnreadRef.current = newUnread;
      setNotifications(data.notifications || []);
      setUnreadCount(newUnread);
    } catch (_) { /* silent */ }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 15000); // poll mỗi 15 giây
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await axios.put('/api/user-notifications/read-all', {}, config);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      prevUnreadRef.current = 0;
    } catch (_) { /* silent */ }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        await axios.put(`/api/user-notifications/${notif._id}/read`, {}, config);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        prevUnreadRef.current = Math.max(0, prevUnreadRef.current - 1);
      } catch (_) { /* silent */ }
    }
    setNotifOpen(false);
    navigate('/history');
  };
  // ---- End notification ----

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      if (term === 'trà sữa' || term === 'tra sua') {
        navigate('/menu/products?category=TraSua');
      } else if (term === 'trà trái cây' || term === 'tra trai cay') {
        navigate('/menu/products?category=TraTraiCay');
      } else if (term === 'cà phê' || term === 'ca phe') {
        navigate('/menu/products?category=CaPhe');
      } else if (term === 'khác' || term === 'khac') {
        navigate('/menu/products?category=Khac');
      } else {
        navigate(`/menu/products?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-inner">

        {/* ---- Logo ---- */}
        <Link to="/" className="header-logo">
          <span className="logo-text">MoRa Tea</span>
        </Link>

        {/* ---- Nav links (center) ---- */}
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`hdr-link ${isActive('/') ? 'active' : ''}`}>
            Trang Chủ
          </Link>

          <div className="nav-item-dropdown">
            <Link to="/menu" className={`hdr-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>

            {/* Mega Menu Dropdown */}
            <div className="mega-menu">
              <div className="mega-menu-inner">
                <div className="mega-menu-top">
                  <div className="mega-col">
                    <h4><Link to="/menu/products?category=TraSua">TRÀ SỮA</Link></h4>
                    <ul>
                      <li><Link to="/menu/products?category=TraSuaTruyenThong">Trà Sữa Truyền Thống</Link></li>
                      <li><Link to="/menu/products?category=TraSuaNuong">Trà Sữa MoRa</Link></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h4><Link to="/menu/products?category=TraTraiCay">TRÀ TRÁI CÂY</Link></h4>
                  </div>
                  <div className="mega-col">
                    <h4><Link to="/menu/products?category=CaPhe">CÀ PHÊ</Link></h4>
                  </div>
                  <div className="mega-col">
                    <h4><Link to="/menu/products?category=Khac">KHÁC</Link></h4>
                    <ul>
                      <li><Link to="/menu/products?category=BanhNgot">Bánh Ngọt</Link></li>
                      <li><Link to="/menu/products?category=CaPheDongGoi">Cà Phê đóng gói</Link></li>
                      <li><Link to="/menu/products?category=DoLuuNiem">Đồ Lưu Niệm</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link to="/blog" className={`hdr-link ${isActive('/blog') ? 'active' : ''}`}>
            Chuyện Nhà MoRa
          </Link>
          <Link to="/promotions" className={`hdr-link ${isActive('/promotions') ? 'active' : ''}`}>
            Khuyến Mãi
          </Link>
        </nav>

        {/* ---- Actions (right) ---- */}
        <div className="header-actions">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="header-search">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Tìm kiếm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Cart */}
          <Link to="/cart" className="cart-icon-btn" aria-label="Giỏ hàng">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* ---- Notification Bell (chỉ hiện khi đăng nhập) ---- */}
          {user && (
            <div className="notif-bell-wrapper" ref={notifRef}>
              <button
                className="notif-bell-btn"
                onClick={() => setNotifOpen(o => !o)}
                aria-label="Thông báo"
              >
                <BellIcon />
                {unreadCount > 0 && <span className="notif-bell-dot" />}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  {/* Header */}
                  <div className="notif-header">
                    <h4>
                      Thông báo
                      {unreadCount > 0 && (
                        <span className="notif-badge-count">{unreadCount} mới</span>
                      )}
                    </h4>
                    {unreadCount > 0 && (
                      <button className="notif-read-all-btn" onClick={handleMarkAllRead}>
                        <CheckIcon /> Đọc tất cả
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <p>Chưa có thông báo nào</p>
                        <span>Đặt hàng để nhận cập nhật trạng thái tại đây.</span>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          <div className={`notif-icon ${STATUS_CLASS[notif.status] || 'default'}`}>
                            {STATUS_ICON[notif.status] || '📦'}
                          </div>
                          <div className="notif-body">
                            <p className="notif-title">
                              {notif.title}
                              {!notif.isRead && <span className="unread-dot" />}
                            </p>
                            <p className="notif-msg">{notif.message}</p>
                            <span className="notif-time">{formatTime(notif.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="notif-footer">
                      <Link to="/history" onClick={() => setNotifOpen(false)}>
                        Xem tất cả đơn hàng →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User */}
          {user ? (
            <div className="user-dropdown">
              <button className="user-avatar-btn">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span className="user-initial">{user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</span>
                )}
                <span className="user-name-text">{user.fullName || 'User'}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="user-dropdown-menu">
                <Link to="/account">Tài khoản của tôi</Link>
                <Link to="/history">Đơn hàng của tôi</Link>
                <button onClick={handleLogout} className="logout-item">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="hdr-link hdr-login">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary hdr-cta">Đặt hàng</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
