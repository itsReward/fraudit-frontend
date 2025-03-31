// src/api/auth.js
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockService.auth : api;

export const login = (credentials) => {
    return service.login(credentials);
};

export const register = (userData) => {
    return service.register(userData);
};

export const refreshToken = (refreshToken) => {
    return service.refreshToken ? service.refreshToken(refreshToken) :
        api.post('/auth/refresh', { refreshToken });
};

export const changePassword = (passwordData) => {
    return service.changePassword ? service.changePassword(passwordData) :
        api.post('/auth/change-password', passwordData);
};

export const logout = () => {
    return service.logout ? service.logout() :
        api.post('/auth/logout');
};

export const getCurrentUser = () => {
    return service.getCurrentUser ? service.getCurrentUser() :
        api.get('/users/me');
};