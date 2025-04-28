// src/pages/risk/AlertsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRiskAlerts, resolveRiskAlert } from '../../api/risk';
import AlertsList from '../../components/alerts/AlertsList';
import AlertResolveForm from '../../components/alerts/AlertResolveForm';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiAlertTriangle, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

const AlertsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { addNotification } = useNotifications();

    // Get filters from URL params
    const initialFilters = {
        severity: searchParams.get('severity') || '',
        assessmentId: searchParams.get('assessmentId') || '',
        companyId: searchParams.get('companyId') || '',
        isResolved: searchParams.get('isResolved') || '',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0'));
    const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size') || '10'));

    // Alert resolution modal state
    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [selectedAlertId, setSelectedAlertId] = useState(null);

    // Fetch alerts data with filters
    const {
        data: alertsData,
        isLoading,
        error,
        refetch
    } = useQuery(
        ['alerts', { ...filters, page, pageSize }],
        () => getRiskAlerts({ ...filters, page, pageSize }),
        {
            keepPreviousData: true,
            onError: (err) => {
                console.error('Error fetching alerts:', err);
            }
        }
    );

    // Resolve alert mutation
    const resolveMutation = useMutation(
        ({ alertId, resolutionNotes }) => resolveRiskAlert(alertId, resolutionNotes),
        {
            onSuccess: () => {
                // Invalidate and refetch alerts data
                queryClient.invalidateQueries(['alerts']);
                // Show success notification
                addNotification({
                    type: 'SUCCESS',
                    title: 'Alert Resolved',
                    message: 'The alert has been successfully resolved',
                });
            },
            onError: (err) => {
                console.error('Error resolving alert:', err);
                // Show error notification
                addNotification({
                    type: 'DANGER',
                    title: 'Failed to Resolve Alert',
                    message: err.message || 'An error occurred while resolving the alert',
                });
            }
        }
    );

    // Update search params when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        // Only add parameters if they have values
        if (filters.severity) params.set('severity', filters.severity);
        if (filters.assessmentId) params.set('assessmentId', filters.assessmentId);
        if (filters.companyId) params.set('companyId', filters.companyId);
        if (filters.isResolved) params.set('isResolved', filters.isResolved);
        if (page > 0) params.set('page', page.toString());
        if (pageSize !== 10) params.set('size', pageSize.toString());

        setSearchParams(params);
    }, [filters, page, pageSize, setSearchParams]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(0); // Reset to first page when filter changes
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            severity: '',
            assessmentId: '',
            companyId: '',
            isResolved: '',
        });
        setSearchTerm('');
        setPage(0);
    };

    // Handle opening resolve modal
    const handleResolveClick = (alertId) => {
        setSelectedAlertId(alertId);
        setResolveModalOpen(true);
    };

    // Handle alert resolution
    const handleResolveAlert = useCallback(async (resolutionNotes) => {
        if (!selectedAlertId) return;

        await resolveMutation.mutateAsync({
            alertId: selectedAlertId,
            resolutionNotes
        });

        // Close modal and reset selected alert
        setResolveModalOpen(false);
        setSelectedAlertId(null);
    }, [selectedAlertId, resolveMutation]);

    // Find selected alert data for resolve modal
    const selectedAlert = selectedAlertId
        ? alertsData?.data?.data?.content?.find(alert => alert.id === selectedAlertId) || null
        : null;

    // Extract alerts from response
    const alerts = alertsData?.data?.data?.content || [];
    const pagination = alertsData?.data?.data;

    // Filter alerts by search term (client-side)
    const filteredAlerts = searchTerm
        ? alerts.filter(alert =>
            alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
        : alerts;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Risk Alerts</h1>
                    <p className="mt-1 text-secondary-500">
                        View and manage fraud risk alerts generated by the system
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
                                Search
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-secondary-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    className="block w-full pl-10 sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Search alerts"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/4">
                            <label htmlFor="severity" className="block text-sm font-medium text-secondary-700 mb-1">
                                Severity
                            </label>
                            <select
                                id="severity"
                                name="severity"
                                className="block w-full sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                value={filters.severity}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Severities</option>
                                <option value="VERY_HIGH">Very High</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>

                        <div className="w-full md:w-1/4">
                            <label htmlFor="isResolved" className="block text-sm font-medium text-secondary-700 mb-1">
                                Status
                            </label>
                            <select
                                id="isResolved"
                                name="isResolved"
                                className="block w-full sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                value={filters.isResolved}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Status</option>
                                <option value="false">Open</option>
                                <option value="true">Resolved</option>
                            </select>
                        </div>

                        <div className="w-full md:w-1/6 md:self-end">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-secondary-300 shadow-sm text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                onClick={resetFilters}
                            >
                                <FiX className="mr-2 h-4 w-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Alerts list */}
            {error ? (
                <Alert
                    variant="danger"
                    title="Error loading alerts"
                    icon={<FiAlertTriangle className="h-5 w-5" />}
                >
                    An error occurred while loading alerts. Please try again later.
                </Alert>
            ) : isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loading />
                </div>
            ) : (
                <>
                    <AlertsList
                        alerts={filteredAlerts}
                        isLoading={isLoading}
                        onResolve={handleResolveClick}
                    />

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-secondary-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-card">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className={`relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md ${
                                        page === 0
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-700 hover:bg-secondary-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(pagination.totalPages - 1, page + 1))}
                                    disabled={page >= pagination.totalPages - 1}
                                    className={`relative ml-3 inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md ${
                                        page >= pagination.totalPages - 1
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-700 hover:bg-secondary-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-secondary-700">
                                        Showing <span className="font-medium">{page * pageSize + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min((page + 1) * pageSize, pagination.totalElements)}
                                        </span>{' '}
                                        of <span className="font-medium">{pagination.totalElements}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(0)}
                                            disabled={page === 0}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium ${
                                                page === 0
                                                    ? 'text-secondary-300 cursor-not-allowed'
                                                    : 'text-secondary-500 hover:bg-secondary-50'
                                            }`}
                                        >
                                            <span className="sr-only">First</span>
                                            <span className="h-5 w-5 flex justify-center items-center">«</span>
                                        </button>
                                        <button
                                            onClick={() => setPage(Math.max(0, page - 1))}
                                            disabled={page === 0}
                                            className={`relative inline-flex items-center px-2 py-2 border border-secondary-300 bg-white text-sm font-medium ${
                                                page === 0
                                                    ? 'text-secondary-300 cursor-not-allowed'
                                                    : 'text-secondary-500 hover:bg-secondary-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <span className="h-5 w-5 flex justify-center items-center">‹</span>
                                        </button>

                                        {[...Array(Math.min(5, pagination.totalPages)).keys()]
                                            .map(i => {
                                                // Show pages [page-2, page-1, page, page+1, page+2]
                                                let pageNum = page - 2 + i;

                                                // Adjust if we're near the start or end
                                                if (page < 2) {
                                                    pageNum = i;
                                                } else if (page > pagination.totalPages - 3) {
                                                    pageNum = pagination.totalPages - 5 + i;
                                                }

                                                // Ensure page number is in valid range
                                                if (pageNum < 0 || pageNum >= pagination.totalPages) {
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            pageNum === page
                                                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                                : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                                        }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            })
                                            .filter(Boolean)}

                                        <button
                                            onClick={() => setPage(Math.min(pagination.totalPages - 1, page + 1))}
                                            disabled={page >= pagination.totalPages - 1}
                                            className={`relative inline-flex items-center px-2 py-2 border border-secondary-300 bg-white text-sm font-medium ${
                                                page >= pagination.totalPages - 1
                                                    ? 'text-secondary-300 cursor-not-allowed'
                                                    : 'text-secondary-500 hover:bg-secondary-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <span className="h-5 w-5 flex justify-center items-center">›</span>
                                        </button>
                                        <button
                                            onClick={() => setPage(pagination.totalPages - 1)}
                                            disabled={page >= pagination.totalPages - 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium ${
                                                page >= pagination.totalPages - 1
                                                    ? 'text-secondary-300 cursor-not-allowed'
                                                    : 'text-secondary-500 hover:bg-secondary-50'
                                            }`}
                                        >
                                            <span className="sr-only">Last</span>
                                            <span className="h-5 w-5 flex justify-center items-center">»</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Alert resolve modal */}
            {selectedAlertId && (
                <AlertResolveForm
                    alertId={selectedAlertId}
                    alertData={selectedAlert}
                    isOpen={resolveModalOpen}
                    onClose={() => {
                        setResolveModalOpen(false);
                        setSelectedAlertId(null);
                    }}
                    onSuccess={() => refetch()}
                />
            )}
        </div>
    );
};

export default AlertsPage;