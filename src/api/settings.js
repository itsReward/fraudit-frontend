import api from './index';
import config from '../config';
import mockService from './mockService';

// Mock service for demo mode
const mockSettingsAPI = {
    getSystemSettings: async () => {
        // Return mock system settings
        return {
            data: {
                success: true,
                message: 'Success',
                data: {
                    systemName: 'Fraudit',
                    contactEmail: 'admin@fraudit.com',
                    requireTwoFactor: false,
                    sessionTimeoutMinutes: 60,
                    enableApiAccess: true,
                    apiRateLimit: 100
                }
            }
        };
    },

    updateSystemSettings: async (settings) => {
        // Mock update success
        return {
            data: {
                success: true,
                message: 'Settings updated successfully',
                data: settings
            }
        };
    }
};

// Use mock service in demo mode
const service = config.api.demoMode ? mockSettingsAPI : api;

export const getSystemSettings = () => {
    return service.getSystemSettings ? service.getSystemSettings() :
        api.get('/settings/system');
};

export const updateSystemSettings = (settings) => {
    return service.updateSystemSettings ? service.updateSystemSettings(settings) :
        api.put('/settings/system', settings);
};