import api from './index';

// Risk Assessments
export const getRiskAssessments = (params) => {
    return api.get('/fraud-risk/assessments', { params });
};

export const getRiskAssessmentById = (id) => {
    return api.get(`/fraud-risk/assessments/${id}`);
};

export const getRiskAssessmentByStatementId = (statementId) => {
    return api.get(`/fraud-risk/assessments/statement/${statementId}`);
};

export const performRiskAssessment = (statementId) => {
    return api.post('/fraud-risk/assess', { statementId });
};

// Risk Alerts
export const getRiskAlerts = (params) => {
    return api.get('/fraud-risk/alerts', { params });
};

export const getRiskAlertById = (id) => {
    return api.get(`/fraud-risk/alerts/${id}`);
};

export const resolveRiskAlert = (id, resolutionNotes) => {
    return api.put(`/fraud-risk/alerts/${id}/resolve`, { resolutionNotes });
};

// Dashboard Data
export const getFraudRiskStats = () => {
    return api.get('/dashboard/fraud-risk-stats');
};

export const getCompanyRiskSummary = () => {
    return api.get('/dashboard/company-risk-summary');
};

export const getFraudIndicatorsDistribution = () => {
    return api.get('/dashboard/fraud-indicators-distribution');
};

export const getRecentRiskAlerts = (limit = 5) => {
    return api.get('/dashboard/recent-risk-alerts', { params: { limit } });
};

export const getFraudRiskTrends = (companyId) => {
    return api.get('/dashboard/fraud-risk-trends', {
        params: companyId ? { companyId } : undefined,
    });
};

export const getUserActivityStats = (userId) => {
    return api.get('/dashboard/user-activity', {
        params: userId ? { userId } : undefined,
    });
};

// ML Models and Predictions
export const getMlModels = (isActive) => {
    return api.get('/ml/models', {
        params: isActive !== undefined ? { isActive } : undefined,
    });
};

export const getMlModelById = (id) => {
    return api.get(`/ml/models/${id}`);
};

export const createMlModel = (modelData) => {
    return api.post('/ml/models', modelData);
};

export const updateMlModel = (id, modelData) => {
    return api.put(`/ml/models/${id}`, modelData);
};

export const activateMlModel = (id) => {
    return api.put(`/ml/models/${id}/activate`);
};

export const deactivateMlModel = (id) => {
    return api.put(`/ml/models/${id}/deactivate`);
};

export const deleteMlModel = (id) => {
    return api.delete(`/ml/models/${id}`);
};

export const getMlPredictionsByStatementId = (statementId) => {
    return api.get(`/ml/predictions/statement/${statementId}`);
};

export const performMlPrediction = (statementId) => {
    return api.post(`/ml/predict/${statementId}`);
};