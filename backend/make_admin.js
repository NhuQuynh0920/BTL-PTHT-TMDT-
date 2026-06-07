import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateOne(
      { email: 'linhngocho0912@gmail.com' }, 
      { $set: { role: 'admin' } }
    );
    console.log('Update result:', result);
    console.log('Successfully set linhngocho0912@gmail.com as admin!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

run();
