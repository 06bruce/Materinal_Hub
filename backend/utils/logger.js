const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Simple logger utility
 */
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}\n`;
  }

  writeToFile(filename, content) {
    fs.appendFileSync(filename, content, 'utf8');
  }

  log(level, message, meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Console output
    console.log(formattedMessage.trim());
    
    // File output
    this.writeToFile(this.logFile, formattedMessage);
    
    // Error level goes to error file too
    if (level === 'error') {
      this.writeToFile(this.errorFile, formattedMessage);
    }
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  debug(message, meta) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }

  // Log API requests
  logRequest(req, res, responseTime) {
    this.info('API Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });
  }

  // Log authentication events
  logAuth(event, userId, email, success = true) {
    this.info('Authentication Event', {
      event,
      userId,
      email,
      success,
      timestamp: new Date().toISOString()
    });
  }

  // Log errors with stack trace
  logError(error, req = null) {
    this.error('Application Error', {
      message: error.message,
      stack: error.stack,
      url: req ? req.url : null,
      method: req ? req.method : null,
      body: req ? req.body : null
    });
  }

  // Log performance metrics
  logPerformance(operation, duration, meta = {}) {
    this.info('Performance Metric', {
      operation,
      duration: `${duration}ms`,
      ...meta
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
