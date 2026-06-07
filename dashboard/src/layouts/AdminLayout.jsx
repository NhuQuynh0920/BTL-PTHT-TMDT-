import { useState, useContext, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Users,
  Star,
  BarChart3,
  Ticket,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  UtensilsCrossed,
  CheckCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant double beep (like a soft bell)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio play blocked or unsupported:", e);
  }
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read'
  const prevCountRef = useRef(0);
  const dropdownRef = useRef(null);
  
  // Track read notifications in localStorage
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminReadNotifications')) || [];
    } catch {
      return [];
    }
  });

  // Calculate unread count dynamically
  const unreadCount = notifications.filter(n => !readNotificationIds.includes(n.id)).length;

  useEffect(() => {
    localStorage.setItem('adminReadNotifications', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('/api/notifications');
        const fetchedNotifs = data.notifications || [];
        setTotalNotifications(data.total || fetchedNotifs.length);
        
        // Use latest localStorage to avoid closure staleness
        const currentReadIds = JSON.parse(localStorage.getItem('adminReadNotifications')) || [];
        const currentUnreadCount = fetchedNotifs.filter(n => !currentReadIds.includes(n.id)).length;
        
        if (currentUnreadCount > prevCountRef.current && prevCountRef.current !== 0) {
          toast.success(`Có thông báo mới!`, {
            icon: '🔔',
            duration: 5000,
            style: { fontWeight: 'bold' }
          });
          playNotificationSound();
          window.dispatchEvent(new Event('new-order'));
        }
        
        prevCountRef.current = currentUnreadCount;
        setNotifications(fetchedNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications(); // Fetch immediately
    const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Bảng điều khiển', end: true },
    { to: '/admin/stats', icon: BarChart3, label: 'Thống kê' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
    { to: '/admin/products', icon: Coffee, label: 'Sản phẩm' },
    { to: '/admin/toppings', icon: UtensilsCrossed, label: 'Topping & Size' },
    { to: '/admin/users', icon: Users, label: 'Khách hàng' },
    { to: '/admin/reviews', icon: Star, label: 'Đánh giá' },
    { to: '/admin/vouchers', icon: Ticket, label: 'Khuyến mãi' },
    { to: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside style={{
        width: isSidebarOpen ? '272px' : '80px',
        minWidth: isSidebarOpen ? '272px' : '80px',
        background: '#231f20',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding: '0 20px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '38px', height: '38px', minWidth: '38px',
            background: '#b22830', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Coffee size={20} color="#fff" />
          </div>
          {isSidebarOpen && (
            <span style={{
              fontWeight: '800', fontSize: '0.95rem',
              letterSpacing: '-0.3px', textTransform: 'uppercase',
              color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden',
            }}>
              MoRa Tea
            </span>
          )}
        </div>

        {/* Nav links — flex-1 để chiếm hết chiều cao còn lại */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isSidebarOpen ? '10px 14px' : '10px',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.15s',
                background: isActive ? '#b22830' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                whiteSpace: 'nowrap',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Đăng xuất — cố định ở dưới */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isSidebarOpen ? '10px 14px' : '10px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              width: '100%',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main style={{
        flex: 1,
        minWidth: 0,
        transition: 'all 0.25s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Top Header */}
        <header
          className="px-4 md:px-8"
          style={{
            height: '72px',
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            flexShrink: 0,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="md:gap-5">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px', border: '1px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', color: '#64748b',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="md:gap-4">
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', background: isDropdownOpen ? '#f8fafc' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b', position: 'relative',
                  transition: 'all 0.2s'
                }}>
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '8px', right: '8px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#b22830', border: '1.5px solid #fff',
                  }} />
                )}
              </button>

              {/* Notification Dropdown - Premium UI with Tabs */}
              {isDropdownOpen && (() => {
                const unreadNotifs = notifications.filter(n => !readNotificationIds.includes(n.id));
                const readNotifs = notifications.filter(n => readNotificationIds.includes(n.id));
                const displayedNotifs = activeTab === 'all' ? notifications : activeTab === 'unread' ? unreadNotifs : readNotifs;

                const NotifItem = ({ notif }) => {
                  const isRead = readNotificationIds.includes(notif.id);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (!isRead) setReadNotificationIds(prev => [...prev, notif.id]);
                        setIsDropdownOpen(false);
                        navigate(notif.link);
                      }}
                      style={{
                        padding: '14px 12px', borderRadius: '14px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', gap: '14px', alignItems: 'flex-start',
                        marginBottom: '4px',
                        background: isRead ? 'transparent' : 'rgba(59, 130, 246, 0.04)',
                        border: isRead ? '1px solid transparent' : '1px solid rgba(59, 130, 246, 0.1)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = isRead ? '#f8fafc' : 'rgba(59, 130, 246, 0.08)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isRead ? 'transparent' : 'rgba(59, 130, 246, 0.04)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                        background: notif.type === 'order' ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        color: notif.type === 'order' ? '#ef4444' : '#3b82f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: notif.type === 'order' ? '0 4px 12px rgba(239,68,68,0.15)' : '0 4px 12px rgba(59,130,246,0.15)',
                        opacity: isRead ? 0.55 : 1
                      }}>
                        {notif.type === 'order' ? <ShoppingBag size={18} /> : <Star size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, opacity: isRead ? 0.7 : 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: isRead ? '600' : '800', color: '#0f172a', margin: '0 0 3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {notif.title}
                          {!isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', flexShrink: 0 }}></span>}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.5, fontWeight: isRead ? '400' : '500' }}>{notif.message}</p>
                        <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                          {new Date(notif.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  );
                };

                return (
                  <div
                    className="animate-in fade-in slide-in-from-top-4 duration-200"
                    style={{
                      position: 'absolute', top: '100%', right: '0', marginTop: '12px',
                      width: '400px',
                      background: 'rgba(255,255,255,0.97)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '24px',
                      boxShadow: '0 24px 48px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                      zIndex: 100, overflow: 'hidden'
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      padding: '18px 20px 0',
                      background: 'linear-gradient(to bottom, #fff, rgba(248,250,252,0.6))'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Thông báo</h3>
                          {unreadCount > 0 && (
                            <span style={{
                              background: 'linear-gradient(135deg, #ef4444, #b22830)',
                              color: '#fff', fontSize: '0.68rem', fontWeight: '800',
                              padding: '2px 8px', borderRadius: '10px',
                              boxShadow: '0 4px 10px rgba(239,68,68,0.3)'
                            }}>
                              {unreadCount} mới
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              const allIds = notifications.map(n => n.id);
                              setReadNotificationIds(prev => [...new Set([...prev, ...allIds])]);
                              toast.success('Đã đánh dấu tất cả là đã đọc', {
                                icon: '✅',
                                style: { borderRadius: '12px', background: '#333', color: '#fff' }
                              });
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              background: 'transparent', border: 'none',
                              color: '#6366f1', fontSize: '0.775rem', fontWeight: '700',
                              cursor: 'pointer', padding: '5px 10px', borderRadius: '8px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <CheckCheck size={14} />
                            Đọc tất cả
                          </button>
                        )}
                      </div>

                      {/* Tabs */}
                      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0' }}>
                        {[
                          { key: 'all',    label: 'Tất cả',    count: notifications.length },
                          { key: 'unread', label: 'Chưa đọc', count: unreadNotifs.length },
                          { key: 'read',   label: 'Đã đọc',   count: readNotifs.length },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px',
                              border: 'none', background: 'transparent',
                              fontSize: '0.8rem', fontWeight: activeTab === tab.key ? '800' : '600',
                              color: activeTab === tab.key ? '#b22830' : '#64748b',
                              cursor: 'pointer', borderRadius: '8px 8px 0 0',
                              borderBottom: activeTab === tab.key ? '2px solid #b22830' : '2px solid transparent',
                              transition: 'all 0.2s',
                              marginBottom: '-1px',
                            }}
                          >
                            {tab.label}
                            {tab.count > 0 && (
                              <span style={{
                                background: activeTab === tab.key
                                  ? (tab.key === 'unread' ? 'linear-gradient(135deg,#ef4444,#b22830)' : '#b22830')
                                  : '#e2e8f0',
                                color: activeTab === tab.key ? '#fff' : '#64748b',
                                fontSize: '0.65rem', fontWeight: '800',
                                padding: '1px 6px', borderRadius: '8px',
                                minWidth: '18px', textAlign: 'center',
                              }}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: '380px', overflowY: 'auto' }} className="custom-scrollbar">
                      {displayedNotifs.length === 0 ? (
                        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                          <div style={{
                            width: '58px', height: '58px', borderRadius: '50%',
                            background: '#f1f5f9', margin: '0 auto 14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Bell size={26} color="#cbd5e1" />
                          </div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#64748b', margin: 0 }}>
                            {activeTab === 'unread' ? 'Không có thông báo chưa đọc' :
                             activeTab === 'read'   ? 'Chưa có thông báo nào đã đọc' :
                                                     'Không có thông báo nào'}
                          </p>
                          <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '6px' }}>
                            {activeTab === 'unread' ? 'Bạn đã cập nhật hết rồi 🎉' :
                             activeTab === 'read'   ? 'Hãy đọc thông báo để chúng xuất hiện ở đây.' :
                                                     'Hệ thống sẽ thông báo khi có hoạt động mới.'}
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 10px 6px' }}>
                          {displayedNotifs.map(notif => <NotifItem key={notif.id} notif={notif} />)}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: '10px 16px',
                      borderTop: '1px solid rgba(0,0,0,0.04)',
                      background: '#f8fafc',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8' }}>
                        {displayedNotifs.length} / {totalNotifications} thông báo
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8' }}>
                        {unreadCount > 0 ? `${unreadCount} chưa đọc` : '✓ Đã đọc tất cả'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="md:gap-3">
              <div style={{ textAlign: 'right' }} className="hidden sm:block">
                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', lineHeight: 1 }}>
                  {user?.fullName || user?.name || 'Admin'}
                </p>
                <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Quản trị viên
                </p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.name || 'Admin')}&background=b22830&color=fff&bold=true&size=80`}
                alt="Avatar"
                style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
