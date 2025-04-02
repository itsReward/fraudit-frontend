// src/pages/documents/DocumentsList.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { getDocuments } from '../../api/documents';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import DocumentUploader from '../../components/documents/DocumentUploader';
import { FiFile, FiDownload, FiTrash2, FiSearch, FiFilter, FiPlus, FiX, FiFolder } from 'react-icons/fi';

const DocumentsList = () => {
    // Parse query parameters
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const companyIdParam = searchParams.get('companyId');
    const statementIdParam = searchParams.get('statementId');

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        companyId: companyIdParam || '',
        statementId: statementIdParam || '',
        documentType: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('uploadDate');
    const [sortDirection, setSortDirection] = useState('desc');

    // Fetch documents with filters
    const { data, isLoading, error, refetch } = useQuery(
        ['documents', filters, page, pageSize, sortBy, sortDirection],
        () => getDocuments({
            ...filters,
            page,
            size: pageSize,
            sort: `${sortBy},${sortDirection}`
        }),
        {
            keepPreviousData: true
        }
    );

    // Extract data from query results
    const documents = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;
    const totalElements = data?.data?.data?.totalElements || 0;

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter change
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(0); // Reset page when filters change
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            companyId: '',
            statementId: '',
            documentType: '',
        });
        setSearchTerm('');
        setPage(0);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle sort
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc'); // Default to descending for new field
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';

        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    // Handle document upload success
    const handleUploadSuccess = () => {
        setShowUploader(false);
        refetch();
    };

    // Get document type icon
    const getDocumentTypeIcon = (type) => {
        if (!type) return <FiFile />;

        switch(type.toLowerCase()) {
            case 'pdf':
                return <FiFile className="text-danger-500" />;
            case 'excel':
            case 'xlsx':
            case 'xls':
                return <FiFile className="text-success-500" />;
            case 'word':
            case 'doc':
            case 'docx':
                return <FiFile className="text-primary-500" />;
            default:
                return <FiFile />;
        }
    };

    // Filter documents by search term
    const filteredDocuments = searchTerm
        ? documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doc.companyName && doc.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : documents;

    // Document types options
    const documentTypeOptions = [
        { value: '', label: 'All Types' },
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
                    <p className="mt-1 text-secondary-500">Browse, view, and manage financial documents</p>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FiFilter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => setShowUploader(true)}
                    >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
                            Search Documents
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-secondary-400" />
                            </div>
                            <input
                                type="text"
                                id="search"
                                className="block w-full pl-10 sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Search by name, description, or company"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Filters */}
            {showFilters && (
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="documentType" className="block text-sm font-medium text-secondary-700 mb-1">
                                Document Type
                            </label>
                            <select
                                id="documentType"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.documentType}
                                onChange={(e) => handleFilterChange('documentType', e.target.value)}
                            >
                                {documentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="companyId" className="block text-sm font-medium text-secondary-700 mb-1">
                                Company
                            </label>
                            <select
                                id="companyId"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.companyId}
                                onChange={(e) => handleFilterChange('companyId', e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {/* Ideally, this would be populated from a companies query */}
                                <option value="1">ABC Corporation</option>
                                <option value="2">XYZ Enterprises</option>
                                <option value="3">Global Mining Ltd</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={resetFilters}
                                className="w-full md:w-auto"
                            >
                                <FiX className="mr-2 h-4 w-4" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Document Uploader */}
            {showUploader && (
                <DocumentUploader
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={() => setShowUploader(false)}
                    companyId={filters.companyId || undefined}
                    statementId={filters.statementId || undefined}
                />
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <Loading />
                </div>
            )}

            {/* Error state */}
            {error && (
                <Alert variant="danger" title="Error loading documents">
                    An error occurred while fetching documents. Please try again later.
                </Alert>
            )}

            {/* Documents List */}
            {!isLoading && !error && (
                filteredDocuments.length > 0 ? (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Document
                                            {sortBy === 'name' && (
                                                <span className="ml-1">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('documentType')}
                                    >
                                        <div className="flex items-center">
                                            Type
                                            {sortBy === 'documentType' && (
                                                <span className="ml-1">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('companyName')}
                                    >
                                        <div className="flex items-center">
                                            Company
                                            {sortBy === 'companyName' && (
                                                <span className="ml-1">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('uploadDate')}
                                    >
                                        <div className="flex items-center">
                                            Uploaded
                                            {sortBy === 'uploadDate' && (
                                                <span className="ml-1">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('fileSize')}
                                    >
                                        <div className="flex items-center">
                                            Size
                                            {sortBy === 'fileSize' && (
                                                <span className="ml-1">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                {filteredDocuments.map((document) => (
                                    <tr key={document.id} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                                    {getDocumentTypeIcon(document.documentType)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-secondary-900">{document.name}</div>
                                                    {document.description && (
                                                        <div className="text-sm text-secondary-500">{document.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                                                    {document.documentType || 'Unknown'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {document.companyName ? (
                                                <Link
                                                    to={`/companies/${document.companyId}`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    {document.companyName}
                                                </Link>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {formatDate(document.uploadDate)}
                                            {document.uploadedByUsername && (
                                                <div className="text-xs text-secondary-400">
                                                    by {document.uploadedByUsername}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {formatFileSize(document.fileSize)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mr-2"
                                                title="Download"
                                            >
                                                <FiDownload className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="h-4 w-4 text-danger-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-secondary-700">
                                            Showing <span className="font-medium">{page * pageSize + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min((page + 1) * pageSize, totalElements)}
                                            </span>{' '}
                                            of <span className="font-medium">{totalElements}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium ${
                                                    page === 0
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50'
                                                }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {/* Page numbers */}
                                            {[...Array(totalPages).keys()].map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        pageNumber === page
                                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                            : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                                    }`}
                                                >
                                                    {pageNumber + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page >= totalPages - 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium ${
                                                    page >= totalPages - 1
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50'
                                                }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ) : (
                    <Card>
                        <div className="py-12 flex flex-col items-center justify-center">
                            <FiFolder className="h-16 w-16 text-secondary-300" />
                            <h3 className="mt-3 text-lg font-medium text-secondary-900">No documents found</h3>
                            <p className="mt-1 text-sm text-secondary-500 text-center max-w-md">
                                {searchTerm || Object.values(filters).some(Boolean)
                                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                    : 'Get started by uploading a document using the button above.'}
                            </p>
                            {!(searchTerm || Object.values(filters).some(Boolean)) && (
                                <div className="mt-6">
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowUploader(true)}
                                    >
                                        <FiPlus className="mr-2 h-4 w-4" />
                                        Upload Document
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                )
            )}
        </div>
    );
};

export default DocumentsList;