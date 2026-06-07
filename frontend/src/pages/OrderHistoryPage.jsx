import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import './OrderHistory.css';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':    return 'Chờ xác nhận';
    case 'processing': return 'Đang xử lý';
    case 'shipped':    return 'Đang giao hàng';
    case 'delivered':  return 'Đã giao';
    case 'cancelled':  return 'Đã hủy';
    default: return status;
  }
};

const getPaymentMethodText = (method) => {
  switch (method?.toLowerCase()) {
    case 'cod':      return '💵 Thanh toán khi nhận hàng (COD)';
    case 'vnpay':    return '💳 VNPay';
    case 'momo':     return '💜 MoMo';
    case 'banking':  return '🏦 Chuyển khoản ngân hàng';
    default: return method || 'Không rõ';
  }
};

const getPaymentStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':    return { text: 'Đã thanh toán', color: '#16a34a', bg: '#dcfce7' };
    case 'pending': return { text: 'Chưa thanh toán', color: '#b45309', bg: '#fef3c7' };
    case 'failed':  return { text: 'Thanh toán thất bại', color: '#dc2626', bg: '#fee2e2' };
    default: return { text: status || 'Không rõ', color: '#555', bg: '#f3f4f6' };
  }
};

// --- Modal Chi Tiết Đơn Hàng ---
const OrderDetailModal = ({ order, onClose, userReviews }) => {
  if (!order) return null;
  const payStatus = getPaymentStatusText(order.paymentStatus);

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="order-modal-header">
          <div>
            <h2 className="order-modal-title">Chi tiết đơn hàng</h2>
            <p className="order-modal-code">{order.orderCode || order._id}</p>
          </div>
          <button className="order-modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="order-modal-body">
          {/* Thông tin người đặt & giao hàng */}
          <div className="order-modal-section">
            <h3 className="order-modal-section-title">👤 Thông tin người đặt</h3>
            <div className="order-modal-info-grid">
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Người đặt</span>
                <span className="order-modal-info-value">{order.user?.fullName || order.user?.name || 'N/A'}</span>
              </div>
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Số điện thoại</span>
                <span className="order-modal-info-value">{order.phone || 'N/A'}</span>
              </div>
              <div className="order-modal-info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="order-modal-info-label">Địa chỉ giao hàng</span>
                <span className="order-modal-info-value">{order.address || 'N/A'}</span>
              </div>
              {order.note && (
                <div className="order-modal-info-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="order-modal-info-label">Ghi chú</span>
                  <span className="order-modal-info-value" style={{ color: '#d35400' }}>{order.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thời gian */}
          <div className="order-modal-section">
            <h3 className="order-modal-section-title">🕐 Thời gian</h3>
            <div className="order-modal-info-grid">
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Ngày giờ đặt hàng</span>
                <span className="order-modal-info-value">
                  {new Date(order.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </span>
              </div>
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Hình thức giao hàng</span>
                <span className="order-modal-info-value">
                  {order.deliveryTime === 'immediate' || !order.deliveryTime
                    ? '⚡ Giao ngay'
                    : order.scheduledTime
                    ? `🕐 Giao lúc ${new Date(order.scheduledTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}`
                    : '📅 Giao theo lịch hẹn'}
                </span>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="order-modal-section">
            <h3 className="order-modal-section-title">💳 Thanh toán</h3>
            <div className="order-modal-info-grid">
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Phương thức</span>
                <span className="order-modal-info-value">{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
              <div className="order-modal-info-item">
                <span className="order-modal-info-label">Trạng thái thanh toán</span>
                <span className="order-modal-info-value">
                  <span style={{ background: payStatus.bg, color: payStatus.color, padding: '3px 10px', borderRadius: '12px', fontWeight: 600, fontSize: '13px' }}>
                    {payStatus.text}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="order-modal-section">
            <h3 className="order-modal-section-title">🧋 Sản phẩm đặt</h3>
            <div className="order-modal-products">
              {order.products.map((item, idx) => (
                <div key={idx} className="order-modal-product-row">
                  <div className="order-modal-product-info">
                    <span className="order-modal-product-name">{item.qty}x {item.name}</span>
                    <span className="order-modal-product-options">
                      Size {item.size || 'M'}
                      {item.sugarLevel ? ` · ${item.sugarLevel} Đường` : ''}
                      {item.iceLevel ? ` · ${item.iceLevel} Đá` : ''}
                      {item.toppings?.length > 0 ? ` · Topping: ${item.toppings.map(t => t.name).join(', ')}` : ''}
                    </span>
                    {order.status === 'Delivered' && (
                      userReviews.some(r => r.productId === item.product) ? (
                        <Link to={`/product/${item.product}`} className="order-modal-review-link reviewed">✓ Đã đánh giá</Link>
                      ) : (
                        <Link to={`/product/${item.product}`} className="order-modal-review-link">⭐ Đánh giá ngay</Link>
                      )
                    )}
                  </div>
                  <div className="order-modal-product-price">{formatCurrency(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="order-modal-summary">
            <div className="order-modal-summary-row">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.totalPrice - (order.shippingFee || 0) + (order.pointsUsed || 0))}</span>
            </div>
            {order.shippingFee > 0 && (
              <div className="order-modal-summary-row">
                <span>Phí giao hàng</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
            )}
            {order.pointsUsed > 0 && (
              <div className="order-modal-summary-row" style={{ color: '#16a34a' }}>
                <span>Điểm thưởng dùng</span>
                <span>- {formatCurrency(order.pointsUsed)}</span>
              </div>
            )}
            {order.tip > 0 && (
              <div className="order-modal-summary-row">
                <span>Tip cho shipper</span>
                <span>{formatCurrency(order.tip)}</span>
              </div>
            )}
            <div className="order-modal-summary-total">
              <span>TỔNG CỘNG</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Trang Lịch Sử Đơn Hàng ---
const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get('/api/orders/myorders', config),
          axios.get('/api/reviews/mine/all', config).catch(() => ({ data: [] }))
        ]);
        setOrders(ordersRes.data);
        setUserReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleOpenDetail = async (order) => {
    // Fetch full order with populated user info
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/orders/${order._id}`, config);
      setSelectedOrder(res.data);
    } catch {
      setSelectedOrder(order);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi hủy đơn hàng');
    }
  };

  return (
    <div className="history-page">
      {loading ? (
        <h3>Đang tải đơn hàng...</h3>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-cart">
          <p>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>MÃ ĐƠN HÀNG</th>
                <th>SẢN PHẨM</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="order-row-clickable" onClick={() => handleOpenDetail(order)}>
                  <td><code>{order.orderCode || order._id}</code></td>
                  <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, minWidth: '200px' }}>
                      {order.products.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '8px', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
                          <strong style={{ color: '#d35400' }}>{item.qty}x {item.name}</strong>
                          {order.status === 'Delivered' && (
                            userReviews.some(r => r.productId === item.product) ? (
                              <Link to={`/product/${item.product}`} onClick={(e) => e.stopPropagation()} style={{ marginLeft: '10px', fontSize: '13px', color: '#16a34a', textDecoration: 'none', fontWeight: 'bold' }}>
                                ✓ Đã đánh giá
                              </Link>
                            ) : (
                              <Link to={`/product/${item.product}`} onClick={(e) => e.stopPropagation()} style={{ marginLeft: '10px', fontSize: '13px', color: '#ff7043', textDecoration: 'underline', fontWeight: 'bold' }}>
                                Đánh giá ngay
                              </Link>
                            )
                          )}
                          <br/>
                          <span style={{ fontSize: '0.85em', color: '#666' }}>
                            (Size {item.size || 'M'}
                            {item.sugarLevel ? ` - ${item.sugarLevel} Đường` : ''}
                            {item.iceLevel ? ` - ${item.iceLevel} Đá` : ''})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <div style={{ marginBottom: '4px' }}>{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                    {order.deliveryTime && order.deliveryTime !== 'immediate' ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 border border-orange-100 shadow-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        <span className="text-[11px] font-bold tracking-wide">{order.deliveryTime === 'scheduled' ? 'Hẹn giờ' : order.deliveryTime}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85em', color: '#27ae60', fontWeight: 'bold', background: '#e9f7ef', display: 'inline-block', padding: '2px 8px', borderRadius: '4px' }}>
                        ⚡ Giao ngay
                      </div>
                    )}
                  </td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                  <td>
                    <div className="status-action-container">
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.status === 'Pending' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id); }}
                          className="btn-cancel-order"
                          title="Hủy đơn hàng này"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          userReviews={userReviews}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
