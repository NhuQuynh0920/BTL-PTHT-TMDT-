import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const UserOrderHistory = () => {
  const { id: userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        
        // Fetch User Info
        const { data: userData } = await axios.get(`/api/users/${userId}`);
        setUserProfile(userData);

        // Fetch User Orders
        const { data: orderData } = await axios.get(`/api/orders/user/${userId}`);
        setOrders(orderData);
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, currentUser]);

  const getStatusBadge = (status) => {
    let color = '#64748b', bg = '#f1f5f9', border = '#e2e8f0', label = status;
    switch (status) {
      case 'Pending': label = 'Chờ duyệt'; bg = '#fff7ed'; color = '#f97316'; border = '#fed7aa'; break;
      case 'Processing': label = 'Đang pha chế'; bg = '#eff6ff'; color = '#3b82f6'; border = '#bfdbfe'; break;
      case 'Shipped': label = 'Đang giao'; bg = '#f5f3ff'; color = '#8b5cf6'; border = '#ddd6fe'; break;
      case 'Delivered': label = 'Đã giao'; bg = '#f0fdf4'; color = '#16a34a'; border = '#bbf7d0'; break;
      case 'Cancelled': label = 'Đã hủy'; bg = '#fef2f2'; color = '#dc2626'; border = '#fecaca'; break;
    }
    return (
      <span style={{
        display: 'inline-block', fontSize: '0.72rem', fontWeight: '600',
        padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.04em', whiteSpace: 'nowrap',
        background: bg, color: color, border: `1px solid ${border}`
      }}>
        {label}
      </span>
    );
  };

  const cleanAddress = (addr) => {
    if (!addr) return 'Không có';
    const parts = addr.split(',').map(p => p.trim()).filter(Boolean);
    return [...new Set(parts)].join(', ');
  };

  return (
    <div className="admin-view">
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedOrder(null)}>
           <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
               <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Chi tiết Đơn hàng #{selectedOrder.orderCode || selectedOrder._id}</h3>
               <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '0.875rem', color: '#475569' }}>
               <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                 <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>THÔNG TIN KHÁCH HÀNG</p>
                 <strong style={{ color: '#1e293b' }}>{selectedOrder.user?.name || selectedOrder.user?.fullName || userProfile?.fullName || userProfile?.name || 'Khách vãng lai'}</strong><br/>
                 SĐT: {selectedOrder.phone}<br/>
                 Email: {selectedOrder.user?.email || userProfile?.email || 'Không có'}
               </div>
               <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                 <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>GIAO HÀNG & THANH TOÁN</p>
                 Địa chỉ: {cleanAddress(selectedOrder.address)}<br/>
                 Hình thức TT: <strong>{selectedOrder.paymentMethod === 'VNPAY' ? 'VNPAY' : 'Tiền mặt (COD)'}</strong><br/>
                 Ghi chú: {selectedOrder.note || 'Không có'}
               </div>
             </div>

             <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.875rem' }}>
               <thead>
                 <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                   <th style={{ textAlign: 'left', padding: '12px 8px' }}>Sản phẩm</th>
                   <th style={{ textAlign: 'center', padding: '12px 8px' }}>SL</th>
                   <th style={{ textAlign: 'right', padding: '12px 8px' }}>Đơn giá</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedOrder.products?.map((item, idx) => (
                   <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '12px 8px' }}>
                       <div style={{ fontWeight: '700', color: '#1e293b' }}>{item.name}</div>
                       <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                         {item.size ? `Size ${item.size}` : ''} 
                         {item.ice ? ` • Đá ${item.ice}` : ''} 
                         {item.sugar ? ` • Đường ${item.sugar}` : ''}
                       </div>
                       {item.toppings?.length > 0 && (
                         <div style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '2px' }}>
                           + {item.toppings.map(t => t.name).join(', ')}
                         </div>
                       )}
                     </td>
                     <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>x{item.qty}</td>
                     <td style={{ textAlign: 'right', fontWeight: '600', color: '#334155' }}>{item.price.toLocaleString()}đ</td>
                   </tr>
                 ))}
               </tbody>
             </table>

             <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tạm tính:</span>
                  <span>{(selectedOrder.totalPrice - (selectedOrder.shippingFee || 0)).toLocaleString()}đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phí vận chuyển:</span>
                  <span>{selectedOrder.shippingFee ? `${selectedOrder.shippingFee.toLocaleString()}đ` : 'Miễn phí'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontSize: '1.25rem', fontWeight: '800', color: '#b22830' }}>
                  <span>TỔNG CỘNG:</span>
                  <span>{selectedOrder.totalPrice.toLocaleString()}đ</span>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
            Lịch Sử Đơn Hàng
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Lịch sử giao dịch của {userProfile ? userProfile.name : 'khách hàng'}
          </p>
        </div>
        <Link 
          to="/admin/users" 
          style={{
            padding: '8px 16px', borderRadius: '10px',
            background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: '600',
            textDecoration: 'none', transition: 'all 0.2s', border: '1px solid #e2e8f0'
          }}
          onMouseEnter={e => e.target.style.background = '#e2e8f0'}
          onMouseLeave={e => e.target.style.background = '#f1f5f9'}
        >
          Quay lại danh sách
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #fef2f2', borderTopColor: '#b22830', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <>
          {userProfile && (
            <div style={{ 
              background: '#fff', padding: '20px', borderRadius: '16px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center'
            }}>
               <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '1.5rem', color: '#64748b'
               }}>
                  {userProfile.avatar ? <img src={userProfile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} /> : (userProfile.fullName || userProfile.name || 'U').charAt(0).toUpperCase()}
               </div>
               <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>
                    {userProfile.fullName || userProfile.name || 'Không có tên'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Email: {userProfile.email}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>SĐT: {userProfile.phone || 'Chưa cập nhật'}</p>
               </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
               <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>Khách hàng này chưa có đơn hàng nào.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>MÃ ĐH</th>
                    <th style={{ width: '150px' }}>NGÀY ĐẶT</th>
                    <th>SỐ LƯỢNG MÓN</th>
                    <th style={{ width: '150px' }}>TỔNG TIỀN</th>
                    <th style={{ width: '140px' }}>TRẠNG THÁI</th>
                    <th style={{ width: '100px', textAlign: 'right' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top' }}>
                        <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.85rem' }}>
                          {order.orderCode || order._id}
                        </span>
                      </td>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: '600', color: '#475569', fontSize: '0.85rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top' }}>
                        <span style={{ fontWeight: '700', color: '#334155', fontSize: '0.9rem' }}>
                          {order.products.reduce((acc, p) => acc + p.qty, 0)} ly
                        </span>
                      </td>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top' }}>
                        <span style={{ fontWeight: '800', color: '#b22830', fontSize: '0.95rem' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                        </span>
                      </td>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top' }}>
                        {getStatusBadge(order.status)}
                      </td>
                      <td style={{ paddingTop: '16px', verticalAlign: 'top', textAlign: 'right' }}>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', 
                            fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', 
                            padding: '6px 12px', borderRadius: '6px',
                            transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '4px',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserOrderHistory;
