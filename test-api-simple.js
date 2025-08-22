#!/usr/bin/env node

const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://localhost:3001';

// Simple HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error details:', error.message);
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test messages for different categories
const testMessages = [
  { message: 'pregnancy', category: 'pregnancy' },
  { message: 'ubuzima', category: 'pregnancy' },
  { message: 'emergency', category: 'emergency' },
  { message: 'ingenzi', category: 'emergency' },
  { message: 'nutrition', category: 'nutrition' },
  { message: 'ibiryo', category: 'nutrition' },
  { message: 'mental health', category: 'mental_health' },
  { message: 'exercise', category: 'exercise' }
];

async function testChatAPI() {
  console.log('🧪 Testing Maternal Health Chat API...\n');
  
  for (const test of testMessages) {
    try {
      console.log(`📝 Testing: "${test.message}" (expected category: ${test.category})`);
      
      const response = await makeRequest(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({
          message: test.message,
          language: 'en'
        })
      });
      
      const data = response.data;
      
      console.log(`✅ Response received:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Confidence: ${(data.confidence * 100).toFixed(1)}%`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Content: ${data.content.substring(0, 100)}...`);
      
      if (data.apiData) {
        console.log(`   Data Points: ${data.dataPoints}`);
        console.log(`   WHO Indicators: ${data.apiData.length}`);
      }
      
      if (data.suggestions) {
        console.log(`   Suggestions: ${data.suggestions.length} available`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error testing "${test.message}":`, error.message);
      console.log('');
    }
  }
}

async function testHealthCheck() {
  try {
    console.log('🏥 Testing health check endpoint...');
    const response = await makeRequest(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    console.log('');
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('Error details:', error);
    console.log('');
  }
}

async function testHealthCenters() {
  try {
    console.log('🏥 Testing health centers endpoint...');
    const response = await makeRequest(`${API_BASE_URL}/api/health-centers`);
    console.log(`✅ Health centers loaded: ${response.data.length} centers`);
    console.log('');
  } catch (error) {
    console.error('❌ Health centers test failed:', error.message);
    console.log('');
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testHealthCheck();
  await testHealthCenters();
  await testChatAPI();
  
  console.log('✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testChatAPI, testHealthCheck, testHealthCenters };
