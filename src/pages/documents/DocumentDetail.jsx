// src/pages/documents/DocumentDetail.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentById, deleteDocument } from '../../api/documents';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import { FiDownload, FiTrash2, FiEdit, FiArrowLeft, FiFile, FiPaperclip, FiCalendar, FiUser, FiHardDrive } from 'react-icons/fi';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Fetch document
    const { data, isLoading, error } = useQuery(
        ['document', id],
        () => getDocumentById(id)
    );

    // Delete mutation
    const deleteMutation = useMutation(
        () => deleteDocument(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('documents');
                navigate('/documents');
            },
            onError: (err) => {
                setDeleteError(err.response?.data?.message || 'An error occurred while deleting the document');
            }
        }
    );

    // Extract document data
    const document = data?.data?.data;

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    // Handle document download
    const handleDownload = () => {
        // In a real app, this would trigger a download
        console.log(`Downloading document with ID: ${id}`);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        deleteMutation.mutate();
    };

    // Get document type icon
    const getDocumentTypeIcon = (type) => {
        if (!type) return <FiFile className="h-12 w-12 text-secondary-400" />;

        switch(type.toLowerCase()) {
            case 'pdf':
                return <FiFile className="h-12 w-12 text-danger-500" />;
            case 'excel':
            case 'xlsx':
            case 'xls':
                return <FiFile className="h-12 w-12 text-success-500" />;
            case 'word':
            case 'doc':
            case 'docx':
                return <FiFile className="h-12 w-12 text-primary-500" />;
            default:
                return <FiFile className="h-12 w-12 text-secondary-400" />;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Alert variant="danger" title="Error loading document">
                An error occurred while fetching the document. Please try again later.
                <div className="mt-4">
                    <Button variant="outline" to="/documents">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Documents
                    </Button>
                </div>
            </Alert>
        );
    }

    // Not found state
    if (!document) {
        return (
            <Alert variant="warning" title="Document not found">
                The requested document could not be found.
                <div className="mt-4">
                    <Button variant="outline" to="/documents">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Documents
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link to="/documents" className="mr-4 text-secondary-500 hover:text-secondary-700">
                    <FiArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">{document.name}</h1>
                    <p className="mt-1 text-secondary-500">
                        {document.documentType || 'Document'} • Uploaded on {formatDate(document.uploadDate)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document Preview */}
                <Card className="lg:col-span-2">
                    <div className="flex flex-col items-center justify-center py-12 bg-secondary-50 rounded-md">
                        {getDocumentTypeIcon(document.fileType)}
                        <p className="mt-4 text-sm font-medium text-secondary-700">
                            {document.fileType?.toUpperCase() || 'Unknown'} Document
                        </p>
                        <p className="mt-1 text-sm text-secondary-500">
                            {document.name}
                        </p>
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                onClick={handleDownload}
                            >
                                <FiDownload className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Document Details */}
                <Card title="Document Information">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-secondary-700">Description</h3>
                            <p className="mt-1 text-sm text-secondary-900">
                                {document.description || 'No description provided'}
                            </p>
                        </div>

                        <div className="border-t border-secondary-200 pt-4">
                            <div className="flex items-center text-sm">
                                <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-400" />
                                <span className="text-secondary-700">Uploaded on {formatDate(document.uploadDate)}</span>
                            </div>
                        </div>

                        {document.uploadedByUsername && (
                            <div className="flex items-center text-sm">
                                <FiUser className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-400" />
                                <span className="text-secondary-700">Uploaded by {document.uploadedByUsername}</span>
                            </div>
                        )}

                        <div className="flex items-center text-sm">
                            <FiHardDrive className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-400" />
                            <span className="text-secondary-700">File size: {formatFileSize(document.fileSize)}</span>
                        </div>

                        {document.companyName && (
                            <div className="flex items-center text-sm">
                                <FiPaperclip className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-400" />
                                <span className="text-secondary-700">
                                    Associated with:{' '}
                                    <Link
                                        to={`/companies/${document.companyId}`}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        {document.companyName}
                                    </Link>
                                </span>
                            </div>
                        )}

                        {document.statementId && (
                            <div className="flex items-center text-sm">
                                <FiPaperclip className="flex-shrink-0 mr-1.5 h-5 w-5 text-secondary-400" />
                                <span className="text-secondary-700">
                                    Linked to:{' '}
                                    <Link
                                        to={`/statements/${document.statementId}`}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        Financial Statement
                                    </Link>
                                </span>
                            </div>
                        )}

                        <div className="border-t border-secondary-200 pt-4 flex space-x-3">
                            <Button
                                variant="danger"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <FiTrash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Document"
                confirmText="Delete"
                confirmVariant="danger"
                isConfirmLoading={deleteMutation.isLoading}
            >
                <p className="text-sm text-secondary-500">
                    Are you sure you want to delete this document? This action cannot be undone.
                </p>
                {deleteError && (
                    <Alert
                        variant="danger"
                        title="Error"
                        className="mt-3"
                    >
                        {deleteError}
                    </Alert>
                )}
            </ConfirmModal>
        </div>
    );
};

export default DocumentDetail;