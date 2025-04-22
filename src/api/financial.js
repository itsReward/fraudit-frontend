// src/api/financial.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service or real API based on demo mode setting
const serviceStatements = config.api.demoMode ? mockService.statements : api;
const serviceFinancialData = config.api.demoMode ? mockService.financialData : api;
const serviceAnalysis = config.api.demoMode ? mockService.analysis : api;

// Financial Statements
/**
 * Get a list of financial statements with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.companyId - Filter by company ID
 * @param {number} params.fiscalYearId - Filter by fiscal year ID
 * @param {string} params.statementType - Filter by statement type (ANNUAL, INTERIM, QUARTERLY)
 * @param {string} params.status - Filter by status (PENDING, PROCESSED, ANALYZED)
 * @param {number} params.page - Page number (0-based)
 * @param {number} params.size - Page size
 * @returns {Promise<Object>} - API response
 */
export const getStatements = (params) => {
    return serviceStatements.getStatements ?
        serviceStatements.getStatements(params) :
        api.get('/financial-statements', { params });
};

/**
 * Get a financial statement by ID
 * @param {number} id - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getStatementById = (id) => {
    return serviceStatements.getStatementById ?
        serviceStatements.getStatementById(id) :
        api.get(`/financial-statements/${id}`);
};

/**
 * Get statements by company ID
 * @param {number} companyId - Company ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getStatementsByCompanyId = (companyId, params) => {
    return serviceStatements.getStatementsByCompanyId ?
        serviceStatements.getStatementsByCompanyId(companyId, params) :
        api.get(`/financial-statements/company/${companyId}`, { params });
};

/**
 * Create a new financial statement
 * @param {Object} statementData - Statement data
 * @returns {Promise<Object>} - API response
 */
export const createStatement = (statementData) => {
    return serviceStatements.createStatement ?
        serviceStatements.createStatement(statementData) :
        api.post('/financial-statements', statementData);
};

/**
 * Update a statement's status
 * @param {number} id - Statement ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - API response
 */
export const updateStatementStatus = (id, status) => {
    return serviceStatements.updateStatementStatus ?
        serviceStatements.updateStatementStatus(id, status) :
        api.put(`/financial-statements/${id}/status`, { status });
};

/**
 * Delete a financial statement
 * @param {number} id - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const deleteStatement = (id) => {
    return serviceStatements.deleteStatement ?
        serviceStatements.deleteStatement(id) :
        api.delete(`/financial-statements/${id}`);
};

// Financial Data
/**
 * Get financial data by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getFinancialDataByStatementId = (statementId) => {
    return serviceFinancialData.getFinancialDataByStatementId ?
        serviceFinancialData.getFinancialDataByStatementId(statementId) :
        api.get(`/financial-data/statement/${statementId}`);
};

/**
 * Get latest financial data by company ID
 * @param {number} companyId - Company ID
 * @returns {Promise<Object>} - API response
 */
export const getLatestFinancialDataByCompanyId = (companyId) => {
    return serviceFinancialData.getLatestFinancialDataByCompanyId ?
        serviceFinancialData.getLatestFinancialDataByCompanyId(companyId) :
        api.get(`/financial-data/company/${companyId}/latest`);
};

/**
 * Create financial data
 * @param {Object} financialData - Financial data
 * @returns {Promise<Object>} - API response
 */
export const createFinancialData = (financialData) => {
    return serviceFinancialData.createFinancialData ?
        serviceFinancialData.createFinancialData(financialData) :
        api.post('/financial-data', financialData);
};

/**
 * Update financial data
 * @param {number} id - Financial data ID
 * @param {Object} financialData - Financial data
 * @returns {Promise<Object>} - API response
 */
export const updateFinancialData = (id, financialData) => {
    return serviceFinancialData.updateFinancialData ?
        serviceFinancialData.updateFinancialData(id, financialData) :
        api.put(`/financial-data/${id}`, financialData);
};

/**
 * Calculate derived values for financial data
 * @param {number} id - Financial data ID
 * @returns {Promise<Object>} - API response
 */
export const calculateDerivedValues = (id) => {
    return serviceFinancialData.calculateDerivedValues ?
        serviceFinancialData.calculateDerivedValues(id) :
        api.post(`/financial-data/${id}/calculate-derived`);
};

/**
 * Get financial trend for a company
 * @param {number} companyId - Company ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getFinancialTrend = (companyId, params) => {
    return serviceFinancialData.getFinancialTrend ?
        serviceFinancialData.getFinancialTrend(companyId, params) :
        api.get(`/financial-data/trend/${companyId}`, { params });
};

// Financial Analysis
/**
 * Get financial ratios by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getFinancialRatiosByStatementId = (statementId) => {
    return serviceAnalysis.getFinancialRatiosByStatementId ?
        serviceAnalysis.getFinancialRatiosByStatementId(statementId) :
        api.get(`/financial-analysis/ratios/statement/${statementId}`);
};

/**
 * Get Altman Z-Score by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getAltmanZScoreByStatementId = (statementId) => {
    return serviceAnalysis.getAltmanZScoreByStatementId ?
        serviceAnalysis.getAltmanZScoreByStatementId(statementId) :
        api.get(`/financial-analysis/z-score/statement/${statementId}`);
};

/**
 * Get Beneish M-Score by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getBeneishMScoreByStatementId = (statementId) => {
    return serviceAnalysis.getBeneishMScoreByStatementId ?
        serviceAnalysis.getBeneishMScoreByStatementId(statementId) :
        api.get(`/financial-analysis/m-score/statement/${statementId}`);
};

/**
 * Get Piotroski F-Score by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getPiotroskiFScoreByStatementId = (statementId) => {
    return serviceAnalysis.getPiotroskiFScoreByStatementId ?
        serviceAnalysis.getPiotroskiFScoreByStatementId(statementId) :
        api.get(`/financial-analysis/f-score/statement/${statementId}`);
};

/**
 * Calculate all financial scores for a statement
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const calculateAllScores = (statementId) => {
    return serviceAnalysis.calculateAllScores ?
        serviceAnalysis.calculateAllScores(statementId) :
        api.post(`/financial-analysis/calculate/${statementId}`);
};

/**
 * Calculate Altman Z-Score
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const calculateZScore = (statementId) => {
    return serviceAnalysis.calculateZScore ?
        serviceAnalysis.calculateZScore(statementId) :
        api.post(`/financial-analysis/calculate-z-score/${statementId}`);
};

/**
 * Calculate Beneish M-Score
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const calculateMScore = (statementId) => {
    return serviceAnalysis.calculateMScore ?
        serviceAnalysis.calculateMScore(statementId) :
        api.post(`/financial-analysis/calculate-m-score/${statementId}`);
};

/**
 * Calculate Piotroski F-Score
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const calculateFScore = (statementId) => {
    return serviceAnalysis.calculateFScore ?
        serviceAnalysis.calculateFScore(statementId) :
        api.post(`/financial-analysis/calculate-f-score/${statementId}`);
};

/**
 * Calculate financial ratios
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const calculateFinancialRatios = (statementId) => {
    return serviceAnalysis.calculateFinancialRatios ?
        serviceAnalysis.calculateFinancialRatios(statementId) :
        api.post(`/financial-analysis/calculate-ratios/${statementId}`);
};

// Documents
/**
 * Upload a document for a financial statement
 * @param {number} statementId - Statement ID
 * @param {File} file - Document file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - API response
 */
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