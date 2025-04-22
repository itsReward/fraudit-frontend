// src/api/risk.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.risk : api;

// Dashboard Data
/**
 * Get fraud risk statistics for dashboard
 * @returns {Promise<Object>} - API response
 */
export const getFraudRiskStats = () => {
    if (config.api.demoMode) {
        return mockService.dashboard.getFraudRiskStats();
    }
    return api.get('/dashboard/fraud-risk-stats');
};

/**
 * Get company risk summary for dashboard
 * @returns {Promise<Object>} - API response
 */
export const getCompanyRiskSummary = () => {
    if (config.api.demoMode) {
        return mockService.dashboard.getCompanyRiskSummary();
    }
    return api.get('/dashboard/company-risk-summary');
};

/**
 * Get fraud indicators distribution
 * @returns {Promise<Object>} - API response
 */
export const getFraudIndicatorsDistribution = () => {
    if (config.api.demoMode) {
        return mockService.dashboard.getFraudIndicatorsDistribution();
    }
    return api.get('/dashboard/fraud-indicators-distribution');
};

/**
 * Get recent risk alerts
 * @param {number} limit - Number of alerts to retrieve
 * @returns {Promise<Object>} - API response
 */
export const getRecentRiskAlerts = (limit = 5) => {
    if (config.api.demoMode) {
        return mockService.dashboard.getRecentRiskAlerts(limit);
    }
    return api.get('/dashboard/recent-risk-alerts', { params: { limit } });
};

/**
 * Get fraud risk trends
 * @param {number} companyId - Company ID (optional)
 * @returns {Promise<Object>} - API response
 */
export const getFraudRiskTrends = (companyId) => {
    if (config.api.demoMode) {
        return mockService.dashboard.getFraudRiskTrends(companyId);
    }
    return api.get('/dashboard/fraud-risk-trends', {
        params: companyId ? { companyId } : undefined,
    });
};

/**
 * Get user activity statistics
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - API response
 */
export const getUserActivityStats = (userId) => {
    if (config.api.demoMode) {
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: {} // Add mock data if needed
            }
        });
    }
    return api.get('/dashboard/user-activity', {
        params: userId ? { userId } : undefined,
    });
};

// Risk Assessments
/**
 * Get risk assessments with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getRiskAssessments = (params) => {
    return service.getRiskAssessments ?
        service.getRiskAssessments(params) :
        api.get('/fraud-risk/assessments', { params });
};

/**
 * Get risk assessment by ID
 * @param {number} id - Assessment ID
 * @returns {Promise<Object>} - API response
 */
export const getRiskAssessmentById = (id) => {
    return service.getRiskAssessmentById ?
        service.getRiskAssessmentById(id) :
        api.get(`/fraud-risk/assessments/${id}`);
};

/**
 * Get risk assessment by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getRiskAssessmentByStatementId = (statementId) => {
    return service.getRiskAssessmentByStatementId ?
        service.getRiskAssessmentByStatementId(statementId) :
        api.get(`/fraud-risk/assessments/statement/${statementId}`);
};

/**
 * Perform risk assessment for a statement
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const performRiskAssessment = (statementId) => {
    return service.performRiskAssessment ?
        service.performRiskAssessment(statementId) :
        api.post('/fraud-risk/assess', { statementId });
};

// Risk Alerts
/**
 * Get risk alerts with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getRiskAlerts = (params) => {
    return service.getRiskAlerts ?
        service.getRiskAlerts(params) :
        api.get('/fraud-risk/alerts', { params });
};

/**
 * Get risk alert by ID
 * @param {number} id - Alert ID
 * @returns {Promise<Object>} - API response
 */
export const getRiskAlertById = (id) => {
    return service.getRiskAlertById ?
        service.getRiskAlertById(id) :
        api.get(`/fraud-risk/alerts/${id}`);
};

/**
 * Resolve a risk alert
 * @param {number} id - Alert ID
 * @param {string} resolutionNotes - Resolution notes
 * @returns {Promise<Object>} - API response
 */
export const resolveRiskAlert = (id, resolutionNotes) => {
    return service.resolveRiskAlert ?
        service.resolveRiskAlert(id, resolutionNotes) :
        api.put(`/fraud-risk/alerts/${id}/resolve`, { resolutionNotes });
};