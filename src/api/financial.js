import api from './index';

// Financial Statements
export const getStatements = (params) => {
    return api.get('/financial-statements', { params });
};

export const getStatementById = (id) => {
    return api.get(`/financial-statements/${id}`);
};

export const createStatement = (statementData) => {
    return api.post('/financial-statements', statementData);
};

export const updateStatementStatus = (id, status) => {
    return api.put(`/financial-statements/${id}/status`, { status });
};

export const deleteStatement = (id) => {
    return api.delete(`/financial-statements/${id}`);
};

// Financial Data
export const getFinancialDataByStatementId = (statementId) => {
    return api.get(`/financial-data/statement/${statementId}`);
};

export const getLatestFinancialDataByCompanyId = (companyId) => {
    return api.get(`/financial-data/company/${companyId}/latest`);
};

export const createFinancialData = (financialData) => {
    return api.post('/financial-data', financialData);
};

export const updateFinancialData = (id, financialData) => {
    return api.put(`/financial-data/${id}`, financialData);
};

export const calculateDerivedValues = (id) => {
    return api.post(`/financial-data/${id}/calculate-derived`);
};

// Financial Analysis
export const getFinancialRatiosByStatementId = (statementId) => {
    return api.get(`/financial-analysis/ratios/statement/${statementId}`);
};

export const getAltmanZScoreByStatementId = (statementId) => {
    return api.get(`/financial-analysis/z-score/statement/${statementId}`);
};

export const getBeneishMScoreByStatementId = (statementId) => {
    return api.get(`/financial-analysis/m-score/statement/${statementId}`);
};

export const getPiotroskiFScoreByStatementId = (statementId) => {
    return api.get(`/financial-analysis/f-score/statement/${statementId}`);
};

export const calculateAllScores = (statementId) => {
    return api.post(`/financial-analysis/calculate/${statementId}`);
};

// Documents
export const getDocumentsByStatementId = (statementId) => {
    return api.get(`/documents/statement/${statementId}`);
};

export const getDocumentById = (id) => {
    return api.get(`/documents/${id}`);
};

export const downloadDocument = (id) => {
    return api.get(`/documents/${id}/download`, {
        responseType: 'blob',
    });
};

export const uploadDocument = (statementId, file) => {
    const formData = new FormData();
    formData.append('statementId', statementId);
    formData.append('file', file);

    return api.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteDocument = (id) => {
    return api.delete(`/documents/${id}`);
};