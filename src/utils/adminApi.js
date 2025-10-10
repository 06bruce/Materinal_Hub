import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Analytics
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/analytics`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Users
export const getUsers = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/api/admin/users/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Pregnant Users
export const getPregnantUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/pregnant-users`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
