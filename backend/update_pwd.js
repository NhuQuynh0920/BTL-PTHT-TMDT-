import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Linh0912@', salt);
  
  await User.updateOne({ email: 'Linhngocho0912@gmail.com' }, { $set: { password: hashedPassword } });
  console.log('Password forcefully updated and hashed!');
  process.exit(0);
};

run();
