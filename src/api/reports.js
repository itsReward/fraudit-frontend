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