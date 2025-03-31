import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getRiskAssessmentById, getRiskAlerts } from '../../api/risk';
import { getAltmanZScoreByStatementId, getBeneishMScoreByStatementId, getPiotroskiFScoreByStatementId } from '../../api/financial';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ZScoreCard from '../../components/analysis/ZScoreCard';
import MScoreCard from '../../components/analysis/MScoreCard';
import FScoreCard from '../../components/analysis/FScoreCard';
import RiskScoreCard from '../../components/analysis/RiskScoreCard';
import { FiArrowLeft, FiBarChart2, FiFileText, FiAlertTriangle, FiPrinter, FiDownload } from 'react-icons/fi';

const RiskAssessmentDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch risk assessment
    const {
        data: assessmentData,
        isLoading: assessmentLoading,
        error: assessmentError
    } = useQuery(
        ['riskAssessment', id],
        () => getRiskAssessmentById(id)
    );

    // Fetch risk alerts
    const {
        data: alertsData,
        isLoading: alertsLoading,
        error: alertsError
    } = useQuery(
        ['riskAlerts', id],
        () => getRiskAlerts({ assessmentId: id })
    );

    // Fetch Z-Score data (if assessment available)
    const {
        data: zScoreData,
        isLoading: zScoreLoading,
        error: zScoreError
    } = useQuery(
        ['zScore', assessmentData?.data?.data?.statementId],
        () => getAltmanZScoreByStatementId(assessmentData?.data?.data?.statementId),
        {
            enabled: !!assessmentData?.data?.data?.statementId
        }
    );

    // Fetch M-Score data (if assessment available)
    const {
        data: mScoreData,
        isLoading: mScoreLoading,
        error: mScoreError
    } = useQuery(
        ['mScore', assessmentData?.data?.data?.statementId],
        () => getBeneishMScoreByStatementId(assessmentData?.data?.data?.statementId),
        {
            enabled: !!assessmentData?.data?.data?.statementId
        }
    );

    // Fetch F-Score data (if assessment available)
    const {
        data: fScoreData,
        isLoading: fScoreLoading,
        error: fScoreError
    } = useQuery(
        ['fScore', assessmentData?.data?.data?.statementId],
        () => getPiotroskiFScoreByStatementId(assessmentData?.data?.data?.statementId),
        {
            enabled: !!assessmentData?.data?.data?.statementId
        }
    );

    // Extract data from query results
    const assessment = assessmentData?.data?.data;
    const alerts = alertsData?.data?.data?.content || [];
    const zScore = zScoreData?.data?.data;
    const mScore = mScoreData?.data?.data;
    const fScore = fScoreData?.data?.data;

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

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Loading state
    if (assessmentLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>

        {/* Tab content */}
        <div>
            {/* Overview tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Risk summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <RiskScoreCard
                                title="Overall Risk Assessment"
                                score={assessment.overallRiskScore || 0}
                                riskLevel={assessment.riskLevel}
                                details={riskFactors}
                            />
                        </div>

                        <Card title="Assessment Summary" className="h-full">
                            <div className="space-y-4">
                                <div className="text-sm text-secondary-500">
                                    {assessment.assessmentSummary || 'No summary available.'}
                                </div>

                                <div className="border-t border-secondary-200 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary-500">Assessed Date:</span>
                                        <span className="font-medium">{formatDate(assessment.assessedAt)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-secondary-500">Assessed By:</span>
                                        <span className="font-medium">{assessment.assessedByUsername || 'System'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Quick stats/info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {alerts.length > 0 ? (
                            <Card title="Recent Alerts" className="h-full">
                                <div className="space-y-4">
                                    {alerts.slice(0, 3).map((alert, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-md ${
                                                alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                                    ? 'bg-danger-50'
                                                    : alert.severity === 'MEDIUM'
                                                        ? 'bg-warning-50'
                                                        : 'bg-secondary-50'
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                                                    alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                                        ? 'bg-danger-500'
                                                        : alert.severity === 'MEDIUM'
                                                            ? 'bg-warning-500'
                                                            : 'bg-success-500'
                                                }`}
                                                />
                                                <div className="ml-2 min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-secondary-900">{alert.message}</p>
                                                    <p className="mt-1 text-xs text-secondary-500">{alert.alertType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {alerts.length > 3 && (
                                        <div className="text-center">
                                            <button
                                                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                                                onClick={() => setActiveTab('alerts')}
                                            >
                                                View all {alerts.length} alerts
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ) : (
                            <Card title="Alerts" className="h-full">
                                <div className="flex flex-col items-center justify-center h-24">
                                    <FiAlertTriangle className="h-6 w-6 text-secondary-400 mb-2" />
                                    <p className="text-sm text-secondary-500">No alerts detected</p>
                                </div>
                            </Card>
                        )}

                        <Card title="Company Information" className="h-full">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary-500">Company:</span>
                                    <Link
                                        to={`/companies/${assessment.companyId}`}
                                        className="font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        {assessment.companyName}
                                    </Link>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary-500">Year:</span>
                                    <span className="font-medium">{assessment.year}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary-500">Statement ID:</span>
                                    <Link
                                        to={`/statements/${assessment.statementId}`}
                                        className="font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        {assessment.statementId}
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card title="Risk Category Breakdown" className="h-full">
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary-500">Z-Score Category:</span>
                                        <span className={`font-medium ${
                                            zScore?.riskCategory === 'DISTRESS'
                                                ? 'text-danger-600'
                                                : zScore?.riskCategory === 'GREY'
                                                    ? 'text-warning-600'
                                                    : zScore?.riskCategory === 'SAFE'
                                                        ? 'text-success-600'
                                                        : ''
                                        }`}>
                                                {zScore?.riskCategory || 'N/A'}
                                            </span>
                                    </div>
                                    <div className="mt-1 text-xs text-secondary-500">
                                        {zScore?.zScore ? `Z-Score: ${zScore.zScore.toFixed(2)}` : ''}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary-500">M-Score Probability:</span>
                                        <span className={`font-medium ${
                                            mScore?.manipulationProbability === 'HIGH'
                                                ? 'text-danger-600'
                                                : mScore?.manipulationProbability === 'MEDIUM'
                                                    ? 'text-warning-600'
                                                    : mScore?.manipulationProbability === 'LOW'
                                                        ? 'text-success-600'
                                                        : ''
                                        }`}>
                                                {mScore?.manipulationProbability || 'N/A'}
                                            </span>
                                    </div>
                                    <div className="mt-1 text-xs text-secondary-500">
                                        {mScore?.mScore ? `M-Score: ${mScore.mScore.toFixed(2)}` : ''}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary-500">F-Score Strength:</span>
                                        <span className={`font-medium ${
                                            fScore?.financialStrength === 'WEAK'
                                                ? 'text-danger-600'
                                                : fScore?.financialStrength === 'MODERATE'
                                                    ? 'text-warning-600'
                                                    : fScore?.financialStrength === 'STRONG'
                                                        ? 'text-success-600'
                                                        : ''
                                        }`}>
                                                {fScore?.financialStrength || 'N/A'}
                                            </span>
                                    </div>
                                    <div className="mt-1 text-xs text-secondary-500">
                                        {fScore?.fScore !== undefined ? `F-Score: ${fScore.fScore}/9` : ''}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Alerts tab */}
            {activeTab === 'alerts' && (
                <div className="space-y-6">
                    <Card title="Risk Alerts">
                        {alertsLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <Loading />
                            </div>
                        ) : alertsError ? (
                            <Alert variant="danger" title="Error loading alerts">
                                An error occurred while fetching alerts. Please try again later.
                            </Alert>
                        ) : alerts.length > 0 ? (
                            <div className="divide-y divide-secondary-200">
                                {alerts.map((alert, index) => (
                                    <div key={index} className="py-4">
                                        <div className="flex items-start">
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                                alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                                    ? 'bg-danger-500'
                                                    : alert.severity === 'MEDIUM'
                                                        ? 'bg-warning-500'
                                                        : 'bg-success-500'
                                            }`}
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-secondary-900">{alert.message}</h4>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH'
                                                            ? 'bg-danger-100 text-danger-800'
                                                            : alert.severity === 'MEDIUM'
                                                                ? 'bg-warning-100 text-warning-800'
                                                                : 'bg-success-100 text-success-800'
                                                    }`}>
                                                            {alert.severity}
                                                        </span>
                                                </div>
                                                <p className="mt-1 text-sm text-secondary-500">Alert Type: {alert.alertType}</p>
                                                <p className="mt-1 text-xs text-secondary-500">Created: {formatDate(alert.createdAt)}</p>

                                                {alert.isResolved && (
                                                    <div className="mt-2 p-2 bg-secondary-50 rounded-md">
                                                        <div className="flex items-center">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                                                    Resolved
                                                                </span>
                                                            <span className="ml-2 text-xs text-secondary-500">
                                                                    {formatDate(alert.resolvedAt)} by {alert.resolvedByUsername || 'Unknown'}
                                                                </span>
                                                        </div>
                                                        {alert.resolutionNotes && (
                                                            <p className="mt-1 text-sm text-secondary-700">
                                                                {alert.resolutionNotes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {!alert.isResolved && (
                                                    <div className="mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            to={`/risk/alerts/${alert.id}/resolve`}
                                                        >
                                                            Resolve Alert
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                                <FiAlertTriangle className="h-12 w-12 text-secondary-400 mb-2" />
                                <h3 className="text-sm font-medium text-secondary-900">No alerts detected</h3>
                                <p className="mt-1 text-sm text-secondary-500">
                                    This assessment did not generate any risk alerts.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Analysis tab */}
            {activeTab === 'analysis' && (
                <div className="space-y-6">
                    {/* Scores grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            {zScoreLoading ? (
                                <Card title="Altman Z-Score">
                                    <div className="flex items-center justify-center h-32">
                                        <Loading />
                                    </div>
                                </Card>
                            ) : zScoreError ? (
                                <Alert variant="danger" title="Error loading Z-Score">
                                    An error occurred while fetching Z-Score data.
                                </Alert>
                            ) : (
                                <ZScoreCard data={zScore} />
                            )}
                        </div>

                        <div>
                            {mScoreLoading ? (
                                <Card title="Beneish M-Score">
                                    <div className="flex items-center justify-center h-32">
                                        <Loading />
                                    </div>
                                </Card>
                            ) : mScoreError ? (
                                <Alert variant="danger" title="Error loading M-Score">
                                    An error occurred while fetching M-Score data.
                                </Alert>
                            ) : (
                                <MScoreCard data={mScore} />
                            )}
                        </div>

                        <div>
                            {fScoreLoading ? (
                                <Card title="Piotroski F-Score">
                                    <div className="flex items-center justify-center h-32">
                                        <Loading />
                                    </div>
                                </Card>
                            ) : fScoreError ? (
                                <Alert variant="danger" title="Error loading F-Score">
                                    An error occurred while fetching F-Score data.
                                </Alert>
                            ) : (
                                <FScoreCard data={fScore} />
                            )}
                        </div>
                    </div>

                    {/* Assessment summary */}
                    <Card title="Full Assessment Summary">
                        <div className="prose prose-sm max-w-none text-secondary-900">
                            <p>{assessment.assessmentSummary || 'No detailed assessment available.'}</p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    </div>
    );
    }

    // Error state
    if (assessmentError) {
        return (
            <Alert variant="danger" title="Error loading risk assessment">
                An error occurred while fetching the risk assessment. Please try again later.
            </Alert>
        );
    }

    // Not found state
    if (!assessment) {
        return (
            <Alert variant="warning" title="Risk assessment not found">
                The requested risk assessment could not be found.
                <div className="mt-4">
                    <Button variant="outline" to="/risk" className="flex items-center">
                        <FiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Risk Assessments
                    </Button>
                </div>
            </Alert>
        );
    }

    // Prepare risk factor details for gauge card
    const riskFactors = [
        { label: 'Z-Score Risk', value: assessment.zScoreRisk?.toFixed(1) || 'N/A' },
        { label: 'M-Score Risk', value: assessment.mScoreRisk?.toFixed(1) || 'N/A' },
        { label: 'F-Score Risk', value: assessment.fScoreRisk?.toFixed(1) || 'N/A' },
        { label: 'Financial Ratio Risk', value: assessment.financialRatioRisk?.toFixed(1) || 'N/A' },
        { label: 'ML Prediction Risk', value: assessment.mlPredictionRisk?.toFixed(1) || 'N/A' }
    ];

    return (
        <div className="space-y-6">
            {/* Header with navigation and actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center">
                    <Link to="/risk" className="mr-4 text-secondary-500 hover:text-secondary-700">
                        <FiArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-secondary-900">Risk Assessment</h1>
                        <div className="mt-1 flex items-center text-secondary-500">
                            <span className="mr-2">
                                {assessment.companyName} • {assessment.year}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRiskLevelColor(assessment.riskLevel)}-100 text-${getRiskLevelColor(assessment.riskLevel)}-800`}>
                                {assessment.riskLevel || 'Unknown'}