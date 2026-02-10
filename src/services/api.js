import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions for static data
export const dataService = {
  // Get all available data categories
  getAllCategories: () => api.get('/data'),
  
  // Get achievements data
  getAchievements: () => api.get('/data/achievements'),
  
  // Get Shuhada data
  getShuhada: () => api.get('/data/shuhada'),
  
  // Get summaries data
  getSummaries: () => api.get('/data/summaries'),
};

export default api;
