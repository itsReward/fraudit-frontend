// src/api/index.js - Updated to handle API integration

import axios from 'axios';
import config from '../config';
import { handleUnauthorizedError } from '../utils/auth';

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
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token if we have a refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
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
                handleUnauthorizedError();
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

// For demo mode, use mock service
if (config.api.demoMode) {
    console.log('🚀 Running in demo mode - no backend required');
}

// Default export is either the real API or the mock service
export default api;