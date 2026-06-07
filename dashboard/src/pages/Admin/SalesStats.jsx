import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const C = {
  brand: '#b22830',
  brandDark: '#8e1f26',
  brandBg: '#fef2f2',
  dark: '#1e293b',
  mid: '#475569',
  sub: '#94a3b8',
  border: '#e2e8f0',
  bg: '#f8fafc',
  white: '#ffffff',
};

const BAR_PALETTE = ['#b22830', '#c84b52', '#d97b82', '#e8a8ac', '#f0cfd1'];

const PERIODS = [
  { value: 'day',   label: 'Hôm nay' },
  { value: 'week',  label: '7 ngày' },
  { value: 'month', label: '30 ngày' },
  { value: 'year',  label: 'Năm nay' },
];

// Stat Card Component
const KpiCard = ({ label, value, sub }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    padding: '24px 28px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0,
      width: '4px', height: '100%',
      background: C.brand, borderRadius: '16px 0 0 16px',
    }} />
    <p style={{
      fontSize: '0.72rem', fontWeight: '700', color: C.sub,
      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
    }}>
      {label}
    </p>
    <p style={{ fontSize: '1.75rem', fontWeight: '800', color: C.dark, lineHeight: 1, marginBottom: '8px' }}>
      {value}
    </p>
    <p style={{ fontSize: '0.72rem', color: C.sub }}>{sub}</p>
  </div>
);

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px',
    }}>
      <p style={{ color: C.sub, marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      <p style={{ color: C.brand, fontWeight: '800', fontSize: '15px' }}>
        {payload[0].value.toLocaleString()}{payload[0].name === 'DoanhThu' ? ' đ' : ''}
      </p>
    </div>
  );
};

const SalesStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const url = timeRange === 'custom'
          ? `/api/orders/stats?timeRange=custom&startDate=${customStart}&endDate=${customEnd}`
          : `/api/orders/stats?timeRange=${timeRange}`;
        const { data } = await axios.get(url);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, timeRange, fetchTrigger]);

  const handleCustomFilter = () => {
    if (!customStart || !customEnd) { alert('Vui lòng chọn đầy đủ từ ngày và đến ngày!'); return; }
    if (new Date(customStart) > new Date(customEnd)) { alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!'); return; }
    setTimeRange('custom');
    setFetchTrigger(p => p + 1);
  };

  const periodLabel = { day: 'Hôm nay', week: '7 ngày qua', month: '30 ngày qua', year: 'Năm nay', custom: 'Tùy chỉnh' }[timeRange];

  const chartData = stats
    ? Object.entries(stats.revenueByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, amount]) => {
          let name = date;
          if (timeRange === 'year') {
            const p = date.split('-'); if (p.length >= 2) name = `T${p[1]}`;
          } else if (timeRange !== 'day') {
            const p = date.split('-'); if (p.length >= 3) name = `${p[2]}/${p[1]}`;
          }
          return { name, DoanhThu: amount };
        })
    : [];

  return (
    <div className="admin-view" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: C.dark, marginBottom: '4px' }}>
          Thống Kê Bán Hàng
        </h2>
        <p style={{ fontSize: '0.85rem', color: C.sub }}>
          Phân tích doanh thu và hiệu suất kinh doanh của MoRa Tea
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: '14px', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '10px',
        flexWrap: 'wrap', marginBottom: '28px',
      }}>
        {/* Period buttons */}
        <div style={{ display: 'flex', gap: '6px', background: C.bg, padding: '4px', borderRadius: '10px' }}>
          {PERIODS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              style={{
                padding: '6px 16px', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                background: timeRange === opt.value ? C.brand : 'transparent',
                color: timeRange === opt.value ? C.white : C.mid,
                boxShadow: timeRange === opt.value ? '0 2px 8px rgba(178,40,48,0.25)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '28px', background: C.border }} />

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '0.8rem', outline: 'none', color: C.dark }} />
          <span style={{ color: C.sub, fontWeight: '700', fontSize: '12px' }}>→</span>
          <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '0.8rem', outline: 'none', color: C.dark }} />
          <button
            onClick={handleCustomFilter}
            style={{
              padding: '6px 16px', borderRadius: '8px',
              background: C.brand, color: C.white,
              border: 'none', fontWeight: '600', fontSize: '0.82rem',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '320px', gap: '16px' }}>
          <div style={{
            width: '36px', height: '36px',
            border: `3px solid ${C.brandBg}`, borderTopColor: C.brand,
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
          <p style={{ color: C.sub, fontSize: '0.85rem', fontWeight: '600' }}>Đang tải dữ liệu...</p>
        </div>
      ) : !stats ? (
        <div style={{ textAlign: 'center', padding: '80px', color: C.sub }}>Không có dữ liệu thống kê.</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <KpiCard label="Tổng doanh thu" value={`${stats.totalRevenue.toLocaleString()} đ`} sub={periodLabel} />
            <KpiCard label="Tổng đơn hàng" value={stats.totalOrders} sub={`${periodLabel} · tất cả trạng thái`} />
            <KpiCard label="Sản phẩm đã bán" value={stats.totalProductsSold} sub={`${periodLabel} · đơn thành công`} />
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>

            {/* Area Chart */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontWeight: '700', fontSize: '1rem', color: C.dark }}>Biểu đồ Doanh Thu</p>
                <p style={{ fontSize: '0.78rem', color: C.sub, marginTop: '2px' }}>{periodLabel}</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.brand} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={C.brand} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: C.sub, fontWeight: 600 }} dy={8} />
                  <YAxis
                    tickFormatter={v => `${(v / 1000).toLocaleString()}k`}
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: C.sub, fontWeight: 600 }}
                    width={52} dx={-4}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="DoanhThu"
                    stroke={C.brand} strokeWidth={2.5}
                    fill="url(#grad)" fillOpacity={1}
                    dot={false}
                    activeDot={{ r: 5, fill: C.brand, strokeWidth: 2, stroke: C.white }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontWeight: '700', fontSize: '1rem', color: C.dark }}>Top 5 Bán Chạy</p>
                <p style={{ fontSize: '0.78rem', color: C.sub, marginTop: '2px' }}>{periodLabel}</p>
              </div>
              {stats.topProducts.length === 0 ? (
                <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📊</div>
                  <p style={{ color: C.sub, fontSize: '0.82rem' }}>Chưa có dữ liệu</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.topProducts} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name" type="category"
                      axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: C.mid, fontWeight: 600 }}
                      width={140} dx={-4}
                    />
                    <Tooltip
                      formatter={v => [v, 'Đã bán']}
                      contentStyle={{ borderRadius: '10px', border: `1px solid ${C.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.07)', fontSize: '13px' }}
                      cursor={{ fill: C.brandBg }}
                    />
                    <Bar dataKey="qty" radius={[0, 6, 6, 0]} barSize={20}>
                      {stats.topProducts.map((_, i) => (
                        <Cell key={i} fill={BAR_PALETTE[i % BAR_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesStats;
