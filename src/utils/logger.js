// Centralized logging utility for the application
// Logs only in development mode to avoid console pollution in production

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info('ℹ️', ...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    }
  },

  error: (...args) => {
    // Always log errors, even in production
    console.error('❌', ...args);
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.debug('🐛', ...args);
    }
  },

  success: (...args) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    }
  }
};

export default logger;
