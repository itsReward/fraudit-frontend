// src/api/ml.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';
import { formatQueryParams } from '../utils/apiUtils';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.ml : api;

/**
 * Get all ML models
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getModels = (params) => {
    const filteredParams = params ? formatQueryParams(params) : {};
    
    return service && service.getModels ?
        service.getModels(filteredParams) :
        api.get('/ml/models', { params: filteredParams });
};

/**
 * Get model by ID
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - API response
 */
export const getModelById = (id) => {
    return service && service.getModelById ?
        service.getModelById(id) :
        api.get(`/ml/models/${id}`);
};

/**
 * Create a new ML model
 * @param {Object} modelData - Model data
 * @returns {Promise<Object>} - API response
 */
export const createModel = (modelData) => {
    const filteredData = formatQueryParams(modelData);
    
    return service && service.createModel ?
        service.createModel(filteredData) :
        api.post('/ml/models', filteredData);
};

/**
 * Update an ML model
 * @param {number} id - Model ID
 * @param {Object} modelData - Model data
 * @returns {Promise<Object>} - API response
 */
export const updateModel = (id, modelData) => {
    const filteredData = formatQueryParams(modelData);
    
    return service && service.updateModel ?
        service.updateModel(id, filteredData) :
        api.put(`/ml/models/${id}`, filteredData);
};

/**
 * Activate an ML model
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - API response
 */
export const activateModel = (id) => {
    return service && service.activateModel ?
        service.activateModel(id) :
        api.put(`/ml/models/${id}/activate`);
};

/**
 * Deactivate an ML model
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - API response
 */
export const deactivateModel = (id) => {
    return service && service.deactivateModel ?
        service.deactivateModel(id) :
        api.put(`/ml/models/${id}/deactivate`);
};

/**
 * Delete an ML model
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - API response
 */
export const deleteModel = (id) => {
    return service && service.deleteModel ?
        service.deleteModel(id) :
        api.delete(`/ml/models/${id}`);
};

/**
 * Get ML predictions by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getPredictionsByStatementId = (statementId) => {
    return service && service.getPredictionsByStatementId ?
        service.getPredictionsByStatementId(statementId) :
        api.get(`/ml/predictions/statement/${statementId}`);
};

/**
 * Perform ML prediction for a statement
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const performPrediction = (statementId) => {
    return service && service.performPrediction ?
        service.performPrediction(statementId) :
        api.post(`/ml/predict/${statementId}`);
};

/**
 * Prepare ML features for a statement
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const prepareMLFeatures = (statementId) => {
    return service && service.prepareMLFeatures ?
        service.prepareMLFeatures(statementId) :
        api.post(`/financial-analysis/prepare-ml-features/${statementId}`);
};