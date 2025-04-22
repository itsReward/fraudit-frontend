// src/api/companies.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockService.companies : api;

/**
 * Get a list of companies with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.sector - Filter by sector
 * @param {number} params.page - Page number (0-based)
 * @param {number} params.size - Page size
 * @returns {Promise<Object>} - API response
 */
export const getCompanies = (params) => {
    return service.getCompanies ?
        service.getCompanies(params) :
        api.get('/companies', { params });
};

/**
 * Get a company by ID
 * @param {number} id - Company ID
 * @returns {Promise<Object>} - API response
 */
export const getCompanyById = (id) => {
    return service.getCompanyById ?
        service.getCompanyById(id) :
        api.get(`/companies/${id}`);
};

/**
 * Get a company by stock code
 * @param {string} stockCode - Company stock code
 * @returns {Promise<Object>} - API response
 */
export const getCompanyByStockCode = (stockCode) => {
    return service.getCompanyByStockCode ?
        service.getCompanyByStockCode(stockCode) :
        api.get(`/companies/stock/${stockCode}`);
};

/**
 * Create a new company
 * @param {Object} companyData - Company data
 * @returns {Promise<Object>} - API response
 */
export const createCompany = (companyData) => {
    return service.createCompany ?
        service.createCompany(companyData) :
        api.post('/companies', companyData);
};

/**
 * Update an existing company
 * @param {number} id - Company ID
 * @param {Object} companyData - Company data
 * @returns {Promise<Object>} - API response
 */
export const updateCompany = (id, companyData) => {
    return service.updateCompany ?
        service.updateCompany(id, companyData) :
        api.put(`/companies/${id}`, companyData);
};

/**
 * Delete a company
 * @param {number} id - Company ID
 * @returns {Promise<Object>} - API response
 */
export const deleteCompany = (id) => {
    return service.deleteCompany ?
        service.deleteCompany(id) :
        api.delete(`/companies/${id}`);
};

/**
 * Get a company's risk profile
 * @param {number} id - Company ID
 * @returns {Promise<Object>} - API response
 */
export const getCompanyRiskProfile = (id) => {
    return service.getCompanyRiskProfile ?
        service.getCompanyRiskProfile(id) :
        api.get(`/companies/${id}/risk`);
};

/**
 * Check if a company name is available
 * @param {string} name - Company name
 * @returns {Promise<Object>} - API response
 */
export const checkNameAvailability = (name) => {
    return service.checkNameAvailability ?
        service.checkNameAvailability(name) :
        api.get('/companies/check-name', { params: { name } });
};

/**
 * Check if a stock code is available
 * @param {string} stockCode - Stock code
 * @returns {Promise<Object>} - API response
 */
export const checkStockCodeAvailability = (stockCode) => {
    return service.checkStockCodeAvailability ?
        service.checkStockCodeAvailability(stockCode) :
        api.get('/companies/check-stock-code', { params: { stockCode } });
};

/**
 * Get all available sectors
 * @returns {Promise<Object>} - API response
 */
export const getSectors = () => {
    return service.getSectors ?
        service.getSectors() :
        api.get('/companies/sectors');
};