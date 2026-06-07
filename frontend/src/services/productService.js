import api from './api.js';

export const getProducts = () => {
  return api.get('/products');
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const getProductReviews = (id) => {
  return api.get(`/products/${id}/reviews`);
};

export const createProductReview = (id, reviewData) => {
  return api.post(`/products/${id}/reviews`, reviewData);
};
