import mongoose from 'mongoose';

const toppingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const imageVariantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  width: Number,
  height: Number,
  format: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  description: { type: String, required: true },
  image: { type: String, required: true, default: '/images/sample.jpg' },
  featuredImage: { type: String },
  images: [imageVariantSchema],
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
  sugarLevels: { type: [String], default: ['0%', '30%', '50%', '70%', '100%'] },
  iceLevels: { type: [String], default: ['Không đá', 'Ít đá', 'Bình thường'] },
  toppings: [toppingSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  isMustTry: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

// Create indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ isMustTry: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
