// src/api/risk.js
import api from './index';
import config from '../config';
import mockService, {riskAPI as service} from './mockService';

// Dashboard Data
export const getFraudRiskStats = () => {
    if (config.api.demoMode) {
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: mockService.dashboard.fraudRiskStats
            }
        });
    }
    return api.get('/dashboard/fraud-risk-stats');
};

export const getCompanyRiskSummary = () => {
    if (config.api.demoMode) {
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: mockService.dashboard.companyRiskSummary
            }
        });
    }
    return api.get('/dashboard/company-risk-summary');
};

export const getFraudIndicatorsDistribution = () => {
    if (config.api.demoMode) {
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: mockService.dashboard.fraudIndicatorsDistribution
            }
        });
    }
    return api.get('/dashboard/fraud-indicators-distribution');
};

export const getRecentRiskAlerts = (limit = 5) => {
    if (config.api.demoMode) {
        const limitedAlerts = mockService.dashboard.recentRiskAlerts;
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: limitedAlerts
            }
        });
    }
    return api.get('/dashboard/recent-risk-alerts', { params: { limit } });
};

export const getFraudRiskTrends = (companyId) => {
    if (config.api.demoMode) {
        return Promise.resolve({
            data: {
                success: true,
                message: 'Success',
                data: mockService.dashboard.fraudRiskTrends
            }
        });
    }
    return api.get('/dashboard/fraud-risk-trends', {
        params: companyId ? { companyId } : undefined,
    });
};

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
export const getRiskAssessments = (params) => {

    return service.getRiskAssessments ? service.getRiskAssessments(params) :
        api.get('/fraud-risk/assessments', { params });
};

export const getRiskAssessmentById = (id) => {
    return service.getRiskAssessmentById ? service.getRiskAssessmentById(id) :
        api.get(`/fraud-risk/assessments/${id}`);
};

export const getRiskAssessmentByStatementId = (statementId) => {
    return service.getRiskAssessmentByStatementId ? service.getRiskAssessmentByStatementId(statementId) :
        api.get(`/fraud-risk/assessments/statement/${statementId}`);
};

export const performRiskAssessment = (statementId) => {
    return service.performRiskAssessment ? service.performRiskAssessment(statementId) :
        api.post('/fraud-risk/assess', { statementId });
};

// Risk Alerts
export const getRiskAlerts = (params) => {
    return service.getRiskAlerts ? service.getRiskAlerts(params) :
        api.get('/fraud-risk/alerts', { params });
};

export const getRiskAlertById = (id) => {
    return service.getRiskAlertById ? service.getRiskAlertById(id) :
        api.get(`/fraud-risk/alerts/${id}`);
};

export const resolveRiskAlert = (id, resolutionNotes) => {
    return service.resolveRiskAlert ? service.resolveRiskAlert(id, resolutionNotes) :
        api.put(`/fraud-risk/alerts/${id}/resolve`, { resolutionNotes });
};