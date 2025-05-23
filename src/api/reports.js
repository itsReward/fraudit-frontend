// src/api/reports.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';
import {formatQueryParams} from "../utils/apiUtils";

/**
 * Get available report types
 * @returns {Promise<Object>} - API response
 */
export const getAvailableReports = () => {
    return config.api.demoMode ?
        mockService.getAvailableReports ? mockService.getAvailableReports() : mockService.reports.getAvailableReports() :
        api.get('/reports/available');
};

/**
 * Generate a report
 * @param {string} reportType - Report type
 * @param {Object} parameters - Report parameters
 * @returns {Promise<Blob>} - Report blob
 */
export const generateReport = (reportType, parameters) => {
    return config.api.demoMode ?
        mockService.generateReport ? mockService.generateReport(reportType, parameters) : mockService.reports.generateReport(reportType, parameters) :
        api.post('/reports/generate',
            { reportType, parameters },
            { responseType: 'blob' }
        );
};

/**
 * Get reports list with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getReports = (params) => {
    // Filter out empty string parameters
    const cleanParams = formatQueryParams(params);

    console.log("Sending reports params:", cleanParams);

    return config.api.demoMode ?
        mockService.getReports ? mockService.getReports(cleanParams) : mockService.reports.getReports(cleanParams) :
        api.get('/reports/available', { params: cleanParams });
};


/**
 * Download a report
 * @param {number} reportId - Report ID
 * @returns {Promise<Blob>} - Report blob
 */
export const downloadReport = (reportId) => {
    return config.api.demoMode ?
        mockService.downloadReport ? mockService.downloadReport(reportId) : mockService.reports.downloadReport(reportId) :
        api.get(`/reports/${reportId}/download`, {
            responseType: 'blob'
        });
};