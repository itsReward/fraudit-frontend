import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCompanies } from '../../api/companies';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit, FiEye, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const CompaniesList = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sector, setSector] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [companies, setCompanies] = useState([]);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalElements: 0
    });

    // Fetch companies with filters
    const { data, isLoading, error, refetch } = useQuery(
        ['companies', { page, size, sector }],
        () => getCompanies({ page, size, sector }),
        {
            onSuccess: (response) => {
                console.log("Raw API response:", response);

                // Extract companies and pagination from the response
                try {
                    // Get the data from the API response
                    const responseData = response.data;

                    // Extract the content (companies) and pagination
                    if (responseData.data && responseData.data.content) {
                        setCompanies(responseData.data.content);
                        setPagination({
                            totalPages: responseData.data.totalPages || 0,
                            totalElements: responseData.data.totalElements || 0
                        });
                        console.log("Successfully extracted companies:", responseData.data.content);
                    } else {
                        console.error("Unexpected API response structure:", responseData);
                        setCompanies([]);
                    }
                } catch (err) {
                    console.error("Error processing API response:", err);
                    setCompanies([]);
                }
            },
            onError: (err) => {
                console.error("API request error:", err);
                setCompanies([]);
            }
        }
    );

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter changes
    const handleSectorChange = (e) => {
        setSector(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Check if user has create/edit permissions
    const canManageCompanies = user && ['ADMIN', 'REGULATOR'].includes(user.role);

    // Filter companies by search term (client-side filtering for demo)
    const filteredCompanies = searchTerm
        ? companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.stockCode.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : companies;

    // Debug rendering
    useEffect(() => {
        console.log("Companies state:", companies);
    }, [companies]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" title="Error loading companies">
                An error occurred while fetching companies. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Companies</h1>
                    <p className="mt-1 text-secondary-500">Manage and view companies in the system</p>
                </div>

                {canManageCompanies && (
                    <Button
                        to="/companies/new"
                        variant="primary"
                    >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Company
                    </Button>
                )}
            </div>

            {/* Search and filter */}
            <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Search by name or stock code"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="sector" className="block text-sm font-medium text-secondary-700 mb-1">
                            Filter by Sector
                        </label>
                        <select
                            id="sector"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={sector}
                            onChange={handleSectorChange}
                        >
                            <option value="">All Sectors</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Energy">Energy</option>
                            <option value="Mining">Mining</option>
                            <option value="Construction">Construction</option>
                            <option value="Telecommunications">Telecommunications</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/3 md:self-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setSector('');
                                setPage(0);
                                refetch();
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Companies Table */}
            <Card>
                {filteredCompanies.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Stock Code
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Sector
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Listing Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                {filteredCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-secondary-900">{company.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {company.stockCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {company.sector || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {company.listingDate ? new Date(company.listingDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    to={`/companies/${company.id}`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="View details"
                                                >
                                                    <FiEye className="h-5 w-5" />
                                                </Link>

                                                {canManageCompanies && (
                                                    <Link
                                                        to={`/companies/${company.id}/edit`}
                                                        className="text-secondary-600 hover:text-secondary-900"
                                                        title="Edit company"
                                                    >
                                                        <FiEdit className="h-5 w-5" />
                                                    </Link>
                                                )}

                                                <Link
                                                    to={`/risk/assessments?companyId=${company.id}`}
                                                    className="text-secondary-600 hover:text-secondary-900"
                                                    title="View risk assessments"
                                                >
                                                    <FiBarChart2 className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= pagination.totalPages - 1}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-secondary-700">
                                            Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                                            <span className="font-medium">
                        {Math.min((page + 1) * size, pagination.totalElements)}
                    </span>{' '}
                                            of <span className="font-medium">{pagination.totalElements}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className={`relative inline-flex items-center px-1 py-1 rounded-l-md border border-secondary-300 bg-white text-xs font-medium ${
                                                    page === 0
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50 cursor-pointer'
                                                }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {/* Smart pagination with limited page numbers */}
                                            {(() => {
                                                // Maximum number of page buttons to show
                                                const maxPageButtons = 5;
                                                const totalPagesArray = [...Array(pagination.totalPages).keys()];

                                                // If we have fewer pages than our maximum, show them all
                                                if (pagination.totalPages <= maxPageButtons) {
                                                    return totalPagesArray.map((pageNumber) => (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium ${
                                                                pageNumber === page
                                                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                                    : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                                            }`}
                                                        >
                                                            {pageNumber + 1}
                                                        </button>
                                                    ));
                                                }

                                                // For many pages, show a smart subset with first, last and current range
                                                let pagesToShow = [];

                                                // Always include first page
                                                pagesToShow.push(0);

                                                // Calculate range around current page
                                                const rangeStart = Math.max(1, Math.min(page - 1, pagination.totalPages - maxPageButtons + 1));
                                                const rangeEnd = Math.min(pagination.totalPages - 2, page + 1);

                                                // Add ellipsis after first page if needed
                                                if (rangeStart > 1) {
                                                    pagesToShow.push('ellipsis1');
                                                }

                                                // Add pages in the middle range
                                                for (let i = rangeStart; i <= rangeEnd; i++) {
                                                    pagesToShow.push(i);
                                                }

                                                // Add ellipsis before last page if needed
                                                if (rangeEnd < pagination.totalPages - 2) {
                                                    pagesToShow.push('ellipsis2');
                                                }

                                                // Always include last page if there's more than one page
                                                if (pagination.totalPages > 1) {
                                                    pagesToShow.push(pagination.totalPages - 1);
                                                }

                                                // Render the page buttons
                                                return pagesToShow.map((pageItem, index) => {
                                                    if (pageItem === 'ellipsis1' || pageItem === 'ellipsis2') {
                                                        return (
                                                            <span
                                                                key={pageItem}
                                                                className="relative inline-flex items-center px-1 py-1 border border-secondary-300 bg-white text-xs font-medium text-secondary-500"
                                                            >
                                        …
                                    </span>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePageChange(pageItem)}
                                                            className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium ${
                                                                pageItem === page
                                                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                                    : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                                                            }`}
                                                        >
                                                            {pageItem + 1}
                                                        </button>
                                                    );
                                                });
                                            })()}

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page >= pagination.totalPages - 1}
                                                className={`relative inline-flex items-center px-1 py-1 rounded-r-md border border-secondary-300 bg-white text-xs font-medium ${
                                                    page >= pagination.totalPages - 1
                                                        ? 'text-secondary-300 cursor-not-allowed'
                                                        : 'text-secondary-500 hover:bg-secondary-50 cursor-pointer'
                                                }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No companies found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {searchTerm || sector
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : 'Get started by adding a new company.'}
                        </p>
                        {canManageCompanies && !searchTerm && !sector && (
                            <div className="mt-6">
                                <Button
                                    variant="primary"
                                    to="/companies/new"
                                >
                                    <FiPlus className="mr-2 h-4 w-4" />
                                    Add Company
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CompaniesList;