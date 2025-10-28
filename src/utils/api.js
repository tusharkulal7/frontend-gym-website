// API utility functions for frontend-backend communication
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added by individual functions
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    const errorInfo = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      timestamp: new Date().toISOString()
    };
    
    console.error('API Error:', errorInfo);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout
      console.warn('Authentication failed - token may be expired');
    } else if (error.response?.status === 403) {
      console.warn('Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    }
    
    return Promise.reject(error);
  }
);

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  return input;
};

// Validate file before upload
const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4']
  } = options;
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }
  
  return true;
};

// Gallery API functions
export const galleryAPI = {
  // Get all gallery items (public access)
  getAll: async () => {
    const response = await api.get('/api/gallery');
    return response.data;
  },

  // Upload files
  upload: async (files, token) => {
    // Validate files before upload
    files.forEach(file => validateFile(file));
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await api.post('/api/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Update gallery item
  update: async (id, data, token) => {
    const formData = new FormData();
    if (data.name) formData.append('name', sanitizeInput(data.name));
    if (data.file) {
      validateFile(data.file);
      formData.append('file', data.file);
    }

    const response = await api.put(`/api/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Delete gallery item
  delete: async (id, token) => {
    const response = await api.delete(`/api/gallery/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Reorder gallery items
  reorder: async (items, token) => {
    const response = await api.patch('/api/gallery/reorder', { items }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// User management API functions
export const userAPI = {
  // Get all users
  getAll: async (token) => {
    const response = await api.get('/api/auth/all-users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Promote user to admin
  promote: async (userId, token) => {
    const response = await api.put(`/api/auth/promote/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Demote admin to user
  demote: async (userId, token) => {
    const response = await api.put(`/api/auth/demote/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete user
  delete: async (userId, token) => {
    const response = await api.delete(`/api/auth/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// System API functions
export const systemAPI = {
  // Health check
  health: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get API documentation
  docs: async () => {
    const response = await api.get('/api/docs');
    return response.data;
  }
};

export default api;
