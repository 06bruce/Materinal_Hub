import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  ENDPOINTS: {
    CHAT: '/api/chat',
    HEALTH: '/health',
    HEALTH_CENTERS: '/api/health-centers',
    PREGNANCY_INFO: '/api/pregnancy-info',
    EMERGENCY_CONTACTS: '/api/emergency-contacts',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      ME: '/api/auth/me',
      LOGOUT: '/api/auth/logout',
    }
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('maternalHealthUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    getProfile: () => apiClient.get('/api/auth/me'),
    updateProfile: (profileData) => apiClient.put('/api/auth/profile', profileData),
    logout: () => apiClient.post('/api/auth/logout'),
  },

  // Chat endpoints
  chat: {
    sendMessage: (messageData) => apiClient.post('/api/chat', messageData),
  },

  // Health endpoints
  health: {
    getCenters: () => apiClient.get('/api/health-centers'),
    getEmergencyContacts: () => apiClient.get('/api/emergency-contacts'),
  },

  // Health check
  healthCheck: () => apiClient.get('/health'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  return 'An error occurred. Please try again.';
};

export const isNetworkError = (error) => {
  return !error.response && error.message === 'Network Error';
};

// Fetch-based API request function (for compatibility with existing code)
export const apiRequest = async (url, options = {}) => {
  const apiUrl = getApiUrl(url);
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };
  const response = await fetch(apiUrl, fetchOptions);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
};

export { API_CONFIG };
export default apiClient;
