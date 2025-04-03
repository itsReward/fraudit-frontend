// src/pages/ml/MLModelsList.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { FiPlus, FiEdit, FiTrash2, FiPlay, FiPause, FiDownload, FiUpload, FiBarChart2 } from 'react-icons/fi';

// Mock API functions - replace with actual API calls when implemented
const mockModels = [
    {
        id: 1,
        name: 'Earnings Manipulation Detector',
        type: 'CLASSIFICATION',
        algorithm: 'Random Forest',
        accuracy: 0.92,
        status: 'ACTIVE',
        lastTrained: '2023-11-15T10:30:00Z',
        description: 'Detects potential earnings manipulation based on financial ratios and statement patterns.',
        createdAt: '2023-10-01T08:15:00Z',
        updatedAt: '2023-11-15T10:30:00Z',
        features: [
            'Days Sales in Receivables Index',
            'Gross Margin Index',
            'Asset Quality Index',
            'Sales Growth Index',
            'Total Accruals to Total Assets'
        ],
        author: 'Admin User'
    },
    {
        id: 2,
        name: 'Financial Distress Predictor',
        type: 'CLASSIFICATION',
        algorithm: 'XGBoost',
        accuracy: 0.89,
        status: 'ACTIVE',
        lastTrained: '2023-11-10T14:20:00Z',
        description: 'Predicts potential financial distress based on various financial indicators.',
        createdAt: '2023-09-15T11:30:00Z',
        updatedAt: '2023-11-10T14:20:00Z',
        features: [
            'Current Ratio',
            'Debt to Equity Ratio',
            'Return on Assets',
            'Interest Coverage Ratio',
            'Operating Cash Flow'
        ],
        author: 'Analyst User'
    },
    {
        id: 3,
        name: 'Anomaly Detection System',
        type: 'ANOMALY_DETECTION',
        algorithm: 'Isolation Forest',
        accuracy: 0.85,
        status: 'INACTIVE',
        lastTrained: '2023-10-20T09:45:00Z',
        description: 'Identifies anomalies in financial statements and transaction patterns.',
        createdAt: '2023-08-20T13:40:00Z',
        updatedAt: '2023-10-20T09:45:00Z',
        features: [
            'Transaction Amount',
            'Transaction Frequency',
            'Account Activity Patterns',
            'Time of Day',
            'Historical Transaction Comparison'
        ],
        author: 'Admin User'
    }
];

// Mock fetch function
const fetchModels = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { data: mockModels } };
};

// Activate/Deactivate model
const toggleModelStatus = async (id, status) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
};

// Delete model
const deleteModel = async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
};

