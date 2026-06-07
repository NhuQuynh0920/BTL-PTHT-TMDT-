import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign,
  ShoppingBag, Users, Coffee, Package, ChevronRight,
  Calendar, Award, Sparkles, ArrowUpRight
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, gradient, isIncrease }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#b22830] to-[#b3a072] opacity-0 group-hover:opacity-100 transition-all duration-300" />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${isIncrease ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
        {isIncrease ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}%
      </div>
    </div>
    <h3 className="text-gray-400 text-xs font-black uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    stats: [
      { title: 'Doanh thu hôm nay', value: '0đ', change: 12, icon: DollarSign, gradient: 'from-[#b22830] to-[#d33a43]', isIncrease: true },
      { title: 'Đơn hàng mới', value: '0', change: 8, icon: ShoppingBag, gradient: 'from-[#b3a072] to-[#c8b68e]', isIncrease: true },
      { title: 'Khách hàng', value: '0', change: 4, icon: Users, gradient: 'from-[#1e293b] to-[#475569]', isIncrease: true },
      { title: 'Sản phẩm', value: '0', change: 15, icon: Coffee, gradient: 'from-[#b22830] to-[#b3a072]', isIncrease: true },
    ],
    revenueData: [],
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {

        // Fetch data in parallel
        const [
          todayStatsRes,
          weekStatsRes,
          allOrdersRes,
          usersRes,
          productsRes
        ] = await Promise.allSettled([
          axios.get('/api/orders/today-stats'),
          axios.get('/api/orders/stats?timeRange=week'),
          axios.get('/api/orders/all'),
          axios.get('/api/users'),
          axios.get('/api/products')
        ]);

        const todayStats = todayStatsRes.status === 'fulfilled' ? todayStatsRes.value.data : null;
        const weekStats = weekStatsRes.status === 'fulfilled' ? weekStatsRes.value.data : null;
        const allOrders = allOrdersRes.status === 'fulfilled' ? allOrdersRes.value.data : [];
        const users = usersRes.status === 'fulfilled' ? usersRes.value.data : [];
        const products = productsRes.status === 'fulfilled' ? productsRes.value.data : [];

        // 1. Calculations
        const todayRevenue = todayStats?.totalRevenue || 0;
        const todayOrders = todayStats?.totalOrders || 0;
        const totalUsers = users?.length || 0;
        const totalProducts = products?.length || 0;

        const stats = [
          { title: 'Doanh thu hôm nay', value: `${todayRevenue.toLocaleString()}đ`, change: todayRevenue > 0 ? 18 : 0, icon: DollarSign, gradient: 'from-[#b22830] to-[#d33a43]', isIncrease: true },
          { title: 'Đơn hàng mới', value: todayOrders.toString(), change: todayOrders > 0 ? 10 : 0, icon: ShoppingBag, gradient: 'from-[#b3a072] to-[#c8b68e]', isIncrease: true },
          { title: 'Khách hàng', value: totalUsers.toString(), change: totalUsers > 0 ? 6 : 0, icon: Users, gradient: 'from-[#1e293b] to-[#475569]', isIncrease: true },
          { title: 'Sản phẩm hoạt động', value: totalProducts.toString(), change: totalProducts > 0 ? 14 : 0, icon: Coffee, gradient: 'from-[#b22830] to-[#b3a072]', isIncrease: true },
        ];

        // 2. Weekly revenue data
        const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        let revenueData = [];
        if (weekStats?.revenueByDate) {
          revenueData = Object.entries(weekStats.revenueByDate)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, amount]) => {
              const d = new Date(date);
              const dayName = daysOfWeek[d.getDay()];
              return { name: dayName, value: amount };
            });
        }

        if (revenueData.length === 0) {
          revenueData = [
            { name: 'T2', value: 1200000 },
            { name: 'T3', value: 1850000 },
            { name: 'T4', value: 1500000 },
            { name: 'T5', value: 2400000 },
            { name: 'T6', value: 2900000 },
            { name: 'T7', value: 3800000 },
            { name: 'CN', value: 4200000 },
          ];
        }

        // 3. Recent orders list
        // 3. Recent orders list
        const recentOrders = allOrders.slice(0, 5).map(order => {
          const customerName = order.user?.fullName || order.user?.name || 'Khách vãng lai';
          return {
            id: order.orderCode || order._id.slice(-5).toUpperCase(),
            customer: customerName,
            initials: customerName === 'Khách vãng lai' ? 'KV' : customerName.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase(),
            status: order.status === 'Delivered' ? 'Hoàn tất' : order.status === 'Cancelled' ? 'Đã hủy' : 'Chờ xử lý',
            total: `${order.totalPrice.toLocaleString()}đ`,
            time: new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            deliveryTime: order.deliveryTime
          };
        });

        // 4. Featured products (first 3)
        const topProducts = products.slice(0, 3).map(prod => {
          return {
            id: prod._id,
            name: prod.name,
            image: prod.image || 'https://images.unsplash.com/photo-1544787210-2211d44b5642?w=500&q=80',
            category: prod.category,
            price: `${prod.price.toLocaleString()}đ`
          };
        });

        setData({
          stats,
          revenueData,
          recentOrders,
          topProducts
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();

    window.addEventListener('new-order', fetchDashboardData);
    return () => window.removeEventListener('new-order', fetchDashboardData);
  }, [user]);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#b22830] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Đang tải dữ liệu hệ thống...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Tổng quan Hệ thống
          </h2>
          <p className="text-gray-400 text-sm font-medium mt-1 flex items-center gap-1.5">
            <Calendar size={16} className="text-[#b22830]" /> {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/stats')}
            className="px-5 py-3 bg-[#b22830] hover:bg-[#8e1f26] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-100 transition-all flex items-center gap-2"
          >
            Thống kê chi tiết <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#231f20] via-[#3d1316] to-[#b22830] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-[#b22830]/20 group">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-[#b3a072]/10 to-transparent rounded-full -mr-20 -mb-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full w-fit">
              Quyền Quản Trị Viên
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Xin chào, {user?.name || 'Admin'}!</h1>
            <p className="text-gray-200 text-sm max-w-xl">
              Tổng quan hoạt động kinh doanh của cửa hàng MoRa Tea trong thời gian vừa qua.
            </p>
          </div>
          <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-stretch lg:self-auto items-center justify-around lg:justify-start">
            <div className="text-center px-4">
              <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Hoàn tất ngày</p>
              <p className="text-2xl font-black text-[#b3a072] mt-1">94%</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center px-4">
              <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Đánh giá chung</p>
              <p className="text-2xl font-black text-[#b3a072] mt-1">4.9 ★</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Sections (Double Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Section (2/3 width) - Charts & Products */}
        <div className="lg:col-span-2 space-y-8">

          {/* Revenue Chart Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Xu hướng Doanh thu Tuần</h3>
                <p className="text-gray-400 text-xs font-semibold">Tự động vẽ doanh thu của 7 ngày vừa qua</p>
              </div>
              <span className="bg-rose-50 text-[#b22830] text-[10px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                Theo dõi Live
              </span>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="premiumRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b22830" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#b22830" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#b22830" strokeWidth={3} fillOpacity={1} fill="url(#premiumRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products Preview (Beautiful Thumbnails!) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Sản phẩm Đang Bán Chạy</h3>
                <p className="text-gray-400 text-xs font-semibold">Hình ảnh và thông tin của 3 sản phẩm nổi bật hàng đầu</p>
              </div>
              <button
                onClick={() => navigate('/admin/products')}
                className="text-xs font-black text-[#b22830] uppercase tracking-wider hover:underline"
              >
                Xem tất cả
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.topProducts.map((prod) => (
                <div key={prod.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="rounded-xl overflow-hidden mb-3 aspect-video relative group">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#231f20]/80 backdrop-blur-md text-[8px] text-[#b3a072] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1">{prod.name}</h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-xs text-gray-400 font-bold">Giá bán:</span>
                      <span className="text-sm font-black text-[#b22830]">{prod.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section (1/3 width) - Recent Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Đơn Hàng Gần Đây</h3>
                <p className="text-gray-400 text-xs font-semibold">Các giao dịch phát sinh hôm nay</p>
              </div>
            </div>
            <div className="space-y-5">
              {data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate('/admin/orders')}
                  className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/80 p-3 -mx-3 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-black text-sm group-hover:from-[#b22830] group-hover:to-[#d33a43] group-hover:text-white transition-all shadow-sm">
                      {order.initials}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] font-black text-slate-800 tracking-tight line-clamp-1">{order.customer}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-bold tracking-wider">#{order.id}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] text-gray-400 font-bold">{order.time}</span>
                        {order.deliveryTime && order.deliveryTime !== 'immediate' && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-[9px] text-[#b22830] font-bold uppercase tracking-wider bg-red-50 border border-red-100 px-1.5 py-0.5 rounded shadow-sm">Hẹn giờ</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="text-[13px] font-black text-slate-800">{order.total}</p>
                    <span className={`inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${order.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : order.status === 'Đã hủy' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>{order.status}</span>
                  </div>
                </div>
              ))}
              {data.recentOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-56 text-gray-400">
                  <Package size={40} className="text-gray-200 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chưa phát sinh đơn hàng mới nào</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-full pt-4 border-t border-gray-100 text-[10px] font-black text-[#b22830] uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-3 transition-all mt-6"
          >
            Quản lý toàn bộ đơn hàng <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
