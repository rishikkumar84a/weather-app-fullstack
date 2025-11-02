// Quick Test Script for Weather API
// Run with: node test-api.js

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing Weather API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ Health Check:', healthResponse.data);
    console.log();

    // Test 2: Get Current Weather
    console.log('2. Testing Get Current Weather...');
    const weatherResponse = await axios.get(`${API_URL}/weather/current`, {
      params: { type: 'city', value: 'London' }
    });
    console.log('✅ Current Weather for London:');
    console.log('   Temperature:', weatherResponse.data.current.temp + '°C');
    console.log('   Description:', weatherResponse.data.current.description);
    console.log('   Forecast days:', weatherResponse.data.forecast.length);
    console.log();

    // Test 3: Create Weather Record
    console.log('3. Testing Create Weather Record...');
    const createResponse = await axios.post(`${API_URL}/weather/records`, {
      location: {
        type: 'city',
        value: 'London'
      },
      dateRange: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-07')
      }
    });
    const recordId = createResponse.data.record._id;
    console.log('✅ Record Created:', recordId);
    console.log();

    // Test 4: Get All Records
    console.log('4. Testing Get All Records...');
    const recordsResponse = await axios.get(`${API_URL}/weather/records`);
    console.log('✅ Total Records:', recordsResponse.data.total);
    console.log();

    // Test 5: Get Single Record
    console.log('5. Testing Get Single Record...');
    const singleRecordResponse = await axios.get(`${API_URL}/weather/records/${recordId}`);
    console.log('✅ Retrieved Record:', singleRecordResponse.data.location.city);
    console.log();

    // Test 6: Update Record
    console.log('6. Testing Update Record...');
    const updateResponse = await axios.put(`${API_URL}/weather/records/${recordId}`, {
      dateRange: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-10')
      }
    });
    console.log('✅ Record Updated');
    console.log();

    // Test 7: Delete Record
    console.log('7. Testing Delete Record...');
    const deleteResponse = await axios.delete(`${API_URL}/weather/records/${recordId}`);
    console.log('✅ Record Deleted');
    console.log();

    console.log('🎉 All tests passed!\n');
    console.log('Backend API is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('\nMake sure:');
    console.log('1. Backend server is running (node server.js)');
    console.log('2. MongoDB is running');
    console.log('3. Port 5001 is available');
  }
}

testAPI();
