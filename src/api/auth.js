// src/api/auth.js - Updated to integrate with the API
import api from './index';
import config from '../config';
import mockService from './mockService';
import jwt_decode from 'jwt-decode';

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockService.auth : api;

export const login = (credentials) => {
    return service.login ?
        service.login(credentials) :
        api.post('/auth/login', credentials);
};

export const register = (userData) => {
    return service.register ?
        service.register(userData) :
        api.post('/auth/register', userData);
};

export const refreshToken = (refreshToken) => {
    return service.refreshToken ?
        service.refreshToken(refreshToken) :
        api.post('/auth/refresh', { refreshToken });
};

export const changePassword = (passwordData) => {
    return service.changePassword ?
        service.changePassword(passwordData) :
        api.post('/auth/change-password', passwordData);
};

export const logout = () => {
    return service.logout ?
        service.logout() :
        api.post('/auth/logout');
};

export const getCurrentUser = () => {
    return service.getCurrentUser ?
        service.getCurrentUser() :
        api.get('/users/me');
};

export const validateToken = (token) => {
    return service.validateToken ?
        service.validateToken(token) :
        api.get('/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` }
        });
};

// Helper function to handle unauthorized errors
export const handleUnauthorizedError = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Redirect to login page
    window.location.href = '/login';
};

// Helper function to check if token is expired
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Helper to get user from token
export const getUserFromToken = (token) => {
    if (!token) return null;

    try {
        return jwt_decode(token);
    } catch (error) {
        return null;
    }
};