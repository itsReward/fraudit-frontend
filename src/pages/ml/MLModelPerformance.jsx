// src/pages/ml/MLModelPerformance.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiArrowLeft, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Mock API function for fetching performance metrics
const fetchPerformanceMetrics = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock performance data
    return {
        data: {
            data: {
                models: [
                    {
                        id: 1,
                        name: 'Earnings Manipulation Detector',
                        type: 'CLASSIFICATION',
                        algorithm: 'Random Forest',
                        metrics: {
                            accuracy: 0.92,
                            precision: 0.89,
                            recall: 0.94,
                            f1Score: 0.91,
                            auc: 0.95,
                            confusionMatrix: [
                                [212, 18],
                                [12, 158]
                            ]
                        },
                        lastTrained: '2023-11-15T10:30:00Z',
                        evaluationDate: '2023-11-15T11:00:00Z'
                    },
                    {
                        id: 2,
                        name: 'Financial Distress Predictor',
                        type: 'CLASSIFICATION',
                        algorithm: 'XGBoost',
                        metrics: {
                            accuracy: 0.89,
                            precision: 0.86,
                            recall: 0.92,
                            f1Score: 0.89,
                            auc: 0.93,
                            confusionMatrix: [
                                [195, 25],
                                [15, 165]
                            ]
                        },
                        lastTrained: '2023-11-10T14:20:00Z',
                        evaluationDate: '2023-11-10T15:00:00Z'
                    },
                    {
                        id: 3,
                        name: 'Anomaly Detection System',
                        type: 'ANOMALY_DETECTION',
                        algorithm: 'Isolation Forest',
                        metrics: {
                            accuracy: 0.85,
                            precision: 0.88,
                            recall: 0.81,
                            f1Score: 0.84,
                            auc: 0.90,
                            confusionMatrix: [
                                [180, 20],
                                [38, 162]
                            ]
                        },
                        lastTrained: '2023-10-20T09:45:00Z',
                        evaluationDate: '2023-10-20T10:15:00Z'
                    }
                ],
                globalPerformance: {
                    averageAccuracy: 0.887,
                    falsePositiveRate: 0.073,
                    falseNegativeRate: 0.082,
                    averageTrainingTime: 432, // seconds
                    alertPrecision: 0.876,
                    systemReliability: 0.912
                }
            }
        }
    };
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const MLModelPerformance = () => {
    const navigate = useNavigate();
    const [selectedModelId, setSelectedModelId] = useState(null);

    // Fetch performance metrics
    const { data, isLoading, error, refetch } = useQuery(
        ['mlPerformanceMetrics'],
        fetchPerformanceMetrics,
        {
            refetchOnWindowFocus: false
        }
    );

    const models = data?.data?.data?.models || [];
    const globalPerformance = data?.data?.data?.globalPerformance || {};

    // Get selected model data
    const selectedModel = models.find(model => model.id === selectedModelId) || (models.length > 0 ? models[0] : null);

    // Set initial selected model
    useEffect(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0].id);
        }
    }, [models, selectedModelId]);

    // Custom metric formatting
    const formatMetric = (value) => {
        if (typeof value === 'number') {
            return (value * 100).toFixed(1) + '%';
        }
        return value;
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
            <Alert variant="danger" title="Error loading performance metrics">
                An error occurred while fetching model performance data. Please try again later.
                <div className="mt-4">
                    <Button
                        variant="primary"
                        onClick={() => refetch()}
                    >
                        <FiRefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        className="mr-4"
                        onClick={() => navigate('/ml/models')}
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-secondary-900">Model Performance Metrics</h1>
                        <p className="mt-1 text-secondary-500">Evaluate and monitor ML model performance</p>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                    >
                        <FiRefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                    >
                        <FiDownload className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* System Overview */}
            <Card title="System Overview">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">Average Accuracy</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {formatMetric(globalPerformance.averageAccuracy)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">Alert Precision</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {formatMetric(globalPerformance.alertPrecision)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">System Reliability</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {formatMetric(globalPerformance.systemReliability)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">False Positive Rate</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {formatMetric(globalPerformance.falsePositiveRate)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">False Negative Rate</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {formatMetric(globalPerformance.falseNegativeRate)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-secondary-500">Avg. Training Time</h3>
                        <p className="mt-1 text-2xl font-semibold text-secondary-900">
                            {globalPerformance.averageTrainingTime}s
                        </p>
                    </div>
                </div>
            </Card>

            {/* Model Selection Tabs */}
            <div className="border-b border-secondary-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {models.map((model) => (
                        <button
                            key={model.id}
                            onClick={() => setSelectedModelId(model.id)}
                            className={`${
                                selectedModelId === model.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {model.name}
                        </button>
                    ))}
                </nav>
            </div>

            {selectedModel && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Model Details */}
                    <Card title="Model Information" className="md:col-span-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Algorithm</h3>
                                <p className="text-sm text-secondary-900">{selectedModel.algorithm}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Type</h3>
                                <p className="text-sm text-secondary-900">{selectedModel.type}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Last Trained</h3>
                                <p className="text-sm text-secondary-900">{formatDate(selectedModel.lastTrained)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Last Evaluated</h3>
                                <p className="text-sm text-secondary-900">{formatDate(selectedModel.evaluationDate)}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Performance Metrics */}
                    <Card title="Performance Metrics" className="md:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Accuracy</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary-900">
                                    {formatMetric(selectedModel.metrics.accuracy)}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                    Ratio of correctly predicted instances to the total instances
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Precision</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary-900">
                                    {formatMetric(selectedModel.metrics.precision)}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                    Ratio of true positives to all positive predictions
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">Recall</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary-900">
                                    {formatMetric(selectedModel.metrics.recall)}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                    Ratio of true positives to all actual positives
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">F1 Score</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary-900">
                                    {formatMetric(selectedModel.metrics.f1Score)}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                    Harmonic mean of precision and recall
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500">AUC</h3>
                                <p className="mt-1 text-2xl font-semibold text-secondary-900">
                                    {formatMetric(selectedModel.metrics.auc)}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                    Area under the ROC curve
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Confusion Matrix */}
                    <Card title="Confusion Matrix" className="md:col-span-3">
                        <div className="flex flex-col items-center">
                            <div className="my-4">
                                <div className="grid grid-cols-2 gap-px bg-secondary-200">
                                    <div className="bg-white p-4 text-center font-medium">
                    <span className="text-success-600">
                      True Negative: {selectedModel.metrics.confusionMatrix[0][0]}
                    </span>
                                    </div>
                                    <div className="bg-white p-4 text-center font-medium">
                    <span className="text-danger-600">
                      False Positive: {selectedModel.metrics.confusionMatrix[0][1]}
                    </span>
                                    </div>
                                    <div className="bg-white p-4 text-center font-medium">
                    <span className="text-danger-600">
                      False Negative: {selectedModel.metrics.confusionMatrix[1][0]}
                    </span>
                                    </div>
                                    <div className="bg-white p-4 text-center font-medium">
                    <span className="text-success-600">
                      True Positive: {selectedModel.metrics.confusionMatrix[1][1]}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-4">
                                <div>
                                    <h3 className="text-sm font-medium text-secondary-500 text-center">False Positive Rate</h3>
                                    <p className="mt-1 text-xl font-semibold text-center text-danger-600">
                                        {(selectedModel.metrics.confusionMatrix[0][1] /
                                            (selectedModel.metrics.confusionMatrix[0][0] + selectedModel.metrics.confusionMatrix[0][1]) * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-secondary-500 text-center">False Negative Rate</h3>
                                    <p className="mt-1 text-xl font-semibold text-center text-danger-600">
                                        {(selectedModel.metrics.confusionMatrix[1][0] /
                                            (selectedModel.metrics.confusionMatrix[1][0] + selectedModel.metrics.confusionMatrix[1][1]) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-secondary-500 mt-6">
                                <p>
                                    <strong>Interpretation:</strong> This confusion matrix shows the model's prediction performance.
                                    True positives and true negatives indicate correct predictions, while false positives (Type I errors)
                                    and false negatives (Type II errors) indicate incorrect predictions.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MLModelPerformance;