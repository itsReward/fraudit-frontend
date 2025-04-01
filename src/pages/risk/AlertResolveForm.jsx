import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRiskAlertById, resolveRiskAlert } from '../../api/risk';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';

const AlertResolveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [error, setError] = useState(null);

    // Fetch alert details
    const {
        data: alertData,
        isLoading: alertLoading,
        error: alertError
    } = useQuery(
        ['riskAlert', id],
        () => getRiskAlertById(id)
    );

    // Mutation for resolving alert
    const resolveAlertMutation = useMutation(
        ({ id, resolutionNotes }) => resolveRiskAlert(id, resolutionNotes),
        {
            onSuccess: () => {
                // Invalidate and refetch related queries
                queryClient.invalidateQueries(['riskAlert', id]);
                queryClient.invalidateQueries(['riskAlerts']);

                // Navigate back to alerts list
                navigate('/risk/alerts');
            },
            onError: (error) => {
                setError(error.response?.data?.message || 'An error occurred while resolving the alert.');
            }
        }
    );

    // Extract data from query results
    const alert = alertData?.data?.data;

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!resolutionNotes.trim()) {
            setError('Resolution notes are required.');
            return;
        }

        // Call mutation to resolve alert
        resolveAlertMutation.mutate({ id, resolutionNotes });
    };

    // Function to get severity badge color
    const getSeverityColor = (severity) => {
        switch (severity?.toUpperCase()) {
            case 'VERY_HIGH':
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'secondary';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Loading state
    if (alertLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (alertError) {
        return (
            <Alert variant="danger" title="Error loading alert">
                An error occurred while fetching the alert details. Please try again later.
                <div className="mt-4">
                    <Button variant="outline" to="/risk/alerts" className="flex items-center">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Alerts
                    </Button>
                </div>
            </Alert>
        );
    }

    // Not found state
    if (!alert) {
        return (
            <Alert variant="warning" title="Alert not found">
                The requested alert could not be found.
                <div className="mt-4">
                    <Button variant="outline" to="/risk/alerts" className="flex items-center">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Alerts
                    </Button>
                </div>
            </Alert>
        );
    }

    // Alert already resolved state
    if (alert.isResolved) {
        return (
            <div className="space-y-6">
                <div className="flex items-center">
                    <Link to="/risk/alerts" className="mr-4 text-secondary-500 hover:text-secondary-700">
                        <FiArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold text-secondary-900">Resolve Alert</h1>
                </div>

                <Alert variant="info" title="Alert already resolved">
                    This alert has already been resolved by {alert.resolvedByUsername || 'another user'} on {formatDate(alert.resolvedAt)}.
                    <div className="mt-4">
                        <Button variant="outline" to="/risk/alerts" className="flex items-center">
                            <FiArrowLeft className="mr-2 h-4 w-4" />
                            Back to Alerts
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link to="/risk/alerts" className="mr-4 text-secondary-500 hover:text-secondary-700">
                    <FiArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-semibold text-secondary-900">Resolve Alert</h1>
            </div>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    dismissible
                    onDismiss={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Card className="bg-white">
                <div className="p-4 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-secondary-900">{alert.message}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getSeverityColor(alert.severity)}-100 text-${getSeverityColor(alert.severity)}-800`}>
                            {alert.severity}
                        </span>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm text-secondary-500">
                            <span className="font-medium">{alert.companyName}</span>
                            <span className="mx-1">•</span>
                            <span>{alert.alertType}</span>
                        </p>
                        <p className="mt-1 text-xs text-secondary-500">Created: {formatDate(alert.createdAt)}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="resolutionNotes" className="block text-sm font-medium text-secondary-700">
                                Resolution Notes <span className="text-danger-500">*</span>
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="resolutionNotes"
                                    name="resolutionNotes"
                                    rows={4}
                                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 rounded-md"
                                    placeholder="Describe how this alert was resolved..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="mt-2 text-sm text-secondary-500">
                                Please provide details on how this alert was addressed and any findings.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/risk/alerts')}
                                disabled={resolveAlertMutation.isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex items-center"
                                isLoading={resolveAlertMutation.isLoading}
                                disabled={resolveAlertMutation.isLoading || !resolutionNotes.trim()}
                            >
                                {!resolveAlertMutation.isLoading && <FiCheck className="mr-1 h-4 w-4" />}
                                Resolve Alert
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AlertResolveForm;