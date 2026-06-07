import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'email role fullName name');
    console.log(users);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

run();
