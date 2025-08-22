#!/usr/bin/env node

const http = require('http');

const API_BASE_URL = 'http://localhost:3001';

// Simple HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
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

    const req = http.request(requestOptions, (res) => {
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
      console.error('Request error:', error.message);
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testWHOAPI() {
  console.log('🧪 Testing WHO API Integration...\n');
  
  const testCases = [
    { message: 'pregnancy', language: 'en', expected: 'who_api' },
    { message: 'ubuzima', language: 'rw', expected: 'who_api' },
    { message: 'maternal health', language: 'en', expected: 'who_api' },
    { message: 'antenatal care', language: 'en', expected: 'who_api' }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.message}" (${testCase.language})`);
      
      const response = await makeRequest(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({
          message: testCase.message,
          language: testCase.language
        })
      });
      
      const data = response.data;
      
      console.log(`✅ Response received:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Expected Source: ${testCase.expected}`);
      
      if (data.source === 'who_api') {
        console.log(`   ✅ WHO API data received!`);
        console.log(`   Data Points: ${data.dataPoints}`);
        console.log(`   Country: ${data.country}`);
        if (data.apiData) {
          console.log(`   WHO Results: ${data.apiData.length} indicators`);
          data.apiData.forEach((item, index) => {
            console.log(`     ${index + 1}. ${item.indicatorName}: ${item.value} ${item.unit} (${item.year})`);
          });
        }
      } else {
        console.log(`   ❌ Using fallback instead of WHO API`);
        console.log(`   Content: ${data.content.substring(0, 100)}...`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error testing "${testCase.message}":`, error.message);
      console.log('');
    }
  }
}

async function testWHOEndpoint() {
  console.log('🌍 Testing direct WHO endpoint...\n');
  
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/who/maternal?country=RWA&lang=en&intents=anc4,sba,mmr`);
    
    console.log(`✅ WHO endpoint response:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Country: ${response.data.country}`);
    console.log(`   Language: ${response.data.language}`);
    console.log(`   Intents: ${response.data.intents.join(', ')}`);
    console.log(`   Results: ${response.data.results.length} indicators`);
    
    response.data.results.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.indicatorName}: ${item.value} ${item.unit} (${item.year})`);
    });
    
    console.log(`   Text: ${response.data.text.substring(0, 200)}...`);
    console.log('');
    
  } catch (error) {
    console.error(`❌ WHO endpoint error:`, error.message);
    console.log('');
  }
}

async function runTests() {
  console.log('🚀 Starting WHO API Tests...\n');
  
  await testWHOEndpoint();
  await testWHOAPI();
  
  console.log('✨ All WHO API tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWHOAPI, testWHOEndpoint };