const MLModelsList = () => {
    const queryClient = useQueryClient();
    const [selectedModel, setSelectedModel] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModelDetails, setShowModelDetails] = useState(false);

    // Fetch models
    const { data, isLoading, error } = useQuery(['mlModels'], fetchModels);
    const models = data?.data?.data || [];

    // Status toggle mutation
    const toggleStatusMutation = useMutation(
        (modelData) => toggleModelStatus(modelData.id, modelData.status),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['mlModels']);
            }
        }
    );

    // Delete mutation
    const deleteMutation = useMutation(
        (id) => deleteModel(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['mlModels']);
                setShowDeleteModal(false);
            }
        }
    );

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle model activation/deactivation
    const handleStatusToggle = (model) => {
        const newStatus = model.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toggleStatusMutation.mutate({ id: model.id, status: newStatus });
    };

    // Handle model deletion
    const handleDeleteClick = (model) => {
        setSelectedModel(model);
        setShowDeleteModal(true);
    };

    // Handle model details click
    const handleModelDetailsClick = (model) => {
        setSelectedModel(model);
        setShowModelDetails(true);
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
            <Alert variant="danger" title="Error loading models">
                An error occurred while fetching machine learning models. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Machine Learning Models</h1>
                    <p className="mt-1 text-secondary-500">Manage and monitor fraud detection ML models</p>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        to="/ml/models/performance"
                    >
                        <FiBarChart2 className="mr-2 h-4 w-4" />
                        Performance Metrics
                    </Button>
                    <Button
                        variant="primary"
                        to="/ml/models/new"
                    >
                        <FiPlus className="mr-2 h-4 w-4" />
                        New Model
                    </Button>
                </div>
            </div>

            {/* Models List */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Model Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Algorithm
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Accuracy
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Last Trained
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                        {models.map((model) => (
                            <tr key={model.id} className="hover:bg-secondary-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-secondary-900 cursor-pointer" onClick={() => handleModelDetailsClick(model)}>
                                        {model.name}
                                    </div>
                                    <div className="text-xs text-secondary-500">
                                        {model.description.length > 60
                                            ? `${model.description.substring(0, 60)}...`
                                            : model.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                      {model.type === 'CLASSIFICATION' ? 'Classification' :
                          model.type === 'REGRESSION' ? 'Regression' :
                              model.type === 'ANOMALY_DETECTION' ? 'Anomaly Detection' : model.type}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                    {model.algorithm}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                    {(model.accuracy * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        model.status === 'ACTIVE'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {model.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                    {formatDate(model.lastTrained)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                        onClick={() => handleStatusToggle(model)}
                                    >
                                        {model.status === 'ACTIVE' ?
                                            <FiPause className="h-4 w-4 text-warning-500" /> :
                                            <FiPlay className="h-4 w-4 text-success-500" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                        to={`/ml/models/${model.id}/edit`}
                                    >
                                        <FiEdit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteClick(model)}
                                    >
                                        <FiTrash2 className="h-4 w-4 text-danger-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Model Details Modal */}
            {selectedModel && (
                <Modal
                    isOpen={showModelDetails}
                    onClose={() => setShowModelDetails(false)}
                    title={`Model Details: ${selectedModel.name}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-secondary-700">Description</h3>
                            <p className="mt-1 text-sm text-secondary-900">{selectedModel.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-700">Algorithm Details</h3>
                                <div className="mt-2 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Type:</span>
                                        <span className="text-sm font-medium">{selectedModel.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Algorithm:</span>
                                        <span className="text-sm font-medium">{selectedModel.algorithm}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Accuracy:</span>
                                        <span className="text-sm font-medium">{(selectedModel.accuracy * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Status:</span>
                                        <span className={`text-sm font-medium ${
                                            selectedModel.status === 'ACTIVE' ? 'text-success-600' : 'text-secondary-600'
                                        }`}>{selectedModel.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-secondary-700">Timeline</h3>
                                <div className="mt-2 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Created:</span>
                                        <span className="text-sm font-medium">{formatDate(selectedModel.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Last Updated:</span>
                                        <span className="text-sm font-medium">{formatDate(selectedModel.updatedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Last Trained:</span>
                                        <span className="text-sm font-medium">{formatDate(selectedModel.lastTrained)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-secondary-500">Author:</span>
                                        <span className="text-sm font-medium">{selectedModel.author}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-secondary-700">Features</h3>
                            <ul className="mt-2 space-y-1">
                                {selectedModel.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-secondary-600">• {feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
                            <Button
                                variant="outline"
                                onClick={() => setShowModelDetails(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="outline"
                                className="mr-2"
                            >
                                <FiDownload className="mr-2 h-4 w-4" />
                                Export Model
                            </Button>
                            <Button
                                variant="primary"
                                to={`/ml/models/${selectedModel.id}/edit`}
                            >
                                <FiEdit className="mr-2 h-4 w-4" />
                                Edit Model
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {selectedModel && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => deleteMutation.mutate(selectedModel.id)}
                    title="Delete Model"
                    confirmText="Delete"
                    confirmVariant="danger"
                    isConfirmLoading={deleteMutation.isLoading}
                >
                    <p className="text-sm text-secondary-500">
                        Are you sure you want to delete the model "{selectedModel.name}"? This action cannot be undone.
                    </p>
                </ConfirmModal>
            )}
        </div>
    );
};

export default MLModelsList;