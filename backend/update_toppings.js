import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const baseToppings = [
  { name: 'Trân châu đen', price: 5000 },
  { name: 'Trân châu trắng', price: 6000 },
  { name: 'Thạch nha đam', price: 5000 },
  { name: 'Pudding trứng', price: 8000 },
  { name: 'Kem cheese', price: 10000 }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const result = await Product.updateMany(
      {},
      { $set: { toppings: baseToppings } }
    );
    console.log('Update result:', result);
    console.log('Successfully added toppings to all products!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

run();
