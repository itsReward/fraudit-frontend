// src/components/documents/DocumentUploader.jsx
import React, { useState, useRef } from 'react';
import { uploadDocument } from '../../api/documents';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';
import { FiUpload, FiFile, FiPaperclip, FiX } from 'react-icons/fi';

const DocumentUploader = ({ statementId, companyId, onUploadSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (!statementId) {
            setError('Statement ID is required for document upload');
            return;
        }

        // Validate file type (PDF, Excel, Word, etc.)
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload a PDF, Excel, Word, or CSV document.');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setError('File size exceeds the maximum limit of 10MB.');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            setUploadProgress(0);

            // Create FormData object according to API documentation
            const formData = new FormData();
            formData.append('file', file);
            formData.append('statementId', statementId);

            // Include companyId if provided
            if (companyId) {
                formData.append('companyId', companyId);
            }

            console.log('Uploading document with statementId:', statementId);

            // Upload document with progress tracking
            const response = await uploadDocument(formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            console.log('Upload response:', response);

            // Reset after successful upload
            setFile(null);
            setUploadProgress(0);

            // Notify parent component
            if (onUploadSuccess) {
                onUploadSuccess(response.data?.data);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'An error occurred during upload');
        } finally {
            setUploading(false);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card title="Upload Document" subtitle="Upload a document for this financial statement">
            {error && (
                <Alert
                    variant="danger"
                    title="Upload Error"
                    dismissible
                    onDismiss={() => setError(null)}
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            <div className="space-y-4">
                {/* Drag and drop area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        file ? 'border-primary-300 bg-primary-50' : 'border-secondary-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {!file ? (
                        <div>
                            <FiUpload className="mx-auto h-12 w-12 text-secondary-400" />
                            <p className="mt-2 text-sm text-secondary-700">
                                Drag and drop your file here, or{' '}
                                <button
                                    type="button"
                                    className="text-primary-600 hover:text-primary-500 font-medium"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    browse
                                </button>{' '}
                                to select a file
                            </p>
                            <p className="mt-1 text-xs text-secondary-500">
                                PDF, Word, Excel, or CSV files up to 10MB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-center">
                                <FiFile className="h-10 w-10 text-primary-500 mr-2" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-secondary-900">{file.name}</p>
                                    <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-3 text-sm text-danger-600 hover:text-danger-500 font-medium"
                                onClick={() => setFile(null)}
                            >
                                Remove file
                            </button>
                        </div>
                    )}
                </div>

                {/* Upload progress */}
                {uploading && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-secondary-500 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{width: `${uploadProgress}%`}}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={uploading}
                        >
                            <FiX className="mr-2 h-4 w-4"/>
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        isLoading={uploading}
                    >
                        <FiPaperclip className="mr-2 h-4 w-4"/>
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Help text */}
            <div className="mt-4 text-xs text-secondary-500">
                <p>
                    <strong>Note:</strong> Uploaded documents will be associated with the financial statement.
                    Supported file formats: PDF, Word, Excel, and CSV documents up to 10MB.
                </p>
            </div>
        </Card>
    );
};

export default DocumentUploader;