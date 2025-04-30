// src/pages/documents/StatementDocuments.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentsByStatement, downloadDocument, deleteDocument } from '../../api/documents';
import { getStatementById } from '../../api/financial';
import DocumentUploader from '../../components/documents/DocumentUploader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { FiDownload, FiTrash2, FiPlus, FiFile, FiArrowLeft } from 'react-icons/fi';

const StatementDocuments = () => {
    const { statementId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State for modals
    const [showUploader, setShowUploader] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    // Fetch statement details
    const {
        data: statementData,
        isLoading: statementLoading,
        error: statementError
    } = useQuery(
        ['statement', statementId],
        () => getStatementById(statementId),
        {
            enabled: !!statementId,
            onError: (error) => {
                console.error('Error fetching statement:', error);
            }
        }
    );

    // Fetch statement documents
    const {
        data: documentsData,
        isLoading: documentsLoading,
        error: documentsError,
        refetch: refetchDocuments
    } = useQuery(
        ['statementDocuments', statementId],
        () => getDocumentsByStatement(statementId),
        {
            enabled: !!statementId,
            onError: (error) => {
                console.error('Error fetching documents:', error);
            }
        }
    );

    // Delete document mutation
    const deleteMutation = useMutation(
        (id) => deleteDocument(id),
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(['statementDocuments', statementId]);
                setDeleteModalOpen(false);
                setDocumentToDelete(null);
            },
            onError: (error) => {
                console.error('Error deleting document:', error);
            }
        }
    );

    // Handle download
    const handleDownload = async (documentId) => {
        try {
            const response = await downloadDocument(documentId);

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            // Get filename from header or use a default
            let filename = 'document';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    // Handle delete
    const handleDelete = (document) => {
        setDocumentToDelete(document);
        setDeleteModalOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (documentToDelete) {
            deleteMutation.mutate(documentToDelete.id);
        }
    };

    // Handle upload success
    const handleUploadSuccess = () => {
        // Hide uploader and refresh list
        setShowUploader(false);
        refetchDocuments();
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes && bytes !== 0) return 'N/A';

        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';

        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        if (i === 0) return `${bytes} ${sizes[i]}`;

        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // Get file icon based on file type
    const getFileIcon = (fileType) => {
        // For now just return the default file icon
        return <FiFile className="h-5 w-5" />;
    };

    // Loading state
    if (statementLoading || documentsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (statementError || documentsError) {
        return (
            <Alert variant="danger" title="Error loading data">
                {statementError?.message || documentsError?.message || 'An error occurred while loading data. Please try again.'}
            </Alert>
        );
    }

    // Extract data
    const statement = statementData?.data?.data;
    const documents = documentsData?.data?.data || [];

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center">
                <button
                    className="mr-4 text-secondary-500 hover:text-secondary-700"
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Statement Documents</h1>
                    <p className="mt-1 text-secondary-500">
                        {statement?.companyName} - {statement?.year} {statement?.statementType}
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
                    statementId={statementId}
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={() => setShowUploader(false)}
                />
            )}

            {/* Documents list */}
            <Card title="Documents">
                {documents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Document
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Size
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Upload Date
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                            {documents.map((document) => (
                                <tr key={document.id} className="hover:bg-secondary-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 text-secondary-400">
                                                {getFileIcon(document.fileType)}
                                            </div>
                                            <div className="ml-3">
                                                <div className="font-medium text-secondary-900">
                                                    {document.fileName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                        {formatFileSize(document.fileSize)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                        {document.fileType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                        {formatDate(document.uploadDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(document.id)}
                                                title="Download document"
                                            >
                                                <FiDownload className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(document)}
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
                            Get started by uploading a document for this financial statement.
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

            {/* Delete confirmation modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Document"
                confirmText="Delete"
                confirmVariant="danger"
                isConfirmLoading={deleteMutation.isLoading}
            >
                <p>
                    Are you sure you want to delete the document "{documentToDelete?.fileName}"?
                    This action cannot be undone.
                </p>
            </ConfirmModal>
        </div>
    );
};

export default StatementDocuments;