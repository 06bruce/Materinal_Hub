import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Check if admin is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Admin login attempt to:', `${API_URL}/api/admin/login`);
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        setAdmin(admin);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('Error details:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    getAuthHeader,
    API_URL
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
