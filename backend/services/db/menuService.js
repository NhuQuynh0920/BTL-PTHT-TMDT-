import Product from '../../models/Product.js';

export const getMenu = async () => {
  try {
    const products = await Product.find({ isAvailable: true }).select('name price category rating numReviews description');
    return products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      rating: p.rating,
      description: p.description
    }));
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
};

export const getBestSeller = async () => {
  try {
    const products = await Product.find({ isAvailable: true })
      .sort({ rating: -1, numReviews: -1 })
      .limit(5)
      .select('name price category rating');
    return products.map(p => ({
      name: p.name,
      price: p.price,
      rating: p.rating
    }));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
};

export const getLowSugarDrinks = async () => {
  // Trà sữa và trà trái cây thường có tùy chọn ít ngọt
  return [
    { name: "Hồng Trà Sữa", suggestion: "Có thể chọn mức đường 30% hoặc 50%" },
    { name: "Trà Đào Cam Sả", suggestion: "Nước ép đào tự nhiên, có thể yêu cầu không đường" },
    { name: "Trà Vải Nhiệt Đới", suggestion: "Có thể chọn 30% đường" }
  ];
};
