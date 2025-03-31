import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getRiskAssessments } from '../../api/risk';
import { getCompanies } from '../../api/companies';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiSearch, FiFilter, FiRefreshCw, FiBarChart2, FiFileText, FiChevronDown } from 'react-icons/fi';

const RiskAssessmentsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Filter states
    const [filters, setFilters] = useState({
        companyId: searchParams.get('companyId') || '',
        riskLevel: searchParams.get('riskLevel') || '',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('overallRiskScore');
    const [sortDirection, setSortDirection] = useState('desc');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch risk assessments
    const {
        data: riskAssessmentsData,
        isLoading: riskAssessmentsLoading,
        error: riskAssessmentsError,
        refetch: refetchRiskAssessments
    } = useQuery(
        ['riskAssessments', filters, page, pageSize],
        () => getRiskAssessments({
            ...filters,
            page,
            size: pageSize
        }),
        {
            keepPreviousData: true
        }
    );

    // Fetch companies for filter dropdown
    const {
        data: companiesData,
        isLoading: companiesLoading,
        error: companiesError
    } = useQuery(
        ['companies'],
        () => getCompanies(),
        {
            staleTime: 600000 // 10 minutes
        }
    );

    // Extract data from query results
    const riskAssessments = riskAssessmentsData?.data?.data?.content || [];
    const totalPages = riskAssessmentsData?.data?.data?.totalPages || 0;
    const totalElements = riskAssessmentsData?.data?.data?.totalElements || 0;
    const companies = companiesData?.data?.data?.content || [];

    // Risk level options
    const riskLevelOptions = [
        { value: '', label: 'All Risk Levels' },
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'VERY_HIGH', label: 'Very High' }
    ];

    // Update URL query params when filters change
    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        if (filters.companyId) {
            newSearchParams.set('companyId', filters.companyId);
        }

        if (filters.riskLevel) {
            newSearchParams.set('riskLevel', filters.riskLevel);
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

    // Handle sorting
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle direction if same field
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to descending for risk score, ascending for others
            setSortBy(field);
            setSortDirection(field === 'overallRiskScore' ? 'desc' : 'asc');
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            companyId: '',
            riskLevel: ''
        });
        setPage(0);
    };

    // Get sorted assessments
    const getSortedAssessments = () => {
        return [...riskAssessments].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle different data types
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            // Handle null/undefined values
            if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

            // Regular comparison
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Function to get risk level badge color
    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel?.toUpperCase()) {
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
    if (riskAssessmentsLoading && page === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (riskAssessmentsError) {
        return (
            <Alert variant="danger" title="Error loading risk assessments">
                An error occurred while fetching risk assessments. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Risk Assessments</h1>
                    <p className="mt-1 text-secondary-500">View and manage fraud risk assessments for financial statements.</p>
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
                        onClick={() => refetchRiskAssessments()}
                        className="flex items-center"
                    >
                        <FiRefreshCw className="mr-1 h-4 w-4" />
                        Refresh
                    </Button>

                    <Button
                        to="/risk/assessments/new"
                        className="flex items-center"
                    >
                        <FiBarChart2 className="mr-1 h-4 w-4" />
                        New Assessment
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <Card className="bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="companyFilter" className="block text-sm font-medium text-secondary-700 mb-1">
                                Company
                            </label>
                            <select
                                id="companyFilter"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.companyId}
                                onChange={(e) => handleFilterChange('companyId', e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {!companiesLoading && !companiesError && companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="riskLevelFilter" className="block text-sm font-medium text-secondary-700 mb-1">
                                Risk Level
                            </label>
                            <select
                                id="riskLevelFilter"
                                className="w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.riskLevel}
                                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                            >
                                {riskLevelOptions.map((option) => (
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
            {getSortedAssessments().length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('companyName')}
                            >
                                <div className="flex items-center">
                                    Company
                                    {sortBy === 'companyName' && (
                                        <span className="ml-1">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('year')}
                            >
                                <div className="flex items-center">
                                    Year
                                    {sortBy === 'year' && (
                                        <span className="ml-1">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('overallRiskScore')}
                            >
                                <div className="flex items-center">
                                    Risk Score
                                    {sortBy === 'overallRiskScore' && (
                                        <span className="ml-1">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('riskLevel')}
                            >
                                <div className="flex items-center">
                                    Risk Level
                                    {sortBy === 'riskLevel' && (
                                        <span className="ml-1">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('assessedAt')}
                            >
                                <div className="flex items-center">
                                    Assessed Date
                                    {sortBy === 'assessedAt' && (
                                        <span className="ml-1">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                            >
                                Alerts
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                        {getSortedAssessments().map((assessment) => (
                            <tr key={assessment.id} className="hover:bg-secondary-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-secondary-900">
                                        <Link
                                            to={`/companies/${assessment.companyId}`}
                                            className="hover:text-primary-600"
                                        >
                                            {assessment.companyName}
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                    {assessment.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-secondary-900">
                                        {assessment.overallRiskScore?.toFixed(1) || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRiskLevelColor(assessment.riskLevel)}-100 text-${getRiskLevelColor(assessment.riskLevel)}-800`}>
                                            {assessment.riskLevel || 'Unknown'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                    {formatDate(assessment.assessedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assessment.alertCount > 0 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                                                {assessment.alertCount} alerts
                                            </span>
                                    ) : (
                                        <span className="text-sm text-secondary-500">No alerts</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/risk/assessments/${assessment.id}`}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                    <div className="py-6">
                        <FiBarChart2 className="mx-auto h-12 w-12 text-secondary-400" />
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No risk assessments found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {Object.values(filters).some(f => f)
                                ? 'Try changing your filter criteria.'
                                : 'Get started by performing a risk assessment on a financial statement.'}
                        </p>
                        <div className="mt-6">
                            <Button
                                to="/risk/assessments/new"
                                className="inline-flex items-center"
                            >
                                <FiBarChart2 className="mr-1 h-4 w-4" />
                                New Assessment
                            </Button>
                        </div>
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

export default RiskAssessmentsList;