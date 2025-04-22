// src/api/index.js - Fixed API configuration

import axios from 'axios';
import config from '../config';
import { handleUnauthorizedError } from '../utils/auth';

// Create axios instance with configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout to prevent infinite loading
    timeout: 15000, // 15 seconds
});

// Add some debugging
console.log("API baseURL:", api.defaults.baseURL);
console.log("Demo mode:", process.env.REACT_APP_DEMO_MODE === 'true' ? 'Yes' : 'No');

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Debug
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.params || {});
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        // Debug successful responses
        console.log(`API Response [${response.status}]:`, response.data);
        return response;
    },
    async (error) => {
        // Debug failed responses
        console.error(`API Error Response [${error.response?.status || 'Network Error'}]:`, error.response?.data || error.message);

        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token if we have a refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
                        refreshToken
                    });

                    if (response.data.success) {
                        const { token, refreshToken: newRefreshToken } = response.data.data;

                        // Store the new tokens
                        localStorage.setItem('token', token);
                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }
                }

                // If refresh token fails or doesn't exist, logout
                handleUnauthorizedError();
                return Promise.reject(error);
            } catch (refreshError) {
                console.error("Token refresh error:", refreshError);
                handleUnauthorizedError();
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

// Default export
export default api;