import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getRiskAlerts } from '../../api/risk';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiFilter, FiRefreshCw, FiChevronDown, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

const AlertsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Filter states
    const [filters, setFilters] = useState({
        assessmentId: searchParams.get('assessmentId') || '',
        severity: searchParams.get('severity') || '',
        isResolved: searchParams.get('isResolved') === 'true' ? true :
            searchParams.get('isResolved') === 'false' ? false : '',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch risk alerts
    const {
        data: alertsData,
        isLoading: alertsLoading,
        error: alertsError,
        refetch: refetchAlerts
    } = useQuery(
        ['riskAlerts', filters, page, pageSize],
        () => getRiskAlerts({
            ...filters,
            page,
            size: pageSize
        }),
        {
            keepPreviousData: true
        }
    );

    // Extract data from query results
    const alerts = alertsData?.data?.data?.content || [];
    const totalPages = alertsData?.data?.data?.totalPages || 0;
    const totalElements = alertsData?.data?.data?.totalElements || 0;

    // Severity options
    const severityOptions = [
        { value: '', label: 'All Severities' },
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'VERY_HIGH', label: 'Very High' }
    ];

    // Resolution status options
    const resolutionOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'false', label: 'Unresolved' },
        { value: 'true', label: 'Resolved' }
    ];

    // Update URL query params when filters change
    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        if (filters.assessmentId) {
            newSearchParams.set('assessmentId', filters.assessmentId);
        }

        if (filters.severity) {
            newSearchParams.set('severity', filters.severity);
        }

        if (filters.isResolved !== '') {
            newSearchParams.set('isResolved', filters.isResolved);
        }

        navigate({
            pathname: location.pathname,
            search: newSearchParams.toString()
        }, { replace: true });
    }, [filters, navigate, location.pathname]);

    // Handle filter change
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(0); // Reset to first page when filters change
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            assessmentId: '',
            severity: '',
            isResolved: ''
        });
        setPage(0);
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

        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Loading state
    if (alertsLoading && page === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (alertsError) {
        return (
            <Alert variant="danger" title="Error loading alerts">
                An error occurred while fetching alerts. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Risk Alerts</h1>
                    <p className="mt-1 text-secondary-500">View and manage fraud risk alerts across all assessments.</p>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center"
                    >
                        <FiFilter className="mr-1 h-4 w-4" />
                        Filters
                        <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => refetchAlerts()}
                        className="flex items-center"
                    >
                        <FiRefreshCw className="mr-1 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <Card className="bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="severityFilter" className="block text-sm font-medium text-secondary-700 mb-1">
                                Severity
                            </label>
                            <select
                                id="severityFilter"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.severity}
                                onChange={(e) => handleFilterChange('severity', e.target.value)}
                            >
                                {severityOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-secondary-700 mb-1">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.isResolved === true ? 'true' : filters.isResolved === false ? 'false' : ''}
                                onChange={(e) => handleFilterChange('isResolved', e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
                            >
                                {resolutionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="flex items-center"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Results */}
            {alerts.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-secondary-200">
                        {alerts.map((alert) => (
                            <li key={alert.id} className="px-6 py-4">
                                <div className="flex items-start">
                                    <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                                        alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                            ? 'bg-danger-500'
                                            : alert.severity === 'MEDIUM'
                                                ? 'bg-warning-500'
                                                : 'bg-success-500'
                                    }`}
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-secondary-900">{alert.message}</h4>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                                        ? 'bg-danger-100 text-danger-800'
                                                        : alert.severity === 'MEDIUM'
                                                            ? 'bg-warning-100 text-warning-800'
                                                            : 'bg-success-100 text-success-800'
                                                }`}>
                                                    {alert.severity}
                                                </span>
                                                {alert.isResolved && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                                        <FiCheck className="mr-1 h-3 w-3" />
                                                        Resolved
                                                    </span>
                                                )}
                                                {!alert.isResolved && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                                                        <FiX className="mr-1 h-3 w-3" />
                                                        Unresolved
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-secondary-500">
                                                    <Link
                                                        to={`/companies/${alert.companyId}`}
                                                        className="text-primary-600 hover:text-primary-500"
                                                    >
                                                        {alert.companyName}
                                                    </Link>
                                                    <span className="mx-1">•</span>
                                                    <span>{alert.alertType}</span>
                                                </p>
                                                <p className="mt-1 text-xs text-secondary-500">Created: {formatDate(alert.createdAt)}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    to={`/risk/assessments/${alert.assessmentId}`}
                                                >
                                                    View Assessment
                                                </Button>
                                                {!alert.isResolved && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        to={`/risk/alerts/${alert.id}/resolve`}
                                                    >
                                                        Resolve
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {alert.isResolved && (
                                            <div className="mt-2 p-2 bg-secondary-50 rounded-md">
                                                <div className="flex items-center">
                                                    <span className="text-xs text-secondary-500">
                                                        Resolved on {formatDate(alert.resolvedAt)} by {alert.resolvedByUsername || 'Unknown'}
                                                    </span>
                                                </div>
                                                {alert.resolutionNotes && (
                                                    <p className="mt-1 text-sm text-secondary-700">
                                                        {alert.resolutionNotes}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                    <div className="py-6">
                        <FiAlertTriangle className="mx-auto h-12 w-12 text-secondary-400" />
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No alerts found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {Object.values(filters).some(f => f !== '')
                                ? 'Try changing your filter criteria.'
                                : 'No risk alerts have been generated for any assessments.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-secondary-700">
                                Showing <span className="font-medium">{page * pageSize + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min((page + 1) * pageSize, totalElements)}
                                </span>{' '}
                                of <span className="font-medium">{totalElements}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium ${
                                        page === 0
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-500 hover:bg-secondary-50'
                                    }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Page numbers */}
                                {[...Array(totalPages).keys()].map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            pageNumber === page
                                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                        }`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium ${
                                        page >= totalPages - 1
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-500 hover:bg-secondary-50'
                                    }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertsList;