import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { getRiskAssessments } from '../../api/risk';
import { getCompanies } from '../../api/companies';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiEye, FiBarChart2, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const RiskAssessmentsList = () => {
    const { user } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const urlCompanyId = searchParams.get('companyId');

    // State for filters and pagination
    const [filters, setFilters] = useState({
        companyId: urlCompanyId || '',
        riskLevel: '',
    });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    // Fetch risk assessments with filters
    const { data: assessmentsData, isLoading: assessmentsLoading, error: assessmentsError } = useQuery(
        ['riskAssessments', { ...filters, page, size }],
        () => getRiskAssessments({ ...filters, page, size })
    );

    // Fetch companies for filter dropdown
    const { data: companiesData, isLoading: companiesLoading } = useQuery(
        ['companies', { size: 100 }],
        () => getCompanies({ size: 100 })
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

    // Get assessments data from query result
    const assessments = assessmentsData?.data?.data?.content || [];
    const totalPages = assessmentsData?.data?.data?.totalPages || 0;
    const totalElements = assessmentsData?.data?.data?.totalElements || 0;

    // List of companies for filter dropdown
    const companies = companiesData?.data?.data?.content || [];

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

    if (assessmentsLoading || companiesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (assessmentsError) {
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
                    <p className="mt-1 text-secondary-500">View and analyze fraud risk assessments</p>
                </div>

                <Button to="/statements" variant="primary">
                    <FiBarChart2 className="mr-2 h-4 w-4" />
                    Assess New Statement
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="companyId" className="block text-sm font-medium text-secondary-700 mb-1">
                            Company
                        </label>
                        <select
                            id="companyId"
                            name="companyId"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filters.companyId}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Companies</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="riskLevel" className="block text-sm font-medium text-secondary-700 mb-1">
                            Risk Level
                        </label>
                        <select
                            id="riskLevel"
                            name="riskLevel"
                            className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filters.riskLevel}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Risk Levels</option>
                            <option value="VERY_HIGH">Very High</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/3 md:self-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setFilters({
                                    companyId: '',
                                    riskLevel: '',
                                });
                                setPage(0);
                            }}
                        >
                            Reset Filters