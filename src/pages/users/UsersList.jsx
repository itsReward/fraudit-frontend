import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit, FiUser, FiSearch, FiFilter } from 'react-icons/fi';

const UsersList = () => {
    const { user: currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Check if user has permission to access this page
    const hasPermission = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'REGULATOR');

    if (!hasPermission) {
        return (
            <Alert variant="danger" title="Access Denied">
                You do not have permission to access this page.
            </Alert>
        );
    }

    // Fetch users with filters
    const { data, isLoading, error, refetch } = useQuery(
        ['users', { page, pageSize, role: roleFilter }],
        () => getUsers({ page, size: pageSize, role: roleFilter })
    );

    const users = data?.data?.data?.content || [];
    const totalPages = data?.data?.data?.totalPages || 0;
    const totalElements = data?.data?.data?.totalElements || 0;

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle role filter change
    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Filter users by search term (client-side filtering for simplicity)
    const filteredUsers = searchTerm
        ? users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : users;

    // Role options for filter
    const roleOptions = [
        { value: '', label: 'All Roles' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'REGULATOR', label: 'Regulator' },
        { value: 'AUDITOR', label: 'Auditor' },
        { value: 'ANALYST', label: 'Analyst' },
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
            <Alert variant="danger" title="Error loading users">
                An error occurred while fetching users. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Users</h1>
                    <p className="mt-1 text-secondary-500">Manage system users and their permissions</p>
                </div>

                <Button
                    to="/users/new"
                    variant="primary"
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add User
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
                                placeholder="Search by name, username, or email"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="roleFilter" className="block text-sm font-medium text-secondary-700 mb-1">
                            Filter by Role
                        </label>
                        <select
                            id="roleFilter"
                            className="block w-full sm:text-sm border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                        >
                            {roleOptions.map((option) => (
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
                                setRoleFilter('');
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

            {/* Users List */}
            <Card>
                {filteredUsers.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Role
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
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                                    <FiUser className="h-6 w-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-secondary-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                                    {user.role}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.active
                                                        ? 'bg-success-100 text-success-800'
                                                        : 'bg-danger-100 text-danger-800'
                                                }`}>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                            >
                                                <FiEdit className="h-5 w-5" />
                                            </Link>
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
                        <FiUser className="mx-auto h-12 w-12 text-secondary-400" />
                        <h3 className="mt-2 text-sm font-medium text-secondary-900">No users found</h3>
                        <p className="mt-1 text-sm text-secondary-500">
                            {searchTerm || roleFilter
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by adding a new user.'}
                        </p>
                        <div className="mt-6">
                            <Button
                                to="/users/new"
                                variant="primary"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default UsersList;