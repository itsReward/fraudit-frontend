// src/api/documents.js - Updated to match the API documentation
import api from './index';
import config from '../config';
import mockService from './mockService';
import { formatQueryParams } from '../utils/apiUtils';

// Use mock service for demo mode
const service = config.api.demoMode ? mockService.documents : api;

/**
 * Get documents with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - API response
 */
export const getDocuments = (params) => {
    const cleanParams = formatQueryParams(params);
    return service.getDocuments ?
        service.getDocuments(cleanParams) :
        api.get('/documents', { params: cleanParams });
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
 * Upload a document
 * @param {FormData} formData - Form data with file and metadata
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - API response
 */
export const uploadDocument = (formData, options = {}) => {
    // Log formData for debugging
    console.log('Uploading document with metadata:',
        Object.fromEntries(
            Array.from(formData.entries())
                .filter(([key]) => key !== 'file')
        )
    );

    // Check if we're in demo mode
    if (config.api.demoMode) {
        return service.uploadDocument ?
            service.uploadDocument(formData) :
            // Simulate successful upload after a delay for demo mode
            new Promise((resolve) => {
                // Simulate progress if provided
                if (options.onUploadProgress) {
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 10;
                        options.onUploadProgress({ loaded: progress, total: 100 });
                        if (progress >= 100) {
                            clearInterval(interval);
                        }
                    }, 200);
                }

                // Resolve after a delay
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            message: 'Document uploaded successfully',
                            data: {
                                id: Math.floor(Math.random() * 10000),
                                statementId: formData.get('statementId'),
                                fileName: formData.get('file')?.name || 'document.pdf',
                                fileType: formData.get('file')?.type || 'application/pdf',
                                fileSize: formData.get('file')?.size || 1024,
                                uploadDate: new Date().toISOString()
                            }
                        }
                    });
                }, 2500);
            });
    }

    // Real API call with proper headers
    return api.post('/documents/upload', formData, {
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