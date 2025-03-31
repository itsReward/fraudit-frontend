// src/api/index.js
import axios from 'axios';
import config from '../config';
import mockService from './mockService';

// Create axios instance with configuration
const api = axios.create({
    baseURL: config.api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Error handling code...
        return Promise.reject(error);
    }
);

// For demo mode, use mock service
if (config.api.demoMode) {
    console.log('🚀 Running in demo mode - no backend required');
}

// Default export is either the real API or the mock service
export default config.api.demoMode ? mockService : api;