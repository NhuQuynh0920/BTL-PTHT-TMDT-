import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle token expiry or standardized errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Return standard error message from our backend
    const message = error.response?.data?.message || error.message;
    if (error.response?.status === 401) {
      // Optional: Handle logout on unauthorized
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
