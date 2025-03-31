import api from './index';

export const login = (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const refreshToken = (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
};

export const changePassword = (passwordData) => {
    return api.post('/auth/change-password', passwordData);
};

export const logout = () => {
    return api.post('/auth/logout');
};

export const getCurrentUser = () => {
    return api.get('/users/me');
};