import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAvailableReports, generateReport } from '../../api/reports';
import { getCompanies } from '../../api/companies';
import { getRiskAssessments } from '../../api/risk';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiFileText, FiDownload, FiArrowLeft } from 'react-icons/fi';

const GenerateReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Extract query params
    const preselectedReportType = searchParams.get('type');
    const preselectedCompanyId = searchParams.get('companyId');
    const preselectedAssessmentId = searchParams.get('assessmentId');

    // Form state
    const [reportType, setReportType] = useState(preselectedReportType || '');
    const [companyId, setCompanyId] = useState(preselectedCompanyId || '');
    const [year, setYear] = useState('');
    const [assessmentId, setAssessmentId] = useState(preselectedAssessmentId || '');
    const [format, setFormat] = useState('PDF');
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    // Fetch available reports
    const { data: reportsData, isLoading: reportsLoading } = useQuery(
        ['availableReports'],
        () => getAvailableReports()
    );

    // Fetch companies for dropdown
    const { data: companiesData, isLoading: companiesLoading } = useQuery(
        ['companies'],
        () => getCompanies({ size: 100 })
    );

    // Fetch risk assessments if company is selected
    const { data: assessmentsData, isLoading: assessmentsLoading } = useQuery(
        ['riskAssessments', { companyId }],
        () => getRiskAssessments({ companyId, size: 100 }),
        {
            enabled: !!companyId
        }
    );

    // Extract data from query results
    const reports = reportsData?.data?.data || [];
    const companies = companiesData?.data?.data?.content || [];
    const assessments = assessmentsData?.data?.data?.content || [];

    // Generate mutation
    const mutation = useMutation(
        ({ reportType, parameters, format }) => generateReport(reportType, { ...parameters, format }),
        {
            onSuccess: (response) => {
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

                setGenerating(false);
            },
            onError: (err) => {
                setGenerating(false);
                setError(err.response?.data?.message || 'An error occurred during report generation');
            }
        }
    );

    // Handle report type change
    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);

        // Reset related fields when report type changes
        setCompanyId('');
        setYear('');
        setAssessmentId('');
    };

    // Handle company change
    const handleCompanyChange = (e) => {
        setCompanyId(e.target.value);
        setAssessmentId('');
    };

    // Handle report generation
    const handleGenerateReport = () => {
        setError(null);
        setGenerating(true);

        const parameters = {};

        // Add parameters based on report type
        if (companyId) {
            parameters.companyId = companyId;
        }

        if (year) {
            parameters.year = year;
        }

        if (assessmentId) {
            parameters.assessmentId = assessmentId;
        }

        mutation.mutate({ reportType, parameters, format });
    };

    // Check if form is valid
    const isFormValid = () => {
        if (!reportType) return false;

        // Company is required for most reports
        if (reportType === 'company-overview' || reportType === 'fraud-risk') {
            if (!companyId) return false;
        }

        // Assessment ID is required for risk-assessment report
        if (reportType === 'risk-assessment') {
            if (!assessmentId) return false;
        }

        return true;
    };

    // Format options
    const formatOptions = [
        { value: 'PDF', label: 'PDF' },
        { value: 'EXCEL', label: 'Excel' },
        { value: 'CSV', label: 'CSV' },
    ];

    // Generate year options
    const currentYear = new Date().getFullYear();
    const yearOptions = [
        { value: '', label: 'Select a year' },
        { value: currentYear.toString(), label: currentYear.toString() },
        { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
        { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() },
        { value: (currentYear - 3).toString(), label: (currentYear - 3).toString() },
    ];

    // Loading state
    if (reportsLoading || companiesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button
                    className="mr-4 text-secondary-500 hover:text-secondary-700"
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">Generate Report</h1>
                    <p className="mt-1 text-secondary-500">Generate and download reports for analysis and documentation</p>
                </div>
            </div>

            <Card>
                {error && (
                    <Alert
                        variant="danger"
                        title="Error generating report"
                        dismissible
                        onDismiss={() => setError(null)}
                        className="mb-4"
                    >
                        {error}
                    </Alert>
                )}

                <div className="space-y-6">
                    <div>
                        <Select
                            label="Report Type"
                            id="reportType"
                            name="reportType"
                            value={reportType}
                            onChange={handleReportTypeChange}
                            options={[
                                { value: '', label: 'Select report type' },
                                { value: 'company-overview', label: 'Company Overview Report' },
                                { value: 'fraud-risk', label: 'Fraud Risk Report' },
                                { value: 'risk-assessment', label: 'Risk Assessment Report' },
                                { value: 'system-activity', label: 'System Activity Report' },
                            ]}
                            required
                        />
                    </div>

                    {reportType && (
                        <div className="border-t border-secondary-200 pt-4">
                            <h3 className="text-sm font-medium text-secondary-900 mb-3">Report Parameters</h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {(reportType === 'company-overview' || reportType === 'fraud-risk') && (
                                    <>
                                        <Select
                                            label="Company"
                                            id="companyId"
                                            name="companyId"
                                            value={companyId}
                                            onChange={handleCompanyChange}
                                            options={[
                                                { value: '', label: 'Select a company' },
                                                ...companies.map(company => ({
                                                    value: company.id.toString(),
                                                    label: company.name
                                                }))
                                            ]}
                                            required
                                        />

                                        <Select
                                            label="Year"
                                            id="year"
                                            name="year"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            options={yearOptions}
                                        />
                                    </>
                                )}

                                {reportType === 'risk-assessment' && (
                                    <>
                                        <Select
                                            label="Company"
                                            id="companyId"
                                            name="companyId"
                                            value={companyId}
                                            onChange={handleCompanyChange}
                                            options={[
                                                { value: '', label: 'Select a company' },
                                                ...companies.map(company => ({
                                                    value: company.id.toString(),
                                                    label: company.name
                                                }))
                                            ]}
                                            required
                                        />

                                        <Select
                                            label="Risk Assessment"
                                            id="assessmentId"
                                            name="assessmentId"
                                            value={assessmentId}
                                            onChange={(e) => setAssessmentId(e.target.value)}
                                            options={[
                                                { value: '', label: 'Select an assessment' },
                                                ...assessments.map(assessment => ({
                                                    value: assessment.id.toString(),
                                                    label: `${assessment.year} - ${assessment.riskLevel} (${assessment.overallRiskScore.toFixed(1)})`
                                                }))
                                            ]}
                                            required
                                            disabled={!companyId || assessmentsLoading}
                                            helpText={!companyId ? 'Select a company first' : ''}
                                        />
                                    </>
                                )}

                                {reportType === 'system-activity' && (
                                    <Select
                                        label="Time Period"
                                        id="period"
                                        name="period"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        options={[
                                            { value: '', label: 'Select time period' },
                                            { value: 'last-week', label: 'Last Week' },
                                            { value: 'last-month', label: 'Last Month' },
                                            { value: 'last-quarter', label: 'Last Quarter' },
                                            { value: 'last-year', label: 'Last Year' },
                                            { value: 'all-time', label: 'All Time' }
                                        ]}
                                        required
                                    />
                                )}

                                <Select
                                    label="Output Format"
                                    id="format"
                                    name="format"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    options={formatOptions}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {reportType && (
                        <div className="border-t border-secondary-200 pt-4 flex justify-end">
                            <Button
                                variant="primary"
                                onClick={handleGenerateReport}
                                disabled={!isFormValid() || generating}
                                isLoading={generating}
                            >
                                <FiDownload className="mr-2 h-4 w-4" />
                                Generate Report
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {reportType && (
                <Card title="Report Description" className="mt-4">
                    <div className="space-y-4">
                        {reportType === 'company-overview' && (
                            <>
                                <div className="flex items-start">
                                    <FiFileText className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                                    <div>
                                        <h3 className="font-medium text-secondary-900">Company Overview Report</h3>
                                        <p className="text-sm text-secondary-500 mt-1">
                                            A comprehensive analysis of a company's financial health, performance metrics, and historical trends.
                                            This report includes key financial ratios, risk indicators, and comparison with industry benchmarks.
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-7">
                                    <h4 className="text-sm font-medium text-secondary-900">Report Contains:</h4>
                                    <ul className="mt-1 text-sm text-secondary-500 list-disc pl-5 space-y-1">
                                        <li>Company profile and general information</li>
                                        <li>Financial statement summaries</li>
                                        <li>Key financial ratios and trends</li>
                                        <li>Risk assessment overview</li>
                                        <li>Industry comparison</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {reportType === 'fraud-risk' && (
                            <>
                                <div className="flex items-start">
                                    <FiFileText className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                                    <div>
                                        <h3 className="font-medium text-secondary-900">Fraud Risk Report</h3>
                                        <p className="text-sm text-secondary-500 mt-1">
                                            An in-depth analysis of fraud risk indicators for a company, designed to identify potential
                                            areas of concern in financial reporting and provide recommendations for further investigation.
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-7">
                                    <h4 className="text-sm font-medium text-secondary-900">Report Contains:</h4>
                                    <ul className="mt-1 text-sm text-secondary-500 list-disc pl-5 space-y-1">
                                        <li>Executive summary of fraud risk factors</li>
                                        <li>Beneish M-Score analysis</li>
                                        <li>Altman Z-Score analysis</li>
                                        <li>Piotroski F-Score analysis</li>
                                        <li>Unusual financial patterns and anomalies</li>
                                        <li>Risk alerts and recommendations</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {reportType === 'risk-assessment' && (
                            <>
                                <div className="flex items-start">
                                    <FiFileText className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                                    <div>
                                        <h3 className="font-medium text-secondary-900">Risk Assessment Report</h3>
                                        <p className="text-sm text-secondary-500 mt-1">
                                            A detailed report on a specific risk assessment performed on a company's financial statements,
                                            including methodology, findings, alerts, and recommended actions.
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-7">
                                    <h4 className="text-sm font-medium text-secondary-900">Report Contains:</h4>
                                    <ul className="mt-1 text-sm text-secondary-500 list-disc pl-5 space-y-1">
                                        <li>Assessment methodology and parameters</li>
                                        <li>Risk score breakdown and analysis</li>
                                        <li>Detailed findings for each risk factor</li>
                                        <li>Risk alerts generated from the assessment</li>
                                        <li>Recommended actions and follow-up procedures</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {reportType === 'system-activity' && (
                            <>
                                <div className="flex items-start">
                                    <FiFileText className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                                    <div>
                                        <h3 className="font-medium text-secondary-900">System Activity Report</h3>
                                        <p className="text-sm text-secondary-500 mt-1">
                                            A report on system usage, user activity, and key actions performed within the system
                                            during the selected time period. Useful for audit trails and compliance reporting.
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-7">
                                    <h4 className="text-sm font-medium text-secondary-900">Report Contains:</h4>
                                    <ul className="mt-1 text-sm text-secondary-500 list-disc pl-5 space-y-1">
                                        <li>System access and login activity</li>
                                        <li>User actions by type and frequency</li>
                                        <li>Risk assessments performed</li>
                                        <li>Companies and statements added or modified</li>
                                        <li>Alerts generated and their resolution status</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GenerateReport;