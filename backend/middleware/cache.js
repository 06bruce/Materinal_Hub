const NodeCache = require('node-cache');

// Create cache instances for different types of data
const cache = new NodeCache({ 
  stdTTL: 60 * 30, // 30 minutes default
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Don't clone objects for better performance
});

const shortCache = new NodeCache({ 
  stdTTL: 60 * 5, // 5 minutes for short-lived data
  checkperiod: 60 
});

const longCache = new NodeCache({ 
  stdTTL: 60 * 60, // 1 hour for long-lived data
  checkperiod: 300 
});

/**
 * Cache middleware for GET requests
 */
const cacheMiddleware = (ttl = 1800) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl}_${JSON.stringify(req.query)}`;
    const cached = cache.get(key);

    if (cached) {
      console.log(`Cache hit for: ${key}`);
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function(body) {
      // Cache successful responses
      if (res.statusCode === 200) {
        cache.set(key, body, ttl);
        console.log(`Cached response for: ${key}`);
      }
      
      // Call original json method
      return originalJson.call(this, body);
    };

    next();
  };
};

/**
 * Cache middleware for specific endpoints
 */
const endpointCache = {
  // Cache health centers for 1 hour
  healthCenters: cacheMiddleware(3600),
  
  // Cache emergency contacts for 1 hour
  emergencyContacts: cacheMiddleware(3600),
  
  // Cache user profiles for 15 minutes
  userProfile: cacheMiddleware(900),
};

/**
 * Clear cache for specific patterns
 */
const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  
  if (matchingKeys.length > 0) {
    cache.del(matchingKeys);
    console.log(`Cleared ${matchingKeys.length} cache entries for pattern: ${pattern}`);
  }
};

/**
 * Clear all caches
 */
const clearAllCaches = () => {
  cache.flushAll();
  shortCache.flushAll();
  longCache.flushAll();
  console.log('All caches cleared');
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  return {
    main: cache.getStats(),
    short: shortCache.getStats(),
    long: longCache.getStats(),
  };
};

module.exports = {
  cache,
  shortCache,
  longCache,
  cacheMiddleware,
  endpointCache,
  clearCache,
  clearAllCaches,
  getCacheStats,
};
