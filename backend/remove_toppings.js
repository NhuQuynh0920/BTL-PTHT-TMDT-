import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const result = await Product.updateMany(
      { category: { $in: ['CaPhe', 'Khac', 'Cà Phê', 'Khác'] } },
      { $set: { toppings: [] } }
    );
    
    console.log('Update result:', result);
    console.log('Successfully removed toppings from CaPhe and Khac!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

run();
