import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import './Admin.css';

const STATUS_MAP = {
  Pending:    { label: 'Chờ duyệt',   color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  Processing: { label: 'Đang pha chế',color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  Shipped:    { label: 'Đang giao',   color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  Delivered:  { label: 'Đã giao',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Cancelled:  { label: 'Đã hủy',      color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

const getPaymentStatusText = (status) => {
  switch (status) {
    case 'Pending': return { text: 'Chờ thanh toán', color: '#f59e0b', bg: '#fef3c7' };
    case 'Waiting Confirmation': return { text: 'Chờ xác nhận CK', color: '#f97316', bg: '#ffedd5' };
    case 'Paid': return { text: 'Đã thanh toán', color: '#10b981', bg: '#d1fae5' };
    case 'Failed': return { text: 'Thất bại', color: '#ef4444', bg: '#fee2e2' };
    default: return { text: 'Chưa thanh toán', color: '#64748b', bg: '#f1f5f9' };
  }
};

const cleanAddress = (addr) => {
  if (!addr) return '—';
  const parts = addr.split(',').map(p => p.trim()).filter(Boolean);
  return [...new Set(parts)].join(', ');
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.72rem', fontWeight: '600',
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
      padding: '3px 10px', borderRadius: '4px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const s = getPaymentStatusText(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '0.75rem', fontWeight: '600',
      color: s.color, whiteSpace: 'nowrap'
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0 }}></span>
      {s.text}
    </span>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/all');
      setOrders(data);
      setErrorMsg(null);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(); 

    const handleNewOrder = () => {
      fetchOrders();
    };

    window.addEventListener('new-order', handleNewOrder);
    return () => window.removeEventListener('new-order', handleNewOrder);
  }, [user]);

  const updateStatusHandler = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePaymentStatusHandler = async (id, paymentStatus) => {
    if(window.confirm('Xác nhận đã nhận được tiền chuyển khoản cho đơn hàng này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/orders/${id}/payment-status`, { paymentStatus }, config);
        // Automatically move order to Processing if it was just Waiting Confirmation
        await axios.put(`/api/orders/${id}/status`, { status: 'Processing' }, config);
        fetchOrders();
      } catch (error) {
        alert('Lỗi xác nhận thanh toán');
      }
    }
  };

  const filtered = orders.filter(o => {
    const statusMatch = filterStatus === 'All' || o.status === filterStatus;
    const methodMatch = filterMethod === 'All' || o.paymentMethod === filterMethod;
    return statusMatch && methodMatch;
  });

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
                 <strong style={{ color: '#1e293b' }}>{selectedOrder.user?.name || selectedOrder.user?.fullName || 'Khách vãng lai'}</strong><br/>
                 SĐT: {selectedOrder.phone}<br/>
                 Email: {selectedOrder.user?.email || 'Không có'}
               </div>
               <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                 <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>GIAO HÀNG & THANH TOÁN</p>
                 Địa chỉ: {cleanAddress(selectedOrder.address)}<br/>
                 Thời gian: <strong>{selectedOrder.deliveryTime === 'immediate' ? 'Giao ngay' : (selectedOrder.deliveryTime === 'scheduled' ? 'Hẹn giờ' : selectedOrder.deliveryTime)}</strong><br/>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
            Quản Lý Đơn Hàng
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Theo dõi và cập nhật trạng thái đơn hàng của khách
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filterMethod}
            onChange={e => setFilterMethod(e.target.value)}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              border: '1px solid #e2e8f0', background: '#fff',
              fontSize: '0.85rem', fontWeight: '500', color: '#475569',
              outline: 'none', cursor: 'pointer', minWidth: '160px',
            }}
          >
            <option value="All">Tất cả hình thức TT</option>
            <option value="COD">Tiền mặt (COD)</option>
            <option value="VNPAY">VNPAY</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              border: '1px solid #e2e8f0', background: '#fff',
              fontSize: '0.85rem', fontWeight: '500', color: '#475569',
              outline: 'none', cursor: 'pointer', minWidth: '160px',
            }}
          >
            <option value="All">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #fef2f2', borderTopColor: '#b22830', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : errorMsg ? (
        <div style={{ padding: '20px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Lỗi lấy dữ liệu:</strong> {errorMsg}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Mã ĐH</th>
                <th style={{ width: '160px' }}>Khách hàng</th>
                <th>Địa chỉ giao hàng</th>
                <th style={{ width: '160px' }}>Thanh toán</th>
                <th style={{ width: '120px' }}>Trạng thái</th>
                <th style={{ width: '160px' }}>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} style={{ transition: 'all 0.2s', borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.85rem' }}>
                      {order.orderCode || order._id}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {order.deliveryTime && order.deliveryTime !== 'immediate' && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#b22830', fontWeight: 'bold', background: '#fef2f2', border: '1px solid #fecaca', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>
                        🕒 {order.deliveryTime === 'scheduled' ? 'Hẹn giờ' : order.deliveryTime}
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem', marginBottom: '2px' }}>
                      {order.user?.name || order.user?.fullName || 'Khách vãng lai'}
                    </div>
                    {order.user?.email && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {order.user.email}
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <div style={{
                      fontSize: '0.8rem', color: '#475569', lineHeight: '1.4',
                    }}>
                      {cleanAddress(order.address)}
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>
                        {order.totalPrice.toLocaleString()}đ
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                         <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                           {order.paymentMethod === 'VNPAY' ? (
                             <><svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> VNPAY</>
                           ) : (
                             <><svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg> Tiền mặt (COD)</>
                           )}
                         </span>
                         <PaymentBadge status={order.paymentStatus} />
                      </div>
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatusHandler(order._id, e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: '6px',
                            border: '1px solid #cbd5e1', background: '#fff',
                            fontSize: '0.8rem', fontWeight: '500', color: '#334155',
                            outline: 'none', cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            background: 'transparent', border: 'none', color: '#3b82f6', 
                            fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', 
                            padding: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                            transition: 'color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}
                          title="Xem chi tiết"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                      </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '0.875rem' }}>
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
