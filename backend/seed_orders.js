import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const admin = await User.findOne({ role: 'admin' });
    const products = await Product.find({}).limit(10);

    if (!admin || products.length === 0) {
      console.log('Missing admin user or products');
      process.exit(1);
    }

    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    // Create 60 fake orders over the last 30 days
    const newOrders = [];
    const now = new Date();

    for (let i = 0; i < 60; i++) {
      // Random date between now and 30 days ago
      const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      // Random 1 to 3 products per order
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const orderProducts = [];
      let totalPrice = 0;

      for (let j = 0; j < numProducts; j++) {
        const randProduct = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2
        
        orderProducts.push({
          product: randProduct._id,
          name: randProduct.name,
          qty: qty,
          price: randProduct.price,
          size: Math.random() > 0.5 ? 'L' : 'M',
          sugarLevel: Math.random() > 0.5 ? '50%' : '100%',
          iceLevel: Math.random() > 0.5 ? '50%' : '100%'
        });
        
        totalPrice += randProduct.price * qty;
      }

      // Add random shipping fee
      const shippingFee = Math.floor(Math.random() * 3) * 10000 + 15000; // 15k, 25k, or 35k
      totalPrice += shippingFee;

      // Most older orders are Delivered, recent ones might be Pending/Processing
      let status = 'Delivered';
      const daysAgo = (now.getTime() - pastDate.getTime()) / (1000 * 3600 * 24);
      
      if (daysAgo < 2) {
        status = statuses[Math.floor(Math.random() * 3)]; // Pending, Processing, Shipped
      } else if (Math.random() < 0.1) {
        status = 'Cancelled';
      }

      newOrders.push({
        user: admin._id,
        products: orderProducts,
        totalPrice,
        address: '96A Trần Phú, Mộ Lao, Hà Đông, Hà Nội',
        phone: '0987654321',
        shippingFee,
        distance: Math.random() * 5 + 1,
        status,
        paymentMethod: Math.random() > 0.5 ? 'Tiền mặt' : 'Chuyển khoản',
        createdAt: pastDate,
        updatedAt: pastDate
      });
    }

    await Order.insertMany(newOrders);
    console.log(`✅ Successfully inserted ${newOrders.length} fake orders.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
