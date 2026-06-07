import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.updateOne(
    { email: 'linhngocho912@gmail.com' },
    { $set: { isVerified: true, role: 'admin' } }
  );
  console.log('✅ Updated linhngocho0912@gmail.com to be verified and admin.');
  process.exit(0);
};

run();
