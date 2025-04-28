// src/api/fiscalYears.js - API endpoints for fiscal years
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.fiscalYears : api;

/**
 * Get fiscal years with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getFiscalYears = (params) => {
    return service && service.getFiscalYears ?
        service.getFiscalYears(params) :
        api.get('/fiscal-years', { params });
};

/**
 * Get fiscal year by ID
 * @param {number} id - Fiscal year ID
 * @returns {Promise<Object>} - API response
 */
export const getFiscalYearById = (id) => {
    return service && service.getFiscalYearById ?
        service.getFiscalYearById(id) :
        api.get(`/fiscal-years/${id}`);
};

/**
 * Get fiscal years by company ID
 * @param {number} companyId - Company ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - API response
 */
export const getFiscalYearsByCompany = (companyId, params = {}) => {
    return service && service.getFiscalYearsByCompany ?
        service.getFiscalYearsByCompany(companyId, params) :
        api.get(`/fiscal-years/company/${companyId}`, { params });
};

/**
 * Create a new fiscal year
 * @param {Object} fiscalYearData - Fiscal year data
 * @returns {Promise<Object>} - API response
 */
export const createFiscalYear = (fiscalYearData) => {
    return service && service.createFiscalYear ?
        service.createFiscalYear(fiscalYearData) :
        api.post('/fiscal-years', fiscalYearData);
};

/**
 * Update a fiscal year
 * @param {number} id - Fiscal year ID
 * @param {Object} fiscalYearData - Fiscal year data
 * @returns {Promise<Object>} - API response
 */
export const updateFiscalYear = (id, fiscalYearData) => {
    return service && service.updateFiscalYear ?
        service.updateFiscalYear(id, fiscalYearData) :
        api.put(`/fiscal-years/${id}`, fiscalYearData);
};

/**
 * Update fiscal year audit status
 * @param {number} id - Fiscal year ID
 * @param {boolean} isAudited - Audit status
 * @returns {Promise<Object>} - API response
 */
export const updateAuditStatus = (id, isAudited) => {
    return service && service.updateAuditStatus ?
        service.updateAuditStatus(id, isAudited) :
        api.put(`/fiscal-years/${id}/audit`, { isAudited });
};

/**
 * Delete a fiscal year
 * @param {number} id - Fiscal year ID
 * @returns {Promise<Object>} - API response
 */
export const deleteFiscalYear = (id) => {
    return service && service.deleteFiscalYear ?
        service.deleteFiscalYear(id) :
        api.delete(`/fiscal-years/${id}`);
};

/**
 * Validate fiscal year
 * @param {number} companyId - Company ID
 * @param {number} year - Year
 * @returns {Promise<Object>} - API response
 */
export const validateFiscalYear = (companyId, year) => {
    return service && service.validateFiscalYear ?
        service.validateFiscalYear(companyId, year) :
        api.get('/fiscal-years/validate', { params: { companyId, year } });
};