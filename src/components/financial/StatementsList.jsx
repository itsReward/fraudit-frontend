import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStatements } from '../../api/financial';
import DataTable from '../common/DataTable';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import { FiPlus, FiEye, FiBarChart2, FiFileText } from 'react-icons/fi';

const StatementsList = ({ companyId = null, limit = null, showActions = true, className = '' }) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch statements
    const { data, isLoading, error } = useQuery(
        ['statements', { companyId, page, pageSize, limit }],
        () => getStatements({
            companyId,
            page,
            size: pageSize,
            ...(limit ? { limit } : {})
        })
    );

    const statements = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Table columns
    const columns = React.useMemo(() => [
        {
            Header: 'Company',
            accessor: 'companyName',
            Cell: ({ value, row }) => (
                <div className="font-medium text-secondary-900">
                    <Link to={`/companies/${row.original.companyId}`} className="hover:text-primary-600">
                        {value}
                    </Link>
                </div>
            )
        },
        {
            Header: 'Year',
            accessor: 'year',
        },
        {
            Header: 'Type',
            accessor: 'statementType',
        },
        {
            Header: 'Upload Date',
            accessor: 'uploadDate',
            Cell: ({ value }) => formatDate(value)
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    value === 'ANALYZED'
                        ? 'bg-success-100 text-success-800'
                        : value === 'PROCESSED'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-secondary-100 text-secondary-800'
                }`}>
                    {value}
                </span>
            )
        },
        ...(showActions ? [
            {
                Header: 'Actions',
                id: 'actions',
                Cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/statements/${row.original.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View details"
                        >
                            <FiEye className="h-5 w-5" />
                        </Link>

                        <Link
                            to={`/risk/assessments/statement/${row.original.id}`}
                            className="text-secondary-600 hover:text-secondary-900"
                            title="View risk assessment"
                        >
                            <FiBarChart2 className="h-5 w-5" />
                        </Link>

                        <Link
                            to={`/documents/statement/${row.original.id}`}
                            className="text-secondary-600 hover:text-secondary-900"
                            title="View documents"
                        >
                            <FiFileText className="h-5 w-5" />
                        </Link>
                    </div>
                )
            }
        ] : [])
    ], [showActions]);

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle empty state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" title="Error loading statements">
                An error occurred while fetching statements.
            </Alert>
        );
    }

    if (statements.length === 0) {
        return (
            <Card className={className}>
                <div className="flex flex-col items-center justify-center py-6">
                    <FiFileText className="h-12 w-12 text-secondary-400 mb-2" />
                    <h3 className="text-sm font-medium text-secondary-900">No statements found</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                        No financial statements have been added yet.
                    </p>
                    {showActions && (
                        <div className="mt-4">
                            <Button to="/statements/new" variant="primary" size="sm">
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Statement
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-secondary-900">Financial Statements</h3>
                {showActions && (
                    <Button to="/statements/new" variant="primary" size="sm">
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Statement
                    </Button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={statements}
                pageCount={totalPages}
                initialState={{
                    pageIndex: page,
                    pageSize
                }}
                onPageChange={handlePageChange}
                onPageSizeChange={setPageSize}
            />

            {showActions && statements.length > 0 && (
                <div className="mt-4 text-right">
                    <Link
                        to="/statements"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                        View all statements
                    </Link>
                </div>
            )}
        </Card>
    );
};

export default StatementsList;