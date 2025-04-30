// src/pages/documents/DocumentsList.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../../api/documents';
import DocumentUploader from '../../components/documents/DocumentUploader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiPlus, FiFile, FiDownload, FiEye, FiTrash2 } from 'react-icons/fi';

const DocumentsList = () => {
    // State
    const [showUploader, setShowUploader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch documents
    const { data, isLoading, error, refetch } = useQuery(
        ['documents', { page, pageSize, documentType }],
        () => getDocuments({ page, size: pageSize, documentType })
    );

    const documents = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;

    // Handle the upload button click - this is the key fix
    const handleUploadClick = () => {
        console.log('Upload button clicked, showing uploader');
        setShowUploader(true);
    };

    // Handle upload success
    const handleUploadSuccess = () => {
        console.log('Upload successful, hiding uploader and refreshing list');
        setShowUploader(false);
        refetch();
    };

    // Handle cancel
    const handleUploadCancel = () => {
        console.log('Upload cancelled, hiding uploader');
        setShowUploader(false);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter changes
    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Filter documents by search term
    const filteredDocuments = searchTerm
        ? documents.filter(doc =>
            doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : documents;

    // Document type options
    const documentTypeOptions = [
        { value: '', label: 'All Document Types' },
        { value: 'FINANCIAL_STATEMENT', label: 'Financial Statement' },
        { value: 'ANNUAL_REPORT', label: 'Annual Report' },
        { value: 'AUDIT_REPORT', label: 'Audit Report' },
        { value: 'TAX_FILING', label: 'Tax Filing' },
        { value: 'REGULATORY_FILING', label: 'Regulatory Filing' },
        { value: 'OTHER', label: 'Other' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Documents</h1>
                    <p className="mt-1 text-secondary-500">Manage and access important documents</p>
                </div>

                <Button
                    variant="primary"
                    onClick={handleUploadClick}
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            {/* Document Uploader - Only shown when showUploader is true */}
            {showUploader && (
                <DocumentUploader
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={handleUploadCancel}
                />
            )}

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Search by name, description, or type"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="documentType" className="block text-sm font-medium text-secondary-700 mb-1">
                            Document Type
                        </label>
                        <select
                            id="documentType"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                        >
                            {documentTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/6 md:self-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setDocumentType('');
                                setPage(0);
                            }}
                            className="w-full"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Documents List */}
            <Card>
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loading />
                    </div>
                ) : error ? (
                    <Alert variant="danger" title="Error loading documents">
                        An error occurred while fetching documents. Please try again later.
                    </Alert>
                ) : filteredDocuments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Document Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Upload Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Uploaded By
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                            {filteredDocuments.map((document) => (
                                <tr key={document.id} className="hover:bg-secondary-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FiFile className="flex-shrink-0 h-5 w-5 text-secondary-400" />
                                            <div className="ml-3">
                                                <div className="font-medium text-secondary-900">{document.fileName}</div>
                                                {document.description && (
                                                    <div className="text-sm text-secondary-500">{document.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                                {document.documentType?.replace(/_/g, ' ') || 'Unknown'}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                        {formatDate(document.uploadDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                        {document.uploadedBy || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {/* Handle view */}}
                                                title="View document"
                                            >
                                                <FiEye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {/* Handle download */}}
                                                title="Download document"
                                            >
                                                <FiDownload className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {/* Handle delete */}}
                                                title="Delete document"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FiFile className="mx-auto h-12 w-12 text-secondary-400" />
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No documents found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {searchTerm || documentType
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by uploading your first document.'}
                        </p>
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                onClick={handleUploadClick}
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Upload Document
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DocumentsList;