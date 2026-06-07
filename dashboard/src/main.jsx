import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

// Add a response interceptor to handle 401 Unauthorized globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/api/users/profile') && // Don't redirect on session check
      !error.config.url.includes('/api/users/login') &&  // Don't redirect on login
      window.location.pathname !== '/login'              // Don't redirect if already on login
    ) {
      // Clear invalid/expired session
      localStorage.removeItem('userInfo');
      // Redirect to login page
      window.location.href = '/login?error=expired';
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
