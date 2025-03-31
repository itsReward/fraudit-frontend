import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    getFraudRiskStats,
    getCompanyRiskSummary,
    getFraudIndicatorsDistribution,
    getRecentRiskAlerts,
    getFraudRiskTrends
} from '../../api/risk';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import RiskSummaryCard from '../../components/dashboard/RiskSummaryCard';
import RecentAlertsCard from '../../components/dashboard/RecentAlertsCard';
import RiskTrendChart from '../../components/dashboard/RiskTrendChart';
import RiskDistributionChart from '../../components/dashboard/RiskDistributionChart';

const Dashboard = () => {
    // Fetch dashboard data
    const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
        ['fraudRiskStats'],
        () => getFraudRiskStats()
    );

    const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useQuery(
        ['companyRiskSummary'],
        () => getCompanyRiskSummary()
    );

    const { data: distributionData, isLoading: distributionLoading, error: distributionError } = useQuery(
        ['fraudIndicatorsDistribution'],
        () => getFraudIndicatorsDistribution()
    );

    const { data: alertsData, isLoading: alertsLoading, error: alertsError } = useQuery(
        ['recentRiskAlerts'],
        () => getRecentRiskAlerts(5)
    );

    const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useQuery(
        ['fraudRiskTrends'],
        () => getFraudRiskTrends()
    );

    // Extract data from query results
    const stats = statsData?.data?.data;
    const companies = companiesData?.data?.data;
    const distribution = distributionData?.data?.data;
    const alerts = alertsData?.data?.data;
    const trends = trendsData?.data?.data;

    // Combine error states
    const hasError = statsError || companiesError || distributionError || alertsError || trendsError;

    // Combine loading states
    const isLoading = statsLoading || companiesLoading || distributionLoading || alertsLoading || trendsLoading;

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
                return 'info';
        }
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
            <Alert variant="danger" title="Error loading dashboard data">
                An error occurred while fetching dashboard data. Please try again later.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">Dashboard</h1>
                <p className="mt-1 text-secondary-500">Overview of financial fraud detection and risk assessments.</p>
            </div>

            {/* Risk statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RiskSummaryCard
                    title="High Risk"
                    count={stats?.highRiskCount || 0}
                    total={stats?.totalAssessments || 0}
                    variant="danger"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                />
                <RiskSummaryCard
                    title="Medium Risk"
                    count={stats?.mediumRiskCount || 0}
                    total={stats?.totalAssessments || 0}
                    variant="warning"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <RiskSummaryCard
                    title="Low Risk"
                    count={stats?.lowRiskCount || 0}
                    total={stats?.totalAssessments || 0}
                    variant="success"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts - left panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Risk trend over time */}
                    <Card
                        title="Fraud Risk Trend"
                        subtitle="Average risk score trend over time"
                    >
                        <div className="h-80">
                            <RiskTrendChart data={trends || []} />
                        </div>
                    </Card>

                    {/* Risk distribution */}
                    <Card
                        title="Fraud Indicators Distribution"
                        subtitle="Distribution of fraud indicators by risk level"
                    >
                        <div className="h-80">
                            <RiskDistributionChart data={distribution || {}} />
                        </div>
                    </Card>
                </div>

                {/* Side panel */}
                <div className="space-y-6">
                    {/* Recent alerts */}
                    <RecentAlertsCard alerts={alerts || []} />

                    {/* Companies with highest risk */}
                    <Card
                        title="High Risk Companies"
                        subtitle="Companies with highest fraud risk"
                        footer={
                            <Link
                                to="/risk"
                                className="text-sm font-medium text-primary-600 hover:text-primary-500"
                            >
                                View all risk assessments
                            </Link>
                        }
                    >
                        <div className="space-y-4">
                            {companies && companies.length > 0 ? (
                                companies
                                    .sort((a, b) => b.riskScore - a.riskScore)
                                    .map((company, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-secondary-500 text-sm w-5">{index + 1}.</span>
                                                <div className="ml-2">
                                                    <h4 className="text-sm font-medium text-secondary-900">
                                                        <Link to={`/companies/${company.companyId}`} className="hover:text-primary-600">
                                                            {company.companyName}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-xs text-secondary-500">{company.stockCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium mr-2">{company.riskScore}</span>
                                                <span className={`badge badge-${getRiskLevelColor(company.riskLevel)}`}>
                          {company.riskLevel}
                        </span>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-secondary-500 text-sm text-center py-4">No risk data available</p>
                            )}
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card
                        title="Overall Statistics"
                        subtitle="Summary of fraud detection system"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-secondary-500">Total Assessments</span>
                                <span className="text-sm font-medium">{stats?.totalAssessments || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-secondary-500">Average Risk Score</span>
                                <span className="text-sm font-medium">{stats?.averageRiskScore?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-secondary-500">Unresolved Alerts</span>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium">{stats?.unresolvedAlerts || 0}</span>
                                    {stats?.unresolvedAlerts > 0 && (
                                        <span className="ml-2 h-2 w-2 rounded-full bg-danger-500"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;