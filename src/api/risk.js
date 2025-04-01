// src/api/risk.js
import api from './index';
import config from '../config';
import mockService, {riskAPI as service} from './mockService';

// Dashboard Data
// src/api/risk.js (updated implementations)
export const getFraudRiskStats = () => {
    if (config.api.demoMode) {
        // Use the mock service's API method directly
        return mockService.dashboard.getFraudRiskStats();
    }
    return api.get('/dashboard/fraud-risk-stats');
};

export const getCompanyRiskSummary = () => {
    if (config.api.demoMode) {
        return mockService.dashboard.getCompanyRiskSummary();
    }
    return api.get('/dashboard/company-risk-summary');
};

export const getFraudIndicatorsDistribution = () => {
    if (config.api.demoMode) {
        return mockService.dashboard.getFraudIndicatorsDistribution();
    }
    return api.get('/dashboard/fraud-indicators-distribution');
};

export const getRecentRiskAlerts = (limit = 5) => {
    if (config.api.demoMode) {
        return mockService.dashboard.getRecentRiskAlerts(limit);
    }
    return api.get('/dashboard/recent-risk-alerts', { params: { limit } });
};

export const getFraudRiskTrends = (companyId) => {
    if (config.api.demoMode) {
        return mockService.dashboard.getFraudRiskTrends(companyId);
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