// API Configuration for connecting to backend
const API_CONFIG = {
  // Backend base URL - change this based on your environment
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/api/chat',
    HEALTH: '/health',
    HEALTH_CENTERS: '/api/health-centers',
    PREGNANCY_INFO: '/api/pregnancy-info',
    EMERGENCY_CONTACTS: '/api/emergency-contacts',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile'
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const config = {
    method: 'GET',
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    },
    timeout: API_CONFIG.TIMEOUT,
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_CONFIG;
