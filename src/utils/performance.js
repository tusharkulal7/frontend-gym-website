// Performance monitoring utilities
import logger from './logger';

// Debounce function for search inputs and expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance metrics
export const measurePerformance = (name, callback) => {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  logger.debug(`Performance [${name}]: ${duration.toFixed(2)}ms`);
  
  // Log slow operations
  if (duration > 100) {
    logger.warn(`Slow operation [${name}]: ${duration.toFixed(2)}ms`);
  }
  
  return result;
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-lazy]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.lazy;
          img.removeAttribute('data-lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.lazy;
      img.removeAttribute('data-lazy');
    });
  }
};

// Preload critical resources
export const preloadCriticalAssets = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    // Determine resource type
    if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
      link.as = 'image';
    } else if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.match(/\.(woff2?|ttf|eot)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    link.href = url;
    document.head.appendChild(link);
  });
};

// Memory cleanup for SPA
export const cleanup = () => {
  // Clear timeouts and intervals
  let id = window.setTimeout(() => {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }
  
  // Remove event listeners if needed
  logger.debug('Performed cleanup');
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Network status checker
export const getNetworkSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  return null;
};

// Optimize images based on network
export const getOptimizedImageUrl = (url, networkSpeed) => {
  if (!networkSpeed || !url.includes('cloudinary')) return url;
  
  const { effectiveType, saveData } = networkSpeed;
  
  // If save data is enabled or slow connection
  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    // Use lower quality
    return url.replace('/upload/', '/upload/q_60,f_auto/');
  } else if (effectiveType === '3g') {
    // Medium quality
    return url.replace('/upload/', '/upload/q_80,f_auto/');
  } else {
    // High quality for 4g and better
    return url.replace('/upload/', '/upload/q_auto,f_auto/');
  }
};
