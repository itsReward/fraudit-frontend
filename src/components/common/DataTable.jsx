import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import Button from './Button';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DataTable = ({
                       columns,
                       data,
                       initialState = {},
                       showPagination = true,
                       showSearch = true,
                       searchPlaceholder = 'Search...',
                       className = '',
                       pageSize = 10,
                       ...props
                   }) => {
    // Create table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize: currentPageSize, globalFilter },
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize,
                ...initialState
            },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    // Memoize search input component
    const SearchInput = useMemo(() => {
        return (
            <div className="relative flex-1 max-w-md mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                    type="text"
                    className="pl-10 pr-3 py-2 w-full border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value || undefined)}
                    placeholder={searchPlaceholder}
                />
            </div>
        );
    }, [globalFilter, searchPlaceholder, setGlobalFilter]);

    // Memoize pagination controls
    const PaginationControls = useMemo(() => {
        return (
            <div className="flex items-center justify-between py-3 border-t border-secondary-200">
                <div className="flex flex-1 items-center">
                    <div>
                        <select
                            value={currentPageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value));
                            }}
                            className="mr-2 border border-secondary-300 rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {[10, 20, 30, 40, 50].map(size => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-secondary-700">
                        Page{' '}
                        <span className="font-medium">{pageIndex + 1}</span> of{' '}
                        <span className="font-medium">{pageOptions.length}</span> |{' '}
                        Showing{' '}
                        <span className="font-medium">
                            {pageIndex * currentPageSize + 1}-
                            {Math.min((pageIndex + 1) * currentPageSize, data.length)}
                        </span>{' '}
                        of <span className="font-medium">{data.length}</span> results
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        <FiChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        <FiChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        <FiChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        <FiChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }, [canNextPage, canPreviousPage, currentPageSize, data.length, gotoPage, nextPage, pageCount, pageIndex, pageOptions.length, previousPage, setPageSize]);

    return (
        <div className={`overflow-hidden ${className}`}>
            {showSearch && (
                <div className="mb-4">
                    {SearchInput}
                </div>
            )}
            <div className="overflow-x-auto">
                <table {...getTableProps()} className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.render('Header')}</span>
                                        <span>
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <FiChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <FiChevronUp className="h-4 w-4" />
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-secondary-200">
                    {page.length > 0 ? (
                        page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="hover:bg-secondary-50">
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-secondary-500">
                                No results found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {showPagination && data.length > 0 && PaginationControls}
        </div>
    );
};

export default DataTable;