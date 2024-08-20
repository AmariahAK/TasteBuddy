import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the correct token based on the request URL
api.interceptors.request.use((config) => {
  // Determine if the request is for an admin route
  const isAdminRoute = config.url.includes('/admin');

  // Retrieve the appropriate token from localStorage
  const token = isAdminRoute ? localStorage.getItem('adminToken') : localStorage.getItem('token');

  // If a token exists, attach it to the Authorization header
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
