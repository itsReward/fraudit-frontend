import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getCompanyById, getCompanyRiskProfile } from '../../api/companies';
import { getStatements } from '../../api/financial';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { FiEdit, FiBarChart2, FiFileText, FiAlertTriangle, FiPieChart, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const CompanyDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch company data
    const { data: companyData, isLoading: companyLoading, error: companyError } = useQuery(
        ['company', id],
        () => getCompanyById(id)
    );

    // Fetch risk profile
    const { data: riskData, isLoading: riskLoading, error: riskError } = useQuery(
        ['companyRisk', id],
        () => getCompanyRiskProfile(id)
    );

    // Fetch financial statements
    const { data: statementsData, isLoading: statementsLoading, error: statementsError } = useQuery(
        ['statements', { companyId: id }],
        () => getStatements({ companyId: id })
    );

    const company = companyData?.data?.data;
    const risk = riskData?.data?.data;
    const statements = statementsData?.data?.data?.content || [];

    // Check if user can edit
    const canEdit = user && ['ADMIN', 'REGULATOR'].includes(user.role);

    // Combine loading states
    const isLoading = companyLoading || riskLoading || statementsLoading;

    // Combine error states
    const hasError = companyError || riskError || statementsError;

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
                return 'primary';
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (hasError) {
        return (
            <Alert variant="danger" title="Error loading company data">
                An error occurred while fetching company data. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">{company.name}</h1>
                    <div className="flex items-center mt-1">
                        <span className="text-secondary-500">Stock Code: {company.stockCode}</span>
                        <span className="mx-2 text-secondary-300">|</span>
                        <span className="text-secondary-500">Sector: {company.sector || 'Not specified'}</span>
                    </div>
                </div>

                {canEdit && (
                    <Button
                        variant="outline"
                        to={`/companies/${id}/edit`}
                    >
                        <FiEdit className="mr-2 h-4 w-4" />
                        Edit Company
                    </Button>
                )}
            </div>

            {/* Risk summary card */}
            {risk && (
                <Card
                    className="bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-secondary-900">Fraud Risk Profile</h3>
                            <p className="text-sm text-secondary-500">Latest risk assessment</p>
                        </div>

                        <div className="flex items-center">
                            <div className="mr-8">
                                <p className="text-sm text-secondary-500">Risk Score</p>
                                <p className="text-2xl font-bold">{risk.riskScore?.toFixed(1) || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-secondary-500">Risk Level</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-${getRiskLevelColor(risk.riskLevel)}-100 text-${getRiskLevelColor(risk.riskLevel)}-800`}>
                  {risk.riskLevel || 'Unknown'}
                </span>
                            </div>

                            <div className="ml-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    to={`/risk/assessments?companyId=${id}`}
                                >
                                    <FiBarChart2 className="mr-2 h-4 w-4" />
                                    View Risk Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Tabs */}
            <div className="border-b border-secondary-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`${
                            activeTab === 'overview'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Overview
                    </button>

                    <button
                        onClick={() => setActiveTab('statements')}
                        className={`${
                            activeTab === 'statements'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Financial Statements
                    </button>

                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`${
                            activeTab === 'reports'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Reports
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            <div>
                {/* Overview tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company info */}
                        <Card title="Company Information">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-500">Stock Code</h4>
                                    <p className="mt-1">{company.stockCode}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-secondary-500">Sector</h4>
                                    <p className="mt-1">{company.sector || 'Not specified'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-secondary-500">Listing Date</h4>
                                    <p className="mt-1">{formatDate(company.listingDate)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-secondary-500">Description</h4>
                                    <p className="mt-1">{company.description || 'No description available.'}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Key metrics */}
                        <Card title="Key Risk Indicators">
                            {risk ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-secondary-50 p-4 rounded-lg">
                                            <p className="text-sm text-secondary-500">Z-Score Risk</p>
                                            <p className="text-lg font-bold">{risk.zScoreRisk?.toFixed(1) || 'N/A'}</p>
                                        </div>

                                        <div className="bg-secondary-50 p-4 rounded-lg">
                                            <p className="text-sm text-secondary-500">M-Score Risk</p>
                                            <p className="text-lg font-bold">{risk.mScoreRisk?.toFixed(1) || 'N/A'}</p>
                                        </div>

                                        <div className="bg-secondary-50 p-4 rounded-lg">
                                            <p className="text-sm text-secondary-500">F-Score Risk</p>
                                            <p className="text-lg font-bold">{risk.fScoreRisk?.toFixed(1) || 'N/A'}</p>
                                        </div>

                                        <div className="bg-secondary-50 p-4 rounded-lg">
                                            <p className="text-sm text-secondary-500">Financial Ratio Risk</p>
                                            <p className="text-lg font-bold">{risk.financialRatioRisk?.toFixed(1) || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <Button
                                            to={`/risk/assessments/company/${id}`}
                                            variant="outline"
                                        >
                                            View Full Risk Assessment
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-secondary-500">
                                    <FiAlertTriangle className="h-10 w-10 mx-auto text-warning-500 mb-2" />
                                    <p>No risk assessment data available.</p>
                                    <div className="mt-4">
                                        <Button
                                            to={`/risk/assess?companyId=${id}`}
                                            variant="primary"
                                        >
                                            Perform Risk Assessment
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Financial Statements tab */}
                {activeTab === 'statements' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-secondary-900">Financial Statements</h2>
                            <Button
                                to={`/statements/new?companyId=${id}`}
                                variant="primary"
                                size="sm"
                            >
                                <FiFileText className="mr-2 h-4 w-4" />
                                Add Statement
                            </Button>
                        </div>

                        {statements.length > 0 ? (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-secondary-200">
                                    <thead className="bg-secondary-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary-900 sm:pl-6">
                                            Year
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900">
                                            Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900">
                                            Upload Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900">
                                            Risk Level
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-200 bg-white">
                                    {statements.map((statement) => (
                                        <tr key={statement.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-secondary-900 sm:pl-6">
                                                {statement.year}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500">
                                                {statement.statementType}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500">
                                                {formatDate(statement.uploadDate)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full ${
                              statement.status === 'ANALYZED'
                                  ? 'bg-success-100 text-success-800'
                                  : statement.status === 'PROCESSED'
                                      ? 'bg-primary-100 text-primary-800'
                                      : 'bg-secondary-100 text-secondary-800'
                          } px-2 py-0.5 text-xs font-medium`}>
                            {statement.status}
                          </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {statement.riskLevel ? (
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-${getRiskLevelColor(statement.riskLevel)}-100 text-${getRiskLevelColor(statement.riskLevel)}-800`}>
                              {statement.riskLevel}
                            </span>
                                                ) : (
                                                    <span className="text-secondary-500">-</span>
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link
                                                    to={`/statements/${statement.id}`}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    View<span className="sr-only">, statement {statement.id}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white border border-secondary-200 rounded-lg py-8 text-center">
                                <FiFileText className="h-10 w-10 mx-auto text-secondary-400 mb-2" />
                                <h3 className="text-base font-medium text-secondary-900">No financial statements</h3>
                                <p className="mt-1 text-sm text-secondary-500">
                                    Get started by adding a financial statement for this company.
                                </p>
                                <div className="mt-6">
                                    <Button
                                        to={`/statements/new?companyId=${id}`}
                                        variant="primary"
                                    >
                                        <FiFileText className="mr-2 h-4 w-4" />
                                        Add Statement
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reports tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-secondary-900">Reports</h2>
                            <Button
                                to={`/reports/generate?companyId=${id}`}
                                variant="primary"
                                size="sm"
                            >
                                <FiPieChart className="mr-2 h-4 w-4" />
                                Generate Report
                            </Button>
                        </div>

                        <div className="bg-white border border-secondary-200 rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card
                                    title="Company Overview Report"
                                    subtitle="Full financial profile of the company"
                                    className="h-full"
                                >
                                    <div className="text-sm text-secondary-500 mb-4">
                                        A comprehensive report with complete financial health assessment and
                                        risk analysis for this company, with historical data and trends.
                                    </div>
                                    <Button
                                        to={`/reports/generate?type=company-overview&companyId=${id}`}
                                        variant="outline"
                                        className="mt-2"
                                    >
                                        Generate Report <FiArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Card>

                                <Card
                                    title="Fraud Risk Report"
                                    subtitle="Detailed fraud risk assessment"
                                    className="h-full"
                                >
                                    <div className="text-sm text-secondary-500 mb-4">
                                        An in-depth analysis of fraud risk factors for this company,
                                        including Z-Score, M-Score, F-Score, and ML predictions.
                                    </div>
                                    <Button
                                        to={`/reports/generate?type=fraud-risk&companyId=${id}`}
                                        variant="outline"
                                        className="mt-2"
                                    >
                                        Generate Report <FiArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDetail;