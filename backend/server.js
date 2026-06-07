import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Security Middlewares
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import toppingRoutes from './routes/toppingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userNotificationRoutes from './routes/userNotificationRoutes.js';

connectDB();

const app = express();

// 1. Set security HTTP headers
app.use(helmet());

// 2. Rate limiting (Global) - Giới hạn 100 requests / 15 phút cho mỗi IP để chống spam/DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, // Tăng lên 200 cho development/testing
  message: 'Too many requests from this IP, please try again in 15 minutes'
});
app.use('/api', limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5176',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Body parser
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('MoRa Tea API is running...');
});

app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/toppings', toppingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user-notifications', userNotificationRoutes);

// Error handlers
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
