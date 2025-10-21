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
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Gallery API functions
export const galleryAPI = {
  // Get all gallery items
  getAll: async (token) => {
    const response = await api.get('/api/gallery', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Upload files
  upload: async (files, token) => {
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
    if (data.name) formData.append('name', data.name);
    if (data.file) formData.append('file', data.file);

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
