// src/pages/documents/StatementDocuments.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getDocumentsByStatement } from '../../api/documents';
import { getStatementById } from '../../api/financial';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import DocumentUploader from '../../components/documents/DocumentUploader';
import { FiFileText, FiDownload, FiPlus, FiArrowLeft, FiFolder } from 'react-icons/fi';

const StatementDocuments = () => {
    const { statementId } = useParams();
    const [showUploader, setShowUploader] = useState(false);

    // Fetch statement
    const {
        data: statementData,
        isLoading: statementLoading,
        error: statementError
    } = useQuery(
        ['statement', statementId],
        () => getStatementById(statementId)
    );

    // Fetch documents for statement
    const {
        data: documentsData,
        isLoading: documentsLoading,
        error: documentsError,
        refetch: refetchDocuments
    } = useQuery(
        ['documents', { statementId }],
        () => getDocumentsByStatement(statementId)
    );

    // Extract data
    const statement = statementData?.data?.data;
    const documents = documentsData?.data?.data || [];

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
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

    // Get document icon based on type
    const getDocumentIcon = (type) => {
        if (!type) return <FiFileText className="text-secondary-400" />;

        switch(type.toLowerCase()) {
            case 'pdf':
                return <FiFileText className="text-danger-500" />;
            case 'excel':
            case 'xlsx':
            case 'xls':
                return <FiFileText className="text-success-500" />;
            case 'word':
            case 'doc':
            case 'docx':
                return <FiFileText className="text-primary-500" />;
            default:
                return <FiFileText className="text-secondary-400" />;
        }
    };

    // Handle upload success
    const handleUploadSuccess = () => {
        setShowUploader(false);
        refetchDocuments();
    };

    // Loading state
    const isLoading = statementLoading || documentsLoading;
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    const error = statementError || documentsError;
    if (error) {
        return (
            <Alert variant="danger" title="Error loading data">
                An error occurred while fetching data. Please try again later.
                <div className="mt-4">
                    <Button variant="outline" to="/statements">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Statements
                    </Button>
                </div>
            </Alert>
        );
    }

    // Not found state
    if (!statement) {
        return (
            <Alert variant="warning" title="Statement not found">
                The requested financial statement could not be found.
                <div className="mt-4">
                    <Button variant="outline" to="/statements">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Statements
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link to={`/statements/${statementId}`} className="mr-4 text-secondary-500 hover:text-secondary-700">
                    <FiArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Financial Statement Documents</h1>
                    <p className="mt-1 text-secondary-500">
                        {statement.companyName} • {statement.year} {statement.statementType} {statement.period && `• ${statement.period}`}
                    </p>
                </div>
            </div>

            {/* Upload button */}
            <div className="flex justify-end">
                <Button
                    variant="primary"
                    onClick={() => setShowUploader(true)}
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            {/* Document uploader */}
            {showUploader && (
                <DocumentUploader
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={() => setShowUploader(false)}
                    companyId={statement.companyId}
                    statementId={statementId}
                />
            )}

            {/* Documents list */}
            <Card title="Statement Documents">
                {documents.length > 0 ? (
                    <div className="overflow-hidden">
                        <ul className="divide-y divide-secondary-200">
                            {documents.map((document) => (
                                <li key={document.id}>
                                    <Link
                                        to={`/documents/${document.id}`}
                                        className="block hover:bg-secondary-50"
                                    >
                                        <div className="px-4 py-4 flex items-center sm:px-6">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 flex items-center justify-center">
                                                    {getDocumentIcon(document.documentType)}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-primary-600 truncate">
                                                        {document.name}
                                                    </div>
                                                    <div className="mt-1 flex">
                                                        <div className="flex items-center text-sm text-secondary-500">
                                                            <span>
                                                                Uploaded on {formatDate(document.uploadDate)}
                                                            </span>
                                                            <span className="mx-1">•</span>
                                                            <span>{formatFileSize(document.fileSize)}</span>
                                                            {document.documentType && (
                                                                <>
                                                                    <span className="mx-1">•</span>
                                                                    <span>{document.documentType}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex-shrink-0 sm:mt-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            // In a real app, this would download the file
                                                            console.log(`Downloading document: ${document.id}`);
                                                        }}
                                                    >
                                                        <FiDownload className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <FiFolder className="h-16 w-16 text-secondary-300" />
                        <h3 className="mt-3 text-lg font-medium text-secondary-900">No documents found</h3>
                        <p className="mt-1 text-sm text-secondary-500 text-center max-w-md">
                            No documents have been uploaded for this financial statement yet.
                        </p>
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                onClick={() => setShowUploader(true)}
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

export default StatementDocuments;