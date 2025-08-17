const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function getToken() {
  try {
    console.log('🔐 Getting JWT Token...\n');
    
    // First, try to register a new user
    console.log('📝 Attempting to register a new user...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('✅ User registered successfully!');
      console.log('🎫 Token:', registerResponse.data.token);
      console.log('👤 User:', registerResponse.data.user.name);
      return registerResponse.data.token;
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists, trying to login...');
        
        // Try to login instead
        const loginData = {
          email: 'test@example.com',
          password: 'password123'
        };
        
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        console.log('✅ Login successful!');
        console.log('🎫 Token:', loginResponse.data.token);
        console.log('👤 User:', loginResponse.data.user.name);
        return loginResponse.data.token;
      } else {
        throw registerError;
      }
    }
    
  } catch (error) {
    console.error('❌ Error getting token:', error.response?.data || error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. Backend server is running on port 3001');
    console.log('2. MongoDB is connected');
    console.log('3. Environment variables are set correctly');
  }
}

// Run the function
getToken();

