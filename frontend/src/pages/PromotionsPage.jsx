import { useState } from 'react';
import './PromotionsPage.css';

const promotions = [
  {
    id: 1,
    image: '/sale/promo1.png',
    badge: 'Đang diễn ra',
    title: 'Mua 2 Tặng 1',
    desc: 'Áp dụng toàn bộ menu trà sữa mỗi thứ 6, thứ 7 và Chủ Nhật. Chỉ cần đặt 2 ly bất kỳ, MoRa Tea tặng ngay 1 ly cùng loại!',
    period: 'Thứ 6 – Chủ Nhật hàng tuần',
    tag: 'Trà Sữa',
  },
  {
    id: 2,
    image: '/sale/promo2.png',
    badge: 'Thành viên mới',
    title: 'Giảm 20% Đơn Đầu Tiên',
    desc: 'Đăng ký tài khoản MoRa Tea, đặt đơn đầu tiên và nhận ngay ưu đãi giảm 20% toàn bộ giỏ hàng. Không giới hạn giá trị đơn hàng.',
    period: 'Áp dụng cho đơn đầu tiên',
    tag: 'Tất cả',
  },
  {
    id: 3,
    image: '/sale/promo3.png',
    badge: 'Combo',
    title: 'Combo Bạn Bè – 4 Ly 99k',
    desc: 'Gọi combo 4 ly trà sữa truyền thống chỉ với 99.000đ. Lý tưởng cho những buổi tụ tập, hội nhóm hay gia đình cuối tuần.',
    period: '01/03/2025 – 31/03/2025',
    tag: 'Trà Sữa',
  },
  {
    id: 4,
    image: '/sale/promo4.png',
    badge: 'Giao hàng',
    title: 'Miễn Phí Giao Hàng',
    desc: 'Đặt đơn từ 100.000đ, MoRa Tea miễn phí giao hàng trong bán kính 5km. Đơn trên 200.000đ giao miễn phí không giới hạn khoảng cách.',
    period: 'Áp dụng mỗi ngày trong tuần',
    tag: 'Tất cả',
  },
  {
    id: 5,
    image: '/sale/promo5.png',
    badge: 'VIP',
    title: 'Tích Điểm Đổi Quà',
    desc: 'Mỗi 10.000đ mua hàng = 1 điểm tích lũy. Đổi 100 điểm lấy 1 ly trà sữa miễn phí. Điểm không hết hạn, dùng khi nào cũng được.',
    period: 'Không thời hạn',
    tag: 'Thành viên',
  },
  {
    id: 6,
    image: '/sale/promo6.png',
    badge: 'Giới hạn',
    title: 'Menu Hè – Chỉ Có Tháng 3',
    desc: 'MoRa Tea ra mắt menu hè đặc biệt gồm 5 thức uống làm mát từ trái cây nhiệt đới: Trà Đào Vải, Hồng Trà Cam Tươi, Chanh Dây Matcha.',
    period: '01/03/2025 – 31/03/2025',
    tag: 'Trà Trái Cây',
  },
];



const TABS = ['Tất cả', 'Trà Sữa', 'Trà Trái Cây', 'Thành viên'];

const BADGE_COLOR = {
  'Đang diễn ra': '#e05c00',
  'Thành viên mới': '#16a34a',
  'Combo': '#7c3aed',
  'Giao hàng': '#0ea5e9',
  'VIP': '#b45309',
  'Giới hạn': '#dc2626',
};

const PromotionsPage = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedPromo, setSelectedPromo] = useState(null);

  const filtered = activeTab === 'Tất cả'
    ? promotions
    : promotions.filter(p => p.tag === activeTab);

  return (
    <div className="promo-page">

      {/* ── HERO (straight edges, no wave) ── */}
      <div className="promo-hero">
        <div className="promo-hero-inner">
          <span className="promo-hero-eyebrow">Ưu đãi đặc biệt</span>
          <h1 className="promo-hero-title">Khuyến Mãi MoRa Tea</h1>
          <p className="promo-hero-desc">
            Những ưu đãi độc quyền dành riêng cho khách hàng thân thiết —<br />
            tiết kiệm hơn, thưởng thức nhiều hơn mỗi ngày.
          </p>
        </div>

        {/* Tabs moved inside hero to match BlogPage */}
        <div className="promo-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`promo-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="promo-body">

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="promo-empty">Không có khuyến mãi nào trong mục này.</p>
        ) : (
          <div className="promo-grid">
            {filtered.map(promo => (
              <div key={promo.id} className="promo-card">

                {/* Image */}
                <div className="promo-card-img-wrap">
                  <img src={promo.image} alt={promo.title} className="promo-card-img" />
                  <div className="promo-card-img-overlay" />
                  <span
                    className="promo-card-badge"
                    style={{ background: BADGE_COLOR[promo.badge] || '#e05c00' }}
                  >
                    {promo.badge}
                  </span>
                </div>

                {/* Body */}
                <div className="promo-card-body">
                  <div className="promo-card-period">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {promo.period}
                  </div>
                  <h3 className="promo-card-title">
                    <a href="#">{promo.title}</a>
                  </h3>
                  <p className="promo-card-desc">{promo.desc}</p>
                  
                  <button className="promo-card-cta" onClick={() => setSelectedPromo(promo)}>
                    Xem chi tiết
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Notice */}
        <div className="promo-notice">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>Ưu đãi có thể thay đổi theo từng thời điểm. Vui lòng liên hệ nhân viên để biết thêm thông tin chi tiết và điều khoản áp dụng.</p>
        </div>

      </div>

      {/* ── MODAL ── */}
      {selectedPromo && (
        <div className="promo-modal-overlay" onClick={() => setSelectedPromo(null)}>
          <div className="promo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="promo-modal-close" onClick={() => setSelectedPromo(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="promo-modal-img-wrap">
              <img src={selectedPromo.image} alt={selectedPromo.title} className="promo-modal-img" />
              <span className="promo-modal-badge" style={{ background: BADGE_COLOR[selectedPromo.badge] || '#e05c00' }}>
                {selectedPromo.badge}
              </span>
            </div>
            <div className="promo-modal-body">
              <h2 className="promo-modal-title">{selectedPromo.title}</h2>
              <div className="promo-modal-period">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {selectedPromo.period}
              </div>
              <p className="promo-modal-desc">{selectedPromo.desc}</p>
              
              <div className="promo-modal-footer">
                <button className="promo-modal-action-btn" onClick={() => {
                  setSelectedPromo(null);
                  window.location.href = '/menu';
                }}>
                  Sử dụng ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PromotionsPage;
