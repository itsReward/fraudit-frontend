import api from './index';
import config from '../config';

// Mock reports data
const mockReports = [
    {
        id: 1,
        name: 'Annual Financial Analysis - ABC Corporation',
        reportType: 'company-overview',
        companyId: 1,
        companyName: 'ABC Corporation',
        userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        username: 'admin',
        createdAt: '2023-11-15T10:30:00Z',
        format: 'PDF'
    },
    {
        id: 2,
        name: 'Fraud Risk Assessment - XYZ Enterprises',
        reportType: 'fraud-risk',
        companyId: 2,
        companyName: 'XYZ Enterprises',
        userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        username: 'admin',
        createdAt: '2023-11-10T14:20:00Z',
        format: 'PDF'
    },
    {
        id: 3,
        name: 'System Activity Report - Q4 2023',
        reportType: 'system-activity',
        userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        username: 'admin',
        createdAt: '2023-12-01T09:15:00Z',
        format: 'EXCEL'
    },
    {
        id: 4,
        name: 'Risk Assessment Report - Global Mining Ltd',
        reportType: 'risk-assessment',
        companyId: 3,
        companyName: 'Global Mining Ltd',
        assessmentId: 3,
        userId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        username: 'analyst',
        createdAt: '2023-12-05T11:45:00Z',
        format: 'PDF'
    }
];

// Mock reports API methods
const mockReportsAPI = {
    getReports: async (params) => {
        // Apply filters if provided
        let filteredReports = [...mockReports];

        if (params?.reportType) {
            filteredReports = filteredReports.filter(r => r.reportType === params.reportType);
        }

        if (params?.companyId) {
            filteredReports = filteredReports.filter(r => r.companyId === parseInt(params.companyId));
        }

        // Apply sorting (default to most recent first)
        filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Apply pagination
        const page = params?.page || 0;
        const size = params?.size || 10;
        const start = page * size;
        const paginatedReports = filteredReports.slice(start, start + size);

        return {
            data: {
                success: true,
                message: 'Success',
                data: {
                    content: paginatedReports,
                    page: page,
                    size: size,
                    totalElements: filteredReports.length,
                    totalPages: Math.ceil(filteredReports.length / size),
                    first: page === 0,
                    last: start + size >= filteredReports.length
                },
                timestamp: new Date().toISOString()
            }
        };
    },

    getAvailableReports: async () => {
        const availableReports = [
            { id: 'company-overview', name: 'Company Overview', description: 'Comprehensive analysis of a company\'s financial health.' },
            { id: 'fraud-risk', name: 'Fraud Risk Report', description: 'Analysis of potential fraud risk indicators.' },
            { id: 'risk-assessment', name: 'Risk Assessment Report', description: 'Detailed risk assessment results for a specific statement.' },
            { id: 'system-activity', name: 'System Activity Report', description: 'Analysis of system usage and user activity.' }
        ];

        return {
            data: {
                success: true,
                message: 'Success',
                data: availableReports,
                timestamp: new Date().toISOString()
            }
        };
    },

    generateReport: async (reportType, parameters) => {
        // Create a dummy blob for download
        return new Blob(['Mock report content'], { type: 'application/pdf' });
    },

    downloadReport: async (reportId) => {
        // Find the report
        const report = mockReports.find(r => r.id === parseInt(reportId));

        if (!report) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Report not found with id: ${reportId}`
                    }
                }
            };
        }

        // Create a dummy blob for download
        return new Blob(['Mock report content for ' + report.name], {
            type: report.format === 'PDF' ? 'application/pdf' :
                report.format === 'EXCEL' ? 'application/vnd.ms-excel' :
                    'text/plain'
        });
    }
};

// Exports
export const getAvailableReports = () => {
    return config.api.demoMode ? mockReportsAPI.getAvailableReports() :
        api.get('/reports/available');
};

export const generateReport = (reportType, parameters) => {
    return config.api.demoMode ? mockReportsAPI.generateReport(reportType, parameters) :
        api.post('/reports/generate',
            { reportType, parameters },
            { responseType: 'blob' }
        );
};

export const getReports = (params) => {
    return config.api.demoMode ? mockReportsAPI.getReports(params) :
        api.get('/reports', { params });
};

export const downloadReport = (reportId) => {
    return config.api.demoMode ? mockReportsAPI.downloadReport(reportId) :
        api.get(`/reports/${reportId}/download`, {
            responseType: 'blob'
        });
};