import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from server (cookie-based auth)
    const checkSession = async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        // Only allow admin users in dashboard
        if (data.role === 'admin') {
          setUser(data);
          localStorage.setItem('userInfo', JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem('userInfo');
        }
      } catch (error) {
        // Session invalid or expired
        setUser(null);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      
      // Check admin role
      if (data.role !== 'admin') {
        setLoading(false);
        return { success: false, error: 'Tài khoản này không có quyền quản trị viên' };
      }
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
