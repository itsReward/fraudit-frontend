import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStatementById, getFinancialDataByStatementId } from '../../api/financial';
import {
    getAltmanZScoreByStatementId,
    getBeneishMScoreByStatementId,
    getPiotroskiFScoreByStatementId,
    getFinancialRatiosByStatementId
} from '../../api/financial';
import { getRiskAssessmentByStatementId } from '../../api/risk';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import ZScoreCard from '../../components/analysis/ZScoreCard';
import MScoreCard from '../../components/analysis/MScoreCard';
import FScoreCard from '../../components/analysis/FScoreCard';
import FinancialRatiosTable from '../../components/analysis/FinancialRatiosTable';
import RiskScoreCard from '../../components/analysis/RiskScoreCard';
import FinancialDataForm from '../../components/financial/FinancialDataForm';
import DocumentUploader from '../../components/financial/DocumentUploader';
import { FiFileText, FiBarChart2, FiEdit, FiDownload, FiCheckCircle } from 'react-icons/fi';
import MLPredictions from '../../components/ml/MLPredictions';

const StatementDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddData, setShowAddData] = useState(false);

    // Fetch statement data
    const { data: statementData, isLoading: statementLoading, error: statementError } = useQuery(
        ['statement', id],
        () => getStatementById(id)
    );

    // Fetch financial data
    const { data: financialData, isLoading: financialDataLoading, error: financialDataError } = useQuery(
        ['financialData', id],
        () => getFinancialDataByStatementId(id),
        {
            enabled: !!statementData,
            onError: () => {} // Silence errors as financial data might not exist yet
        }
    );

    // Fetch analysis data (only if statement exists)
    const { data: zScoreData, isLoading: zScoreLoading } = useQuery(
        ['zScore', id],
        () => getAltmanZScoreByStatementId(id),
        {
            enabled: !!statementData && statementData?.data?.data?.status !== 'PENDING',
            onError: () => {} // Silence errors as this data might not exist yet
        }
    );

    const { data: mScoreData, isLoading: mScoreLoading } = useQuery(
        ['mScore', id],
        () => getBeneishMScoreByStatementId(id),
        {
            enabled: !!statementData && statementData?.data?.data?.status !== 'PENDING',
            onError: () => {} // Silence errors as this data might not exist yet
        }
    );

    const { data: fScoreData, isLoading: fScoreLoading } = useQuery(
        ['fScore', id],
        () => getPiotroskiFScoreByStatementId(id),
        {
            enabled: !!statementData && statementData?.data?.data?.status !== 'PENDING',
            onError: () => {} // Silence errors as this data might not exist yet
        }
    );

    const { data: ratiosData, isLoading: ratiosLoading } = useQuery(
        ['financialRatios', id],
        () => getFinancialRatiosByStatementId(id),
        {
            enabled: !!statementData && statementData?.data?.data?.status !== 'PENDING',
            onError: () => {} // Silence errors as this data might not exist yet
        }
    );

    // Fetch risk assessment data
    const { data: riskData, isLoading: riskLoading } = useQuery(
        ['riskAssessment', id],
        () => getRiskAssessmentByStatementId(id),
        {
            enabled: !!statementData && statementData?.data?.data?.status === 'ANALYZED',
            onError: () => {} // Silence errors as risk assessment might not exist yet
        }
    );

    // Extract data from query results
    const statement = statementData?.data?.data;
    const financial = financialData?.data?.data;
    const zScore = zScoreData?.data?.data;
    const mScore = mScoreData?.data?.data;
    const fScore = fScoreData?.data?.data;
    const ratios = ratiosData?.data?.data;
    const riskAssessment = riskData?.data?.data;

    // Determine if financial data exists
    const hasFinancialData = !!financial;

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Format currency
    const formatCurrency = (value) => {
        if (!value && value !== 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Handle financial data form submission
    const handleFinancialDataSubmit = () => {
        setShowAddData(false);
        // This would typically invalidate the relevant queries to refresh the data
    };

    if (statementLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (statementError || !statement) {
        return (
            <Alert variant="danger" title="Error loading financial statement">
                The financial statement could not be found or there was an error loading it.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">
                        {statement.companyName} - {statement.year} {statement.statementType}
                    </h1>
                    <p className="mt-1 text-secondary-500">
                        {statement.period ? `Period: ${statement.period}` : 'Financial Statement Detail'}
                    </p>
                </div>

                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Link to={`/statements/${id}/edit`}>
                        <Button variant="outline" size="sm">
                            <FiEdit className="mr-2 h-4 w-4" />
                            Edit Statement
                        </Button>
                    </Link>
                    <Link to={`/risk/assessments/statement/${id}`}>
                        <Button variant="primary" size="sm">
                            <FiBarChart2 className="mr-2 h-4 w-4" />
                            View Risk Assessment
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Status Info */}
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                            statement.status === 'ANALYZED'
                                ? 'bg-success-100 text-success-600'
                                : statement.status === 'PROCESSED'
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'bg-secondary-100 text-secondary-600'
                        }`}>
                            {statement.status === 'ANALYZED' ? (
                                <FiCheckCircle className="h-5 w-5" />
                            ) : statement.status === 'PROCESSED' ? (
                                <FiBarChart2 className="h-5 w-5" />
                            ) : (
                                <FiFileText className="h-5 w-5" />
                            )}
                        </span>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-secondary-900">
                                Status: <span className="font-semibold">{statement.status}</span>
                            </p>
                            <p className="text-xs text-secondary-500">
                                Uploaded on {formatDate(statement.uploadDate)}
                            </p>
                        </div>
                    </div>

                    <div>
                        {!hasFinancialData && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowAddData(true)}
                            >
                                Add Financial Data
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Show financial data form if requested */}
            {showAddData && (
                <FinancialDataForm
                    statementId={id}
                    initialData={financial}
                    onSuccess={handleFinancialDataSubmit}
                />
            )}

            {/* Tabs */}
            <div className="border-b border-secondary-200">
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
                        onClick={() => setActiveTab('analysis')}
                        className={`${
                            activeTab === 'analysis'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Financial Analysis
                    </button>

                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`${
                            activeTab === 'documents'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Documents
                    </button>

                    <button
                        onClick={() => setActiveTab('ml')}
                        className={`${
                            activeTab === 'ml'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ML Analysis
                    </button>

                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {hasFinancialData ? (
                            <div className="space-y-6">
                                {/* Risk Overview */}
                                {riskAssessment && (
                                    <Card title="Risk Assessment">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <RiskScoreCard
                                                title="Overall Risk"
                                                score={riskAssessment.overallRiskScore || 0}
                                                riskLevel={riskAssessment.riskLevel || 'N/A'}
                                                details={[
                                                    { label: 'Z-Score Risk', value: `${riskAssessment.zScoreRisk || 0}` },
                                                    { label: 'M-Score Risk', value: `${riskAssessment.mScoreRisk || 0}` },
                                                    { label: 'F-Score Risk', value: `${riskAssessment.fScoreRisk || 0}` },
                                                    { label: 'ML Prediction', value: `${riskAssessment.mlPredictionRisk || 0}` },
                                                ]}
                                            />

                                            <div className="md:col-span-3">
                                                <h3 className="text-lg font-medium text-secondary-900 mb-2">Assessment Summary</h3>
                                                <p className="text-secondary-700">
                                                    {riskAssessment.assessmentSummary || 'No assessment summary available.'}
                                                </p>
                                                <div className="mt-4">
                                                    <Link to={`/risk/assessments/${riskAssessment.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Full Assessment
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Financial Highlights */}
                                <Card title="Financial Highlights">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-secondary-500 mb-2">Income Statement</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Revenue</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.revenue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Gross Profit</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.grossProfit)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Operating Income</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.operatingIncome)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Net Income</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.netIncome)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-secondary-500 mb-2">Balance Sheet</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Total Assets</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.totalAssets)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Total Liabilities</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.totalLiabilities)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Total Equity</span>
                                                    <span className="text-sm font-medium">{formatCurrency(financial.totalEquity)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-secondary-500">Working Capital</span>
                                                    <span className="text-sm font-medium">{formatCurrency(
                                                        financial.totalCurrentAssets && financial.totalCurrentLiabilities
                                                            ? financial.totalCurrentAssets - financial.totalCurrentLiabilities
                                                            : null
                                                    )}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-secondary-500 mb-2">Key Ratios</h3>
                                            <div className="space-y-2">
                                                {ratios ? (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-secondary-500">Current Ratio</span>
                                                            <span className="text-sm font-medium">{ratios.currentRatio?.toFixed(2) || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-secondary-500">Debt to Equity</span>
                                                            <span className="text-sm font-medium">{ratios.debtToEquity?.toFixed(2) || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-secondary-500">Return on Equity</span>
                                                            <span className="text-sm font-medium">{ratios.returnOnEquity?.toFixed(2) || 'N/A'}%</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-secondary-500">Net Profit Margin</span>
                                                            <span className="text-sm font-medium">{ratios.netProfitMargin?.toFixed(2) || 'N/A'}%</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-secondary-500">Ratios not yet calculated</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-secondary-200">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddData(true)}
                                        >
                                            <FiEdit className="mr-2 h-4 w-4" />
                                            Edit Financial Data
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <div className="py-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-secondary-900">No financial data available</h3>
                                    <p className="mt-1 text-sm text-secondary-500">
                                        Add financial data to enable analysis and risk assessment.
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddData(true)}
                                        >
                                            Add Financial Data
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* Financial Analysis Tab */}
                {activeTab === 'analysis' && (
                    <>
                        {hasFinancialData ? (
                            <div className="space-y-6">
                                {/* Fraud Detection Models */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ZScoreCard data={zScore} />
                                    <MScoreCard data={mScore} />
                                    <FScoreCard data={fScore} />
                                </div>

                                {/* Financial Ratios */}
                                <FinancialRatiosTable data={ratios} />
                            </div>
                        ) : (
                            <Card>
                                <div className="py-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-secondary-900">Financial analysis not available</h3>
                                    <p className="mt-1 text-sm text-secondary-500">
                                        Add financial data to enable analysis and risk assessment.
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddData(true)}
                                        >
                                            Add Financial Data
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        <DocumentUploader
                            statementId={id}
                            onUploadSuccess={() => {
                                // Would typically refetch document list
                            }}
                        />

                        <Card title="Uploaded Documents">
                            <div className="py-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-secondary-900">No documents uploaded yet</h3>
                                <p className="mt-1 text-sm text-secondary-500">
                                    Upload financial statement documents using the form above.
                                </p>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'ml' && (
                    <>
                        {hasFinancialData ? (
                            <div className="space-y-6">
                                {/* ML Predictions Component */}
                                <MLPredictions statementId={id} />

                                {/* ML Models Comparison */}
                                <Card title="ML Models Comparison">
                                    <div className="py-6 text-center">
                                        <FiBarChart2 className="mx-auto h-12 w-12 text-secondary-400" />
                                        <h3 className="mt-2 text-sm font-medium text-secondary-900">Model Comparison</h3>
                                        <p className="mt-1 text-sm text-secondary-500">
                                            Compare results from different ML models for this financial statement.
                                        </p>
                                        <div className="mt-4">
                                            <Link to={`/ml/models/performance`}>
                                                <Button variant="outline">
                                                    View Models Performance
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>

                                {/* Some additional information */}
                                <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                                    <h3 className="text-sm font-medium text-secondary-900 mb-2">
                                        About Machine Learning Analysis
                                    </h3>
                                    <p className="text-sm text-secondary-700">
                                        Our system uses machine learning models to analyze financial statements for potential
                                        fraud indicators. These models are trained on historical data of companies with known
                                        fraud cases and legitimate financial reporting.
                                    </p>
                                    <p className="text-sm text-secondary-700 mt-2">
                                        The ML predictions should be used as one of several tools in your fraud detection
                                        process. Always combine ML results with traditional financial analysis and expert judgment.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Card>
                                <div className="py-8 text-center">
                                    <FiBarChart2 className="mx-auto h-12 w-12 text-secondary-400" />
                                    <h3 className="mt-2 text-sm font-medium text-secondary-900">ML analysis not available</h3>
                                    <p className="mt-1 text-sm text-secondary-500">
                                        Add financial data to enable machine learning analysis.
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddData(true)}
                                        >
                                            Add Financial Data
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StatementDetail;