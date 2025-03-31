import api from './index';

export const getCompanies = (params) => {
    return api.get('/companies', { params });
};

export const getCompanyById = (id) => {
    return api.get(`/companies/${id}`);
};

export const getCompanyByStockCode = (stockCode) => {
    return api.get(`/companies/stock/${stockCode}`);
};

export const createCompany = (companyData) => {
    return api.post('/companies', companyData);
};

export const updateCompany = (id, companyData) => {
    return api.put(`/companies/${id}`, companyData);
};

export const deleteCompany = (id) => {
    return api.delete(`/companies/${id}`);
};

export const getCompanyRiskProfile = (id) => {
    return api.get(`/companies/${id}/risk`);
};