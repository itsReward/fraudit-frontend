import api from './index';
import config from '../config';
import mockService from './mockService';

// Mock service for demo mode
const mockUsersAPI = {
    getUsers: async (params) => {
        // Return mock users data with pagination
        const mockUsers = [
            {
                id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                username: 'admin',
                email: 'admin@fraudit.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
                active: true,
            },
            {
                id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
                username: 'analyst',
                email: 'analyst@fraudit.com',
                firstName: 'Analyst',
                lastName: 'User',
                role: 'ANALYST',
                active: true,
            },
            {
                id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
                username: 'regulator',
                email: 'regulator@fraudit.com',
                firstName: 'Regulator',
                lastName: 'User',
                role: 'REGULATOR',
                active: true,
            },
            {
                id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
                username: 'auditor',
                email: 'auditor@fraudit.com',
                firstName: 'Auditor',
                lastName: 'User',
                role: 'AUDITOR',
                active: true,
            }
        ];

        // Filter by role if specified
        let filteredUsers = [...mockUsers];
        if (params?.role) {
            filteredUsers = filteredUsers.filter(user => user.role === params.role);
        }

        // Apply pagination
        const page = params?.page || 0;
        const size = params?.size || 10;
        const start = page * size;
        const end = start + size;
        const paginatedUsers = filteredUsers.slice(start, end);

        return {
            data: {
                success: true,
                message: 'Success',
                data: {
                    content: paginatedUsers,
                    page: page,
                    size: size,
                    totalElements: filteredUsers.length,
                    totalPages: Math.ceil(filteredUsers.length / size),
                    first: page === 0,
                    last: end >= filteredUsers.length
                }
            }
        };
    },

    getUserById: async (id) => {
        // Mock user data
        return {
            data: {
                success: true,
                message: 'Success',
                data: {
                    id: id,
                    username: 'mockuser',
                    email: 'mockuser@fraudit.com',
                    firstName: 'Mock',
                    lastName: 'User',
                    role: 'ANALYST',
                    active: true,
                }
            }
        };
    },

    createUser: async (userData) => {
        // Mock user creation
        return {
            data: {
                success: true,
                message: 'User created successfully',
                data: {
                    id: 'new-user-id',
                    ...userData,
                    active: true
                }
            }
        };
    },

    updateUser: async (id, userData) => {
        // Mock user update
        return {
            data: {
                success: true,
                message: 'User updated successfully',
                data: {
                    id: id,
                    ...userData,
                    active: true
                }
            }
        };
    },

    deleteUser: async (id) => {
        // Mock user deletion
        return {
            data: {
                success: true,
                message: 'User deleted successfully'
            }
        };
    }
};

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockUsersAPI : api;

export const getUsers = (params) => {
    return service.getUsers ? service.getUsers(params) :
        api.get('/users', { params });
};

export const getUserById = (id) => {
    return service.getUserById ? service.getUserById(id) :
        api.get(`/users/${id}`);
};

export const createUser = (userData) => {
    return service.createUser ? service.createUser(userData) :
        api.post('/users', userData);
};

export const updateUser = (id, userData) => {
    return service.updateUser ? service.updateUser(id, userData) :
        api.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
    return service.deleteUser ? service.deleteUser(id) :
        api.delete(`/users/${id}`);
};