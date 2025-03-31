import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStatements } from '../../api/financial';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEye, FiBarChart2, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const StatementsList = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState({
        companyId: '',
        statementType: '',
        status: '',
    });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    // Fetch statements with filters
    const { data, isLoading, error } = useQuery(
        ['statements', { ...filters, page, size }],
        () => getStatements({ ...filters, page, size })
    );

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
        setPage(0); // Reset page when filter changes
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Get statements data from query result
    const statements = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;
    const totalElements = data?.data?.data?.totalElements || 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" title="Error loading financial statements">
                An error occurred while fetching financial statements. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Financial Statements</h1>
                    <p className="mt-1 text-secondary-500">Manage and analyze financial statements</p>
                </div>

                <Button to="/statements/new" variant="primary">
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add Statement
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="statementType" className="block text-sm font-medium text-secondary-700 mb-1">
                            Statement Type
                        </label>
                        <select
                            id="statementType"
                            name="statementType"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filters.statementType}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Types</option>
                            <option value="ANNUAL">Annual</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="INTERIM">Interim</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSED">Processed</option>
                            <option value="ANALYZED">Analyzed</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/3 md:self-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setFilters({
                                    companyId: '',
                                    statementType: '',
                                    status: '',
                                });
                                setPage(0);
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Statements List */}
            <Card>
                {statements.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Upload Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                {statements.map((statement) => (
                                    <tr key={statement.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-secondary-900">{statement.companyName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {statement.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {statement.statementType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {formatDate(statement.uploadDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                statement.status === 'ANALYZED'
                                                    ? 'bg-success-100 text-success-800'
                                                    : statement.status === 'PROCESSED'
                                                        ? 'bg-primary-100 text-primary-800'
                                                        : 'bg-secondary-100 text-secondary-800'
                                            }`}>
                                                {statement.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    to={`/statements/${statement.id}`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="View details"
                                                >
                                                    <FiEye className="h-5 w-5" />
                                                </Link>

                                                <Link
                                                    to={`/risk/assessments/statement/${statement.id}`}
                                                    className="text-secondary-600 hover:text-secondary-900"
                                                    title="View risk assessment"
                                                >
                                                    <FiBarChart2 className="h-5 w-5" />
                                                </Link>

                                                <Link
                                                    to={`/documents/statement/${statement.id}`}
                                                    className="text-secondary-600 hover:text-secondary-900"
                                                    title="View documents"
                                                >
                                                    <FiFileText className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= totalPages - 1}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-secondary-700">
                                            Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min((page + 1) * size, totalElements)}
                                            </span>{' '}
                                            of <span className="font-medium">{totalElements}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium ${
                                                    page === 0
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50 cursor-pointer'
                                                }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {[...Array(totalPages).keys()].map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        pageNum === page
                                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                            : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                                    }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page >= totalPages - 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium ${
                                                    page >= totalPages - 1
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50 cursor-pointer'
                                                }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No financial statements found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {Object.values(filters).some(Boolean)
                                ? "'Try adjusting your filters to find what you're looking for.'"
                                : 'Get started by adding a new financial statement.'}
                        </p>
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                to="/statements/new"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Statement
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StatementsList;