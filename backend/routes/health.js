const express = require('express');
const { 
  getHealthCenters, 
  getEmergencyContacts 
} = require('../controllers/healthController');
const { endpointCache } = require('../middleware/cache');

const router = express.Router();

// Health centers endpoint with caching
router.get('/health-centers', endpointCache.healthCenters, getHealthCenters);

// Emergency contacts endpoint with caching
router.get('/emergency-contacts', endpointCache.emergencyContacts, getEmergencyContacts);

module.exports = router;
