// src/api/documents.js
import api from './index';
import config from '../config';

// Mock service for demo mode
const mockDocumentsAPI = {
    getDocuments: async (params) => {
        // Return mock documents data with pagination
        const mockDocuments = [
            {
                id: 1,
                name: 'Annual Report 2023.pdf',
                description: 'Annual financial report for fiscal year 2023',
                documentType: 'ANNUAL_REPORT',
                fileType: 'pdf',
                fileSize: 2458621, // ~2.4 MB
                uploadDate: '2023-12-15T10:30:00Z',
                uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                uploadedByUsername: 'admin',
                companyId: 1,
                companyName: 'ABC Corporation',
                statementId: 1
            },
            {
                id: 2,
                name: 'Q3 Financial Statement.xlsx',
                description: 'Quarterly financial data for Q3 2023',
                documentType: 'FINANCIAL_STATEMENT',
                fileType: 'xlsx',
                fileSize: 1248000, // ~1.2 MB
                uploadDate: '2023-10-10T14:15:00Z',
                uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                uploadedByUsername: 'admin',
                companyId: 1,
                companyName: 'ABC Corporation',
                statementId: null
            },
            {
                id: 3,
                name: 'Audit Report 2023.pdf',
                description: 'External auditor report for fiscal year 2023',
                documentType: 'AUDIT_REPORT',
                fileType: 'pdf',
                fileSize: 3562000, // ~3.6 MB
                uploadDate: '2023-12-12T09:45:00Z',
                uploadedByUserId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
                uploadedByUsername: 'analyst',
                companyId: 1,
                companyName: 'ABC Corporation',
                statementId: 1
            },
            {
                id: 4,
                name: 'Tax Filing 2023.pdf',
                description: 'Annual tax filing documents',
                documentType: 'TAX_FILING',
                fileType: 'pdf',
                fileSize: 4150000, // ~4.1 MB
                uploadDate: '2023-11-28T11:20:00Z',
                uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                uploadedByUsername: 'admin',
                companyId: 2,
                companyName: 'XYZ Enterprises',
                statementId: 2
            },
            {
                id: 5,
                name: 'Board Presentation.pptx',
                description: 'Financial presentation for board meeting',
                documentType: 'OTHER',
                fileType: 'pptx',
                fileSize: 5280000, // ~5.3 MB
                uploadDate: '2023-12-01T15:30:00Z',
                uploadedByUserId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
                uploadedByUsername: 'regulator',
                companyId: 2,
                companyName: 'XYZ Enterprises',
                statementId: null
            }
        ];

        // Apply filters
        let filteredDocuments = [...mockDocuments];

        if (params?.companyId) {
            filteredDocuments = filteredDocuments.filter(doc =>
                doc.companyId === parseInt(params.companyId)
            );
        }

        if (params?.statementId) {
            filteredDocuments = filteredDocuments.filter(doc =>
                doc.statementId === parseInt(params.statementId)
            );
        }

        if (params?.documentType) {
            filteredDocuments = filteredDocuments.filter(doc =>
                doc.documentType === params.documentType
            );
        }

        // Apply sorting if specified
        if (params?.sort) {
            const [sortField, sortDirection] = params.sort.split(',');

            filteredDocuments.sort((a, b) => {
                let aValue = a[sortField];
                let bValue = b[sortField];

                // Handle special cases
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                // Handle null/undefined values
                if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
                if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

                // Regular comparison
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Apply pagination
        const page = params?.page || 0;
        const size = params?.size || 10;
        const start = page * size;
        const end = start + size;
        const paginatedDocuments = filteredDocuments.slice(start, end);

        return {
            data: {
                success: true,
                message: 'Success',
                data: {
                    content: paginatedDocuments,
                    page: page,
                    size: size,
                    totalElements: filteredDocuments.length,
                    totalPages: Math.ceil(filteredDocuments.length / size),
                    first: page === 0,
                    last: end >= filteredDocuments.length
                }
            }
        };
    },

    getDocumentById: async (id) => {
        // Mock document data
        const document = {
            id: parseInt(id),
            name: 'Annual Report 2023.pdf',
            description: 'Annual financial report for fiscal year 2023',
            documentType: 'ANNUAL_REPORT',
            fileType: 'pdf',
            fileSize: 2458621, // ~2.4 MB
            uploadDate: '2023-12-15T10:30:00Z',
            uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
            uploadedByUsername: 'admin',
            companyId: 1,
            companyName: 'ABC Corporation',
            statementId: 1
        };

        return {
            data: {
                success: true,
                message: 'Success',
                data: document
            }
        };
    },

    getDocumentsByStatement: async (statementId) => {
        // Mock documents for a specific statement
        const documents = [
            {
                id: 1,
                name: 'Annual Report 2023.pdf',
                description: 'Annual financial report for fiscal year 2023',
                documentType: 'ANNUAL_REPORT',
                fileType: 'pdf',
                fileSize: 2458621, // ~2.4 MB
                uploadDate: '2023-12-15T10:30:00Z',
                uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                uploadedByUsername: 'admin',
                companyId: 1,
                companyName: 'ABC Corporation',
                statementId: parseInt(statementId)
            },
            {
                id: 3,
                name: 'Audit Report 2023.pdf',
                description: 'External auditor report for fiscal year 2023',
                documentType: 'AUDIT_REPORT',
                fileType: 'pdf',
                fileSize: 3562000, // ~3.6 MB
                uploadDate: '2023-12-12T09:45:00Z',
                uploadedByUserId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
                uploadedByUsername: 'analyst',
                companyId: 1,
                companyName: 'ABC Corporation',
                statementId: parseInt(statementId)
            }
        ];

        return {
            data: {
                success: true,
                message: 'Success',
                data: documents
            }
        };
    },

    uploadDocument: async (formData) => {
        // Mock document upload
        return {
            data: {
                success: true,
                message: 'Document uploaded successfully',
                data: {
                    id: Math.floor(Math.random() * 1000) + 10,
                    name: 'Uploaded Document.pdf',
                    uploadDate: new Date().toISOString()
                }
            }
        };
    },

    deleteDocument: async (id) => {
        // Mock document deletion
        return {
            data: {
                success: true,
                message: 'Document deleted successfully'
            }
        };
    }
};

// Use mock service or real API based on demo mode setting
const service = config.api.demoMode ? mockDocumentsAPI : api;

export const getDocuments = (params) => {
    return service.getDocuments ? service.getDocuments(params) :
        api.get('/documents', { params });
};

export const getDocumentById = (id) => {
    return service.getDocumentById ? service.getDocumentById(id) :
        api.get(`/documents/${id}`);
};

export const getDocumentsByStatement = (statementId) => {
    return service.getDocumentsByStatement ? service.getDocumentsByStatement(statementId) :
        api.get(`/documents/statement/${statementId}`);
};

export const uploadDocument = (formData, options = {}) => {
    return service.uploadDocument ? service.uploadDocument(formData) :
        api.post('/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...options
        });
};

export const deleteDocument = (id) => {
    return service.deleteDocument ? service.deleteDocument(id) :
        api.delete(`/documents/${id}`);
};