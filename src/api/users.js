// src/api/users.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.users : api;

/**
 * Get users with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getUsers = (params) => {
    return service.getUsers ?
        service.getUsers(params) :
        api.get('/users', { params });
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} - API response
 */
export const getUserById = (id) => {
    return service.getUserById ?
        service.getUserById(id) :
        api.get(`/users/${id}`);
};

/**
 * Get current user
 * @returns {Promise<Object>} - API response
 */
export const getCurrentUser = () => {
    return service.getCurrentUser ?
        service.getCurrentUser() :
        api.get('/users/me');
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - API response
 */
export const createUser = (userData) => {
    return service.createUser ?
        service.createUser(userData) :
        api.post('/users', userData);
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - API response
 */
export const updateUser = (id, userData) => {
    return service.updateUser ?
        service.updateUser(id, userData) :
        api.put(`/users/${id}`, userData);
};

/**
 * Update user status (activate/deactivate)
 * @param {string} id - User ID
 * @param {boolean} active - Active status
 * @returns {Promise<Object>} - API response
 */
export const updateUserStatus = (id, active) => {
    return service.updateUserStatus ?
        service.updateUserStatus(id, active) :
        api.put(`/users/${id}/status`, { active });
};

/**
 * Reset user password
 * @param {string} id - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - API response
 */
export const resetPassword = (id, newPassword) => {
    return service.resetPassword ?
        service.resetPassword(id, newPassword) :
        api.put(`/users/${id}/password`, { newPassword });
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<Object>} - API response
 */
export const deleteUser = (id) => {
    return service.deleteUser ?
        service.deleteUser(id) :
        api.delete(`/users/${id}`);
};

/**
 * Get user roles
 * @returns {Promise<Object>} - API response
 */
export const getUserRoles = () => {
    return service.getUserRoles ?
        service.getUserRoles() :
        api.get('/users/roles');
};

/**
 * Check username availability
 * @param {string} username - Username
 * @returns {Promise<Object>} - API response
 */
export const checkUsernameAvailability = (username) => {
    return service.checkUsernameAvailability ?
        service.checkUsernameAvailability(username) :
        api.get('/users/check-username', { params: { username } });
};

/**
 * Check email availability
 * @param {string} email - Email
 * @returns {Promise<Object>} - API response
 */
export const checkEmailAvailability = (email) => {
    return service.checkEmailAvailability ?
        service.checkEmailAvailability(email) :
        api.get('/users/check-email', { params: { email } });
};

/**
 * Search users
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const searchUsers = (params) => {
    return service.searchUsers ?
        service.searchUsers(params) :
        api.get('/users/search', { params });
};

/**
 * Get user statistics
 * @returns {Promise<Object>} - API response
 */
export const getUserStats = () => {
    return service.getUserStats ?
        service.getUserStats() :
        api.get('/users/stats');
};