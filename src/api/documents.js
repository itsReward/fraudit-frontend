// src/api/documents.js - Integrated with API endpoints
import api from './index';
import config from '../config';
import mockService from './mockService';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.documents : api;

/**
 * Get documents with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getDocuments = (params) => {
    return service.getDocuments ?
        service.getDocuments(params) :
        api.get('/documents', { params });
};

/**
 * Get document by ID
 * @param {number} id - Document ID
 * @returns {Promise<Object>} - API response
 */
export const getDocumentById = (id) => {
    return service.getDocumentById ?
        service.getDocumentById(id) :
        api.get(`/documents/${id}`);
};

/**
 * Get documents by statement ID
 * @param {number} statementId - Statement ID
 * @returns {Promise<Object>} - API response
 */
export const getDocumentsByStatement = (statementId) => {
    return service.getDocumentsByStatement ?
        service.getDocumentsByStatement(statementId) :
        api.get(`/documents/statement/${statementId}`);
};

/**
 * Upload a document
 * @param {FormData} formData - Form data with file and metadata
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - API response
 */
export const uploadDocument = (formData, options = {}) => {
    return service.uploadDocument ?
        service.uploadDocument(formData) :
        api.post('/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...options
        });
};

/**
 * Download a document
 * @param {number} id - Document ID
 * @returns {Promise<Blob>} - Document blob
 */
export const downloadDocument = (id) => {
    return service.downloadDocument ?
        service.downloadDocument(id) :
        api.get(`/documents/${id}/download`, {
            responseType: 'blob'
        });
};

/**
 * Delete a document
 * @param {number} id - Document ID
 * @returns {Promise<Object>} - API response
 */
export const deleteDocument = (id) => {
    return service.deleteDocument ?
        service.deleteDocument(id) :
        api.delete(`/documents/${id}`);
};