import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import ProfileTab from '../components/Account/ProfileTab';
import ChangePasswordTab from '../components/Account/ChangePasswordTab';
import OrdersTab from '../components/Account/OrdersTab';
import AddressesTab from '../components/Account/AddressesTab';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
    { id: 'orders', label: 'Lịch sử mua hàng', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: 'addresses', label: 'Địa chỉ nhận hàng', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {/* Breadcrumb & Page Title */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
           <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-orange-600 transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="text-gray-900">Tài khoản của tôi</span>
           </nav>
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Cài đặt tài khoản</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 sticky top-24">
              {/* Short User Info Card */}
              <div className="flex items-center gap-4 p-4 mb-6 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                 <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-100 border-2 border-white overflow-hidden flex-shrink-0">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.fullName || 'U').charAt(0).toUpperCase()}
                 </div>
                 <div className="min-w-0">
                    <p className="font-black text-gray-900 truncate">@{(user.fullName || 'user').split(' ').pop().toLowerCase()}</p>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Thành viên MoRa</p>
                 </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === item.id 
                      ? 'bg-orange-600 text-white shadow-xl shadow-orange-200' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
             <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[600px]">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'password' && <ChangePasswordTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'addresses' && <AddressesTab />}
             </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default AccountPage;
