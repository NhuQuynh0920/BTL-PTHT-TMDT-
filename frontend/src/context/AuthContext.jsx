import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/users/profile');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password, rememberMe }, config);
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || 'Lỗi kết nối',
        requireVerification: error.response?.data?.requireVerification,
        email: error.response?.data?.email
      };
    }
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users', { fullName, email, password }, config);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.errors
        ? error.response.data.errors.map(err => Object.values(err)[0]).join(', ')
        : error.response?.data?.message || 'Lỗi kết nối';
      return { success: false, error: errMsg };
    }
  }, []);

  const verifyAccount = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/verify-account', { email, otp }, config);
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.message || 'Lỗi kết nối' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    verifyAccount
  }), [user, loading, login, register, logout, checkAuth, verifyAccount]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
