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


// Example api.js
export const apiRequest = async (url, options = {}) => {
  const apiUrl = getApiUrl(url);
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    // body should already be stringified in ChatContext.js
  };
  const response = await fetch(apiUrl, fetchOptions);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
};


export default API_CONFIG;
