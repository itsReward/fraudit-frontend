// src/api/financial.js
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service or real API based on demo mode setting
const serviceStatements = config.api.demoMode ? mockService.statements : api;
const serviceFinancialData = config.api.demoMode ? mockService.financialData : api;
const serviceAnalysis = config.api.demoMode ? mockService.analysis : api;

// Financial Statements
export const getStatements = (params) => {
    return serviceStatements.getStatements ? serviceStatements.getStatements(params) :
        api.get('/financial-statements', { params });
};

export const getStatementById = (id) => {
    return serviceStatements.getStatementById ? serviceStatements.getStatementById(id) :
        api.get(`/financial-statements/${id}`);
};

export const createStatement = (statementData) => {
    return serviceStatements.createStatement ? serviceStatements.createStatement(statementData) :
        api.post('/financial-statements', statementData);
};

export const updateStatementStatus = (id, status) => {
    return serviceStatements.updateStatementStatus ? serviceStatements.updateStatementStatus(id, status) :
        api.put(`/financial-statements/${id}/status`, { status });
};

export const deleteStatement = (id) => {
    return serviceStatements.deleteStatement ? serviceStatements.deleteStatement(id) :
        api.delete(`/financial-statements/${id}`);
};

// Financial Data
export const getFinancialDataByStatementId = (statementId) => {
    return serviceFinancialData.getFinancialDataByStatementId ?
        serviceFinancialData.getFinancialDataByStatementId(statementId) :
        api.get(`/financial-data/statement/${statementId}`);
};

export const getLatestFinancialDataByCompanyId = (companyId) => {
    return serviceFinancialData.getLatestFinancialDataByCompanyId ?
        serviceFinancialData.getLatestFinancialDataByCompanyId(companyId) :
        api.get(`/financial-data/company/${companyId}/latest`);
};

export const createFinancialData = (financialData) => {
    return serviceFinancialData.createFinancialData ?
        serviceFinancialData.createFinancialData(financialData) :
        api.post('/financial-data', financialData);
};

export const updateFinancialData = (id, financialData) => {
    return serviceFinancialData.updateFinancialData ?
        serviceFinancialData.updateFinancialData(id, financialData) :
        api.put(`/financial-data/${id}`, financialData);
};

export const calculateDerivedValues = (id) => {
    return serviceFinancialData.calculateDerivedValues ?
        serviceFinancialData.calculateDerivedValues(id) :
        api.post(`/financial-data/${id}/calculate-derived`);
};

// Financial Analysis
export const getFinancialRatiosByStatementId = (statementId) => {
    return serviceAnalysis.getFinancialRatiosByStatementId ?
        serviceAnalysis.getFinancialRatiosByStatementId(statementId) :
        api.get(`/financial-analysis/ratios/statement/${statementId}`);
};

export const getAltmanZScoreByStatementId = (statementId) => {
    return serviceAnalysis.getAltmanZScoreByStatementId ?
        serviceAnalysis.getAltmanZScoreByStatementId(statementId) :
        api.get(`/financial-analysis/z-score/statement/${statementId}`);
};

export const getBeneishMScoreByStatementId = (statementId) => {
    return serviceAnalysis.getBeneishMScoreByStatementId ?
        serviceAnalysis.getBeneishMScoreByStatementId(statementId) :
        api.get(`/financial-analysis/m-score/statement/${statementId}`);
};

export const getPiotroskiFScoreByStatementId = (statementId) => {
    return serviceAnalysis.getPiotroskiFScoreByStatementId ?
        serviceAnalysis.getPiotroskiFScoreByStatementId(statementId) :
        api.get(`/financial-analysis/f-score/statement/${statementId}`);
};

export const calculateAllScores = (statementId) => {
    return serviceAnalysis.calculateAllScores ?
        serviceAnalysis.calculateAllScores(statementId) :
        api.post(`/financial-analysis/calculate/${statementId}`);
};

// Documents
export const uploadDocument = (statementId, file, options = {}) => {
    // Create FormData object
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`/financial-statements/${statementId}/documents`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        ...options
    });
};