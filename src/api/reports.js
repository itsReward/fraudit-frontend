import api from './index';

export const getAvailableReports = () => {
    return api.get('/reports/available');
};

export const generateReport = (reportType, parameters) => {
    return api.post('/reports/generate',
        { reportType, parameters },
        { responseType: 'blob' }
    );
};

// Added missing exports
export const getReports = (params) => {
    return api.get('/reports', { params });
};

export const downloadReport = (reportId) => {
    return api.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
    });
};