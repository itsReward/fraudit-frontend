import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getReports, downloadReport } from '../../api/reports';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiPlus, FiDownload, FiFileText, FiFilter, FiSearch } from 'react-icons/fi';

const ReportsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reportType, setReportType] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [downloading, setDownloading] = useState(null);

    // Fetch reports with filters
    const { data, isLoading, error, refetch } = useQuery(
        ['reports', { page, pageSize, reportType }],
        () => getReports({ page, size: pageSize, reportType })
    );

    const reports = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;
    const totalElements = data?.data?.data?.totalElements || 0;

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle report type filter change
    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle report download
    const handleDownload = async (reportId) => {
        try {
            setDownloading(reportId);
            const response = await downloadReport(reportId);

            // Extract filename from content-disposition header
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'report';

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setDownloading(null);
        }
    };

    // Format date
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

    // Filter reports by search term
    const filteredReports = searchTerm
        ? reports.filter(report =>
            report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.companyName && report.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : reports;

    // Report type options
    const reportTypeOptions = [
        { value: '', label: 'All Report Types' },
        { value: 'company-overview', label: 'Company Overview' },
        { value: 'fraud-risk', label: 'Fraud Risk' },
        { value: 'risk-assessment', label: 'Risk Assessment' },
        { value: 'system-activity', label: 'System Activity' },
    ];

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
            <Alert variant="danger" title="Error loading reports">
                An error occurred while fetching reports. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Reports</h1>
                    <p className="mt-1 text-secondary-500">View and download generated reports</p>
                </div>

                <Button
                    to="/reports/generate"
                    variant="primary"
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Generate New Report
                </Button>
            </div>

            {/* Search and filter */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
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
                                placeholder="Search by name, type, or company"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="reportType" className="block text-sm font-medium text-secondary-700 mb-1">
                            Report Type
                        </label>
                        <select
                            id="reportType"
                            className="block w-full sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={reportType}
                            onChange={handleReportTypeChange}
                        >
                            {reportTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/6 md:self-end">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setReportType('');
                                setPage(0);
                                refetch();
                            }}
                            className="w-full"
                        >
                            <FiFilter className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Reports List */}
            <Card>
                {filteredReports.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Report Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Generated
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Format
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiFileText className="flex-shrink-0 h-5 w-5 text-secondary-400" />
                                                <div className="ml-3">
                                                    <div className="font-medium text-secondary-900">{report.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                                    {report.reportType === 'company-overview' ? 'Company Overview' :
                                                        report.reportType === 'fraud-risk' ? 'Fraud Risk' :
                                                            report.reportType === 'risk-assessment' ? 'Risk Assessment' :
                                                                report.reportType === 'system-activity' ? 'System Activity' :
                                                                    report.reportType}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {report.companyName ? (
                                                <Link
                                                    to={`/companies/${report.companyId}`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    {report.companyName}
                                                </Link>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-secondary-500">
                                            {formatDate(report.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-800">
                                                    {report.format || 'PDF'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleDownload(report.id)}
                                                isLoading={downloading === report.id}
                                                disabled={downloading === report.id}
                                            >
                                                <FiDownload className="mr-2 h-4 w-4" />
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
                                <div className="flex-1 flex items-center justify-between">
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

                                            {[...Array(totalPages).keys()].map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
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
                        <FiFileText className="mx-auto h-12 w-12 text-secondary-400" />
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No reports found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {searchTerm || reportType
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by generating a new report.'}
                        </p>
                        <div className="mt-6">
                            <Button
                                to="/reports/generate"
                                variant="primary"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Generate New Report
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReportsList;