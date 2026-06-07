import Order from '../../models/Order.js';

export const getOrderStatus = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'fullName email');
    if (!order) {
      return { error: 'Không tìm thấy đơn hàng với mã này.' };
    }
    
    return {
      orderId: order._id,
      customer: order.user?.fullName || 'Khách',
      status: order.status,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      items: order.orderItems.map(item => `${item.qty}x ${item.name}`).join(', ')
    };
  } catch (error) {
    console.error('Error fetching order status:', error);
    return { error: 'Mã đơn hàng không hợp lệ hoặc có lỗi xảy ra.' };
  }
};
