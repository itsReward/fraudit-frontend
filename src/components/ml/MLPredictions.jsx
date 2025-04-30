// src/components/ml/MLPredictions.jsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { performPrediction, getPredictionsByStatementId } from '../../api/ml';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import { FiBarChart2, FiRefreshCw, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const MLPredictions = ({ statementId }) => {
    const queryClient = useQueryClient();
    const [showDetails, setShowDetails] = useState(false);

    // Fetch predictions for the statement
    const { data, isLoading, error } = useQuery(
        ['mlPredictions', statementId],
        () => getPredictionsByStatementId(statementId),
        {
            enabled: !!statementId,
            onError: (err) => {
                console.error('Error fetching predictions:', err);
            }
        }
    );

    // Run prediction mutation
    const predictionMutation = useMutation(
        () => performPrediction(statementId),
        {
            onSuccess: () => {
                // Refetch predictions after running a new prediction
                queryClient.invalidateQueries(['mlPredictions', statementId]);
            }
        }
    );

    // Extract predictions from response
    const predictions = data?.data?.data || [];

    // Get the most recent prediction
    const latestPrediction = predictions.length > 0 ? predictions[0] : null;

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format probability as percentage
    const formatProbability = (probability) => {
        if (probability === undefined || probability === null) return 'N/A';
        return `${(probability * 100).toFixed(2)}%`;
    };

    // Get risk level based on probability
    const getRiskLevel = (probability) => {
        if (probability === undefined || probability === null) return 'Unknown';

        if (probability >= 0.75) return { level: 'High', color: 'danger' };
        if (probability >= 0.5) return { level: 'Medium', color: 'warning' };
        return { level: 'Low', color: 'success' };
    };

    if (isLoading) {
        return (
            <Card>
                <div className="flex items-center justify-center h-32">
                    <Loading />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Alert
                    variant="warning"
                    title="Error loading ML predictions"
                >
                    Could not load machine learning predictions for this statement.
                </Alert>
            </Card>
        );
    }

    return (
        <Card
            title="Machine Learning Predictions"
            subtitle="Fraud risk predictions from ML models"
        >
            {latestPrediction ? (
                <div className="space-y-4">
                    {/* Latest Prediction Summary */}
                    <div className="bg-secondary-50 p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-4 sm:mb-0">
                                <h3 className="text-lg font-medium text-secondary-900">
                                    Latest Prediction
                                </h3>
                                <p className="text-sm text-secondary-500">
                                    {formatDate(latestPrediction.predictedAt)}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <div className="mr-4">
                                    <p className="text-sm text-secondary-500">Fraud Probability</p>
                                    <p className={`text-xl font-bold text-${getRiskLevel(latestPrediction.probability).color}-600`}>
                                        {formatProbability(latestPrediction.fraudProbability)}
                                    </p>
                                </div>

                                <div className={`px-3 py-1 rounded-full bg-${getRiskLevel(latestPrediction.probability).color}-100 text-${getRiskLevel(latestPrediction.probability).color}-800`}>
                                    {getRiskLevel(latestPrediction.fraudProbability).level} Risk
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-secondary-500">Prediction</p>
                            <div className="flex items-center mt-1">
                                {latestPrediction.predictionExplanation ? (
                                    <>
                                        <div className="bg-danger-100 p-1 rounded-full">
                                            <FiAlertTriangle className="h-5 w-5 text-danger-600" />
                                        </div>
                                        <span className="ml-2 font-medium text-danger-800">
                                            Potential fraud indicators detected
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-success-100 p-1 rounded-full">
                                            <FiCheck className="h-5 w-5 text-success-600" />
                                        </div>
                                        <span className="ml-2 font-medium text-success-800">
                                            No significant fraud indicators detected
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {latestPrediction.modelName && (
                            <div className="mt-3 text-xs text-secondary-500">
                                Model: {latestPrediction.modelName} ({latestPrediction.modelVersion})
                            </div>
                        )}
                    </div>

                    {/* Details Toggle */}
                    <div className="flex justify-between items-center pt-2">
                        <button
                            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => predictionMutation.mutate()}
                            isLoading={predictionMutation.isLoading}
                            disabled={predictionMutation.isLoading}
                        >
                            <FiRefreshCw className="mr-2 h-4 w-4" />
                            Run New Prediction
                        </Button>
                    </div>

                    {/* Prediction Details */}
                    {showDetails && (
                        <div className="mt-4 pt-4 border-t border-secondary-200">
                            <h4 className="text-sm font-medium text-secondary-700 mb-3">Prediction Details</h4>

                            {/* Features used */}
                            {latestPrediction.featureImportance && (
                                <div className="mb-4">
                                    <p className="text-sm text-secondary-500 mb-2">Features Used</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(latestPrediction.features).map(([key, value], index) => (
                                            <div key={index} className="text-xs bg-secondary-50 p-2 rounded">
                                                <span className="font-medium">{key}:</span> {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Model Explanation */}
                            {latestPrediction.predictionExplanation && (
                                <div className="mb-4">
                                    <p className="text-sm text-secondary-500 mb-2">Model Explanation</p>
                                    <div className="text-sm bg-secondary-50 p-3 rounded">
                                        {latestPrediction.explanation}
                                    </div>
                                </div>
                            )}

                            {/* Historical Predictions */}
                            {predictions.length > 1 && (
                                <div>
                                    <p className="text-sm text-secondary-500 mb-2">Previous Predictions</p>
                                    <div className="max-h-48 overflow-y-auto">
                                        <table className="min-w-full divide-y divide-secondary-200">
                                            <thead className="bg-secondary-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                                    Model
                                                </th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                                    Probability
                                                </th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                                    Prediction
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-secondary-200">
                                            {predictions.slice(1).map((prediction, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-secondary-500">
                                                        {formatDate(prediction.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                                                        {prediction.modelName || 'Unknown'}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                                                        {formatProbability(prediction.probability)}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                                                        {prediction.prediction ? (
                                                            <span className="text-danger-600">Potential Fraud</span>
                                                        ) : (
                                                            <span className="text-success-600">No Fraud</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-6 text-center">
                    <FiBarChart2 className="mx-auto h-12 w-12 text-secondary-400" />
                    <h3 className="mt-2 text-sm font-medium text-secondary-700">No ML predictions yet</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                        Run a prediction to analyze this financial statement with machine learning.
                    </p>
                    <div className="mt-4">
                        <Button
                            variant="primary"
                            onClick={() => predictionMutation.mutate()}
                            isLoading={predictionMutation.isLoading}
                            disabled={predictionMutation.isLoading}
                        >
                            <FiBarChart2 className="mr-2 h-4 w-4" />
                            Run ML Prediction
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default MLPredictions;