// src/pages/ml/MLModelPerformance.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getModelById, getPredictionsByStatementId } from '../../api/ml';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiArrowLeft, FiFileText, FiDownload, FiBarChart2, FiEdit } from 'react-icons/fi';

const MLModelPerformance = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedStatementId, setSelectedStatementId] = useState(null);

    // Get modelId from query params
    const searchParams = new URLSearchParams(location.search);
    const modelId = searchParams.get('modelId');

    // Fetch model data
    const { data: modelData, isLoading: modelLoading, error: modelError } = useQuery(
        ['mlModel', modelId],
        () => getModelById(modelId),
        {
            enabled: !!modelId,
            onError: (err) => {
                console.error('Error fetching model data:', err);
            }
        }
    );

    // Fetch predictions for a specific statement
    const { data: predictionsData, isLoading: predictionsLoading, error: predictionsError, refetch: refetchPredictions } = useQuery(
        ['mlPredictions', modelId, selectedStatementId],
        () => getPredictionsByStatementId(selectedStatementId),
        {
            enabled: !!selectedStatementId,
            onError: (err) => {
                console.error('Error fetching predictions:', err);
            }
        }
    );

    // Extract model from response
    const model = modelData?.data?.data;

    // Extract predictions from response
    const predictions = predictionsData?.data?.data;

    // Format model type for display
    const formatModelType = (type) => {
        if (!type) return 'Unknown';

        // Convert SNAKE_CASE to Title Case
        return type.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Format percentage
    const formatPercent = (value) => {
        if (value === undefined || value === null) return 'N/A';
        return `${(value * 100).toFixed(2)}%`;
    };

    // Mock data for the confusion matrix
    // In a real app, this would come from the API
    const confusionMatrix = {
        truePositives: 85,
        falsePositives: 15,
        trueNegatives: 90,
        falseNegatives: 10
    };

    // Calculate derived metrics from confusion matrix
    const totalPredictions = confusionMatrix.truePositives + confusionMatrix.falsePositives +
        confusionMatrix.trueNegatives + confusionMatrix.falseNegatives;

    const accuracy = (confusionMatrix.truePositives + confusionMatrix.trueNegatives) / totalPredictions;

    const precision = confusionMatrix.truePositives /
        (confusionMatrix.truePositives + confusionMatrix.falsePositives);

    const recall = confusionMatrix.truePositives /
        (confusionMatrix.truePositives + confusionMatrix.falseNegatives);

    const f1Score = 2 * (precision * recall) / (precision + recall);

    // Mock data for feature importances
    // In a real app, this would come from the API
    const featureImportances = [
        { feature: 'Working Capital to Total Assets', importance: 0.23 },
        { feature: 'Retained Earnings to Total Assets', importance: 0.19 },
        { feature: 'EBIT to Total Assets', importance: 0.17 },
        { feature: 'Market Value of Equity to Book Value of Debt', importance: 0.14 },
        { feature: 'Sales to Total Assets', importance: 0.12 },
        { feature: 'Operating Cash Flow to Total Assets', importance: 0.09 },
        { feature: 'Total Debt to Total Assets', importance: 0.06 }
    ].sort((a, b) => b.importance - a.importance);

    if (modelLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (modelError) {
        return (
            <Alert variant="danger" title="Error loading model data">
                {modelError.response?.data?.message || 'An error occurred while fetching model data. Please try again later.'}
            </Alert>
        );
    }

    if (!model) {
        return (
            <Alert variant="warning" title="Model not found">
                The requested machine learning model could not be found. Please check the model ID and try again.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button
                    className="mr-4 text-secondary-500 hover:text-secondary-700"
                    onClick={() => navigate('/ml/models')}
                >
                    <FiArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">
                        Model Performance: {model.name}
                    </h1>
                    <p className="mt-1 text-secondary-500">
                        Detailed performance metrics and analysis for the model
                    </p>
                </div>
            </div>

            {/* Model Details Card */}
            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-medium text-secondary-900">{model.name}</h2>
                        <div className="mt-1 flex items-center text-sm">
                            <span className="text-secondary-500">Type: {formatModelType(model.modelType)}</span>
                            <span className="mx-2 text-secondary-300">|</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                model.active
                                    ? 'bg-success-100 text-success-800'
                                    : 'bg-secondary-100 text-secondary-800'
                            }`}>
                                {model.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        {model.description && (
                            <p className="mt-2 text-sm text-secondary-700">{model.description}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-secondary-500">Accuracy</p>
                            <p className="text-xl font-bold text-primary-600">{formatPercent(model.accuracy)}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-secondary-500">Precision</p>
                            <p className="text-xl font-bold text-primary-600">{formatPercent(model.precision)}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-xs text-secondary-500">Recall</p>
                            <p className="text-xl font-bold text-primary-600">{formatPercent(model.recall)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Confusion Matrix */}
                <Card title="Confusion Matrix">
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="bg-success-100 border border-success-200 p-4 rounded-lg text-center">
                                <p className="text-xs text-secondary-700">True Positives</p>
                                <p className="text-2xl font-bold text-success-700">{confusionMatrix.truePositives}</p>
                            </div>
                            <div className="bg-danger-100 border border-danger-200 p-4 rounded-lg text-center">
                                <p className="text-xs text-secondary-700">False Positives</p>
                                <p className="text-2xl font-bold text-danger-700">{confusionMatrix.falsePositives}</p>
                            </div>
                            <div className="bg-danger-100 border border-danger-200 p-4 rounded-lg text-center">
                                <p className="text-xs text-secondary-700">False Negatives</p>
                                <p className="text-2xl font-bold text-danger-700">{confusionMatrix.falseNegatives}</p>
                            </div>
                            <div className="bg-success-100 border border-success-200 p-4 rounded-lg text-center">
                                <p className="text-xs text-secondary-700">True Negatives</p>
                                <p className="text-2xl font-bold text-success-700">{confusionMatrix.trueNegatives}</p>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-secondary-500">
                            <p>Total predictions: {totalPredictions}</p>
                        </div>
                    </div>
                </Card>

                {/* Model Metrics */}
                <Card title="Performance Metrics">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Accuracy</p>
                            <div className="flex items-center">
                                <div className="w-full bg-secondary-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${accuracy * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium w-16 text-right">{formatPercent(accuracy)}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Precision</p>
                            <div className="flex items-center">
                                <div className="w-full bg-secondary-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${precision * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium w-16 text-right">{formatPercent(precision)}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-secondary-500 mb-1">Recall</p>
                            <div className="flex items-center">
                                <div className="w-full bg-secondary-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${recall * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium w-16 text-right">{formatPercent(recall)}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-secondary-500 mb-1">F1-Score</p>
                            <div className="flex items-center">
                                <div className="w-full bg-secondary-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${f1Score * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium w-16 text-right">{formatPercent(f1Score)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200">
                        <p className="text-xs text-secondary-500">
                            <strong>Note:</strong> Metrics are based on test data evaluation.
                            Accuracy measures overall correctness, precision measures false positive rate,
                            recall measures false negative rate, and F1-Score is the harmonic mean of precision and recall.
                        </p>
                    </div>
                </Card>

                {/* Feature Importance */}
                <Card title="Feature Importance">
                    <div className="space-y-3">
                        {featureImportances.map((feature, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <p className="text-sm text-secondary-700 truncate" title={feature.feature}>
                                        {feature.feature}
                                    </p>
                                    <p className="text-sm font-medium">{(feature.importance * 100).toFixed(1)}%</p>
                                </div>
                                <div className="w-full bg-secondary-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full"
                                        style={{ width: `${feature.importance * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ROC Curve - Placeholder */}
                <Card title="ROC Curve">
                    <div className="flex items-center justify-center h-64 bg-secondary-50 border border-secondary-200 rounded-lg">
                        <div className="text-center">
                            <FiBarChart2 className="mx-auto h-12 w-12 text-secondary-400" />
                            <p className="mt-2 text-secondary-500">
                                ROC Curve visualization would be displayed here.
                            </p>
                            <p className="text-xs text-secondary-400 mt-1">
                                Area Under Curve (AUC): {formatPercent(0.92)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Model Hyperparameters */}
            <Card title="Model Hyperparameters">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {model.hyperparameters && typeof model.hyperparameters === 'string' ? (
                        (() => {
                            try {
                                // Parse hyperparameters JSON
                                const params = JSON.parse(model.hyperparameters);
                                return Object.entries(params).map(([key, value], index) => (
                                    <div key={index} className="bg-secondary-50 p-3 rounded-lg">
                                        <p className="text-xs text-secondary-500">{key.replace(/_/g, ' ')}</p>
                                        <p className="text-sm font-medium text-secondary-900">{value.toString()}</p>
                                    </div>
                                ));
                            } catch (e) {
                                return (
                                    <div className="col-span-full">
                                        <p className="text-sm text-secondary-500">
                                            Error parsing hyperparameters.
                                        </p>
                                    </div>
                                );
                            }
                        })()
                    ) : model.hyperparameters && typeof model.hyperparameters === 'object' ? (
                        Object.entries(model.hyperparameters).map(([key, value], index) => (
                            <div key={index} className="bg-secondary-50 p-3 rounded-lg">
                                <p className="text-xs text-secondary-500">{key.replace(/_/g, ' ')}</p>
                                <p className="text-sm font-medium text-secondary-900">{value.toString()}</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <p className="text-sm text-secondary-500">
                                No hyperparameters available for this model.
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/ml/models/${modelId}/edit`)}
                >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit Model
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        // In a real app, this would download a PDF report
                        alert('Downloading performance report...');
                    }}
                >
                    <FiDownload className="mr-2 h-4 w-4" />
                    Download Performance Report
                </Button>
            </div>
        </div>
    );
};

export default MLModelPerformance;