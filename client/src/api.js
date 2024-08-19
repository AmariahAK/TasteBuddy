// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (adminToken && config.url.startsWith('/admin')) {
    config.headers['Authorization'] = `Bearer ${adminToken}`;
  }
  return config;
});


export default api;
