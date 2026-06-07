import Product from '../models/Product.js';
import Topping from '../models/Topping.js';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';

const sizes = [
  { label: 'thumbnail', width: 250 },
  { label: 'medium', width: 800 },
  { label: 'large', width: 1600 },
];

const uploadBufferToCloudinary = (buffer, publicId) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'trasua-products',
      public_id: publicId,
      resource_type: 'image',
      format: 'webp',
      overwrite: true,
      transformation: [{ quality: 'auto' }],
    },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  uploadStream.end(buffer);
});

const normalizeBoolean = (value) => {
  if (typeof value === 'string') {
    return value === 'true';
  }
  return Boolean(value);
};

const processProductImageUpload = async (product, buffer) => {
  const uploadedImages = [];

  const originalResult = await uploadBufferToCloudinary(
    buffer,
    `product_${product._id}_${Date.now()}_original`
  );

  uploadedImages.push({
    label: 'original',
    url: originalResult.secure_url,
    publicId: originalResult.public_id,
    width: originalResult.width,
    height: originalResult.height,
    format: originalResult.format,
  });

  for (const size of sizes) {
    const resizedBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: size.width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const result = await uploadBufferToCloudinary(
      resizedBuffer,
      `product_${product._id}_${Date.now()}_${size.label}`
    );

    uploadedImages.push({
      label: size.label,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  }

  product.image = uploadedImages.find((item) => item.label === 'medium')?.url || uploadedImages[0].url;
  product.featuredImage = uploadedImages.find((item) => item.label === 'thumbnail')?.url || product.image;
  product.images = uploadedImages;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, subCategory, isAvailable, sizes, toppings } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error('Vui lòng cung cấp tên, giá và danh mục sản phẩm.');
  }

  const parsedPrice = Number(price);
  const parsedIsAvailable = isAvailable !== undefined ? normalizeBoolean(isAvailable) : true;

  let defaultSizes = sizes;
  if (!defaultSizes || defaultSizes.length === 0) {
    if (category.includes('TraSua') || category.includes('TraTraiCay') || category.includes('CaPhe')) {
      defaultSizes = [
        { size: 'M', price: 5000 },
        { size: 'L', price: 10000 }
      ];
    } else {
      defaultSizes = [];
    }
  }

  let defaultToppings = toppings;
  if (!defaultToppings || defaultToppings.length === 0) {
    if (category.includes('TraSua') || category.includes('TraTraiCay')) {
      const globalToppings = await Topping.find({ isAvailable: true });
      defaultToppings = globalToppings.map(t => ({ name: t.name, price: t.price }));
    } else {
      defaultToppings = [];
    }
  }

  const product = new Product({
    name,
    price: parsedPrice,
    description: description || 'No description provided',
    image: image || '/images/sample.jpg',
    category,
    subCategory: subCategory || '',
    isAvailable: parsedIsAvailable,
    sizes: defaultSizes,
    toppings: defaultToppings,
  });

  if (req.file) {
    await processProductImageUpload(product, req.file.buffer);
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, subCategory, isAvailable, isMustTry, sizes, sugarLevels, iceLevels, toppings } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ?? product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.subCategory = subCategory ?? product.subCategory;
    product.isAvailable = isAvailable !== undefined ? normalizeBoolean(isAvailable) : product.isAvailable;
    product.isMustTry = isMustTry ?? product.isMustTry;
    let updatedSizes = sizes ?? product.sizes;
    if ((!updatedSizes || updatedSizes.length === 0) && (product.category.includes('TraSua') || product.category.includes('TraTraiCay') || product.category.includes('CaPhe'))) {
       updatedSizes = [
        { size: 'M', price: 5000 },
        { size: 'L', price: 10000 }
      ];
    }
    
    let updatedToppings = toppings ?? product.toppings;
    if ((!updatedToppings || updatedToppings.length === 0) && (product.category.includes('TraSua') || product.category.includes('TraTraiCay'))) {
       const globalToppings = await Topping.find({ isAvailable: true });
       updatedToppings = globalToppings.map(t => ({ name: t.name, price: t.price }));
    }

    product.sizes = updatedSizes;
    product.sugarLevels = sugarLevels ?? product.sugarLevels;
    product.iceLevels = iceLevels ?? product.iceLevels;
    product.toppings = updatedToppings;

    if (req.file) {
      await processProductImageUpload(product, req.file.buffer);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Upload product image and store multiple optimized sizes
// @route   POST /api/products/:id/upload-image
// @access  Private/Admin
export const uploadProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  const originalBuffer = await sharp(req.file.buffer)
    .rotate()
    .webp({ quality: 85 })
    .toBuffer();

  const uploadedImages = [];

  const originalResult = await uploadBufferToCloudinary(
    originalBuffer,
    `product_${product._id}_${Date.now()}_original`
  );

  uploadedImages.push({
    label: 'original',
    url: originalResult.secure_url,
    publicId: originalResult.public_id,
    width: originalResult.width,
    height: originalResult.height,
    format: originalResult.format,
  });

  for (const size of sizes) {
    const resizedBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: size.width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const result = await uploadBufferToCloudinary(
      resizedBuffer,
      `product_${product._id}_${Date.now()}_${size.label}`
    );

    uploadedImages.push({
      label: size.label,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  }

  product.image = uploadedImages.find((item) => item.label === 'medium')?.url || uploadedImages[0].url;
  product.featuredImage = uploadedImages.find((item) => item.label === 'thumbnail')?.url || product.image;
  product.images = uploadedImages;

  const updatedProduct = await product.save();

  res.json({ product: updatedProduct, uploaded: uploadedImages });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
