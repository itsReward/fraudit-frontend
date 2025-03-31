// src/api/companies.js
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockService.companies : api;

export const getCompanies = (params) => {
    return service.getCompanies ? service.getCompanies(params) :
        api.get('/companies', { params });
};

export const getCompanyById = (id) => {
    return service.getCompanyById ? service.getCompanyById(id) :
        api.get(`/companies/${id}`);
};

export const getCompanyByStockCode = (stockCode) => {
    return service.getCompanyByStockCode ? service.getCompanyByStockCode(stockCode) :
        api.get(`/companies/stock/${stockCode}`);
};

export const createCompany = (companyData) => {
    return service.createCompany ? service.createCompany(companyData) :
        api.post('/companies', companyData);
};

export const updateCompany = (id, companyData) => {
    return service.updateCompany ? service.updateCompany(id, companyData) :
        api.put(`/companies/${id}`, companyData);
};

export const deleteCompany = (id) => {
    return service.deleteCompany ? service.deleteCompany(id) :
        api.delete(`/companies/${id}`);
};

export const getCompanyRiskProfile = (id) => {
    return service.getCompanyRiskProfile ? service.getCompanyRiskProfile(id) :
        api.get(`/companies/${id}/risk`);
};