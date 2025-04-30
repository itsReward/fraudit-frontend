import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAvailableReports, generateReport } from '../../api/reports';
import { getCompanies } from '../../api/companies';
import { getRiskAssessments } from '../../api/risk';
import { getStatementsByCompanyId } from '../../api/financial';
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
    const [statementId, setStatementId] = useState('');
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

    // Fetch financial statements if company is selected
    const { data: statementsData, isLoading: statementsLoading } = useQuery(
        ['financialStatements', { companyId }],
        () => getStatementsByCompanyId(companyId, { size: 100 }),
        {
            enabled: !!companyId
        }
    );

    // Extract data from query results
    const reports = reportsData?.data?.data || [];
    const companies = companiesData?.data?.data?.content || [];
    const assessments = assessmentsData?.data?.data?.content || [];
    const statements = statementsData?.data?.data?.content || [];

    // Generate mutation
    const mutation = useMutation(
        ({ reportType, parameters, format }) => generateReport(reportType, { ...parameters, format }),
        {
            onSuccess: (response) => {
                const contentDisposition = response.headers['content-disposition'];
                let filename = 'report';

                if (contentDisposition) {
                    const filenameRegex = /filename[^;=\n]*=((['\"]).*?\2|[^;\n]*)/;
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
        setStatementId('');
    };

    // Handle company change
    const handleCompanyChange = (e) => {
        setCompanyId(e.target.value);
        setAssessmentId('');
        setStatementId('');
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

        if (statementId) {
            parameters.statementId = statementId;
        }

        mutation.mutate({ reportType, parameters, format });
    };

    // Check if form is valid
    const isFormValid = () => {
        if (!reportType) return false;

        // Validation rules based on report type
        switch(reportType) {
            case 'company-overview':
            case 'fraud-risk':
                return !!companyId;
            case 'risk-assessment':
                return !!assessmentId;
            case 'financial-analysis':
            case 'financial-statement':
                return !!statementId;
            default:
                return true;
        }
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
                                { value: 'financial-analysis', label: 'Financial Analysis Report' },
                                { value: 'financial-statement', label: 'Financial Statement Report' },
                            ]}
                            required
                        />
                    </div>

                    {reportType && (
                        <div className="border-t border-secondary-200 pt-4">
                            <h3 className="text-sm font-medium text-secondary-900 mb-3">Report Parameters</h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Company selection - for most reports */}
                                {(reportType === 'company-overview' || 
                                  reportType === 'fraud-risk' || 
                                  reportType === 'financial-analysis' || 
                                  reportType === 'financial-statement') && (
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
                                )}

                                {/* Year selection - optional for most reports */}
                                {(reportType === 'company-overview' || 
                                  reportType === 'fraud-risk') && (
                                    <Select
                                        label="Year"
                                        id="year"
                                        name="year"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        options={yearOptions}
                                    />
                                )}

                                {/* Risk assessment selection - for risk assessment report */}
                                {reportType === 'risk-assessment' && assessments.length > 0 && (
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
                                                label: `${assessment.companyName} - ${new Date(assessment.assessmentDate).toLocaleDateString()}`
                                            }))
                                        ]}
                                        required
                                    />
                                )}

                                {/* Financial statement selection - for financial reports */}
                                {(reportType === 'financial-analysis' || 
                                  reportType === 'financial-statement') && 
                                  companyId && (
                                    statementsLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loading size="sm" />
                                            <span className="text-secondary-500">Loading statements...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            label="Financial Statement"
                                            id="statementId"
                                            name="statementId"
                                            value={statementId}
                                            onChange={(e) => setStatementId(e.target.value)}
                                            options={[
                                                { value: '', label: 'Select a financial statement' },
                                                ...statements.map(statement => ({
                                                    value: statement.id.toString(),
                                                    label: `${statement.statementType} - ${statement.fiscalYear} ${statement.fiscalPeriod || ''}`
                                                }))
                                            ]}
                                            required
                                        />
                                    )
                                )}

                                {/* Format selection - for all reports */}
                                <Select
                                    label="Output Format"
                                    id="format"
                                    name="format"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    options={formatOptions}
                                />
                            </div>

                            {/* For risk assessment report - company selection UI when no assessmentId provided */}
                            {reportType === 'risk-assessment' && !assessmentId && (
                                <div className="mt-6 border-t border-secondary-200 pt-4">
                                    <p className="text-sm text-secondary-500 mb-3">
                                        Select a company to view available risk assessments:
                                    </p>
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
                                    />
                                </div>
                            )}

                            {reportType === 'risk-assessment' && companyId && assessmentsLoading && (
                                <div className="mt-4 flex items-center space-x-2">
                                    <Loading size="sm" />
                                    <span className="text-secondary-500">Loading assessments...</span>
                                </div>
                            )}

                            {reportType === 'risk-assessment' && companyId && !assessmentsLoading && assessments.length === 0 && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                    <p className="text-sm text-amber-800">
                                        No risk assessments found for this company. Please select a different company or create a new assessment.
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-end">
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleGenerateReport}
                                    disabled={!isFormValid() || generating}
                                    icon={generating ? <Loading size="sm" color="white" /> : <FiDownload />}
                                >
                                    {generating ? 'Generating...' : 'Generate Report'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {reportType && (
                    <div className="mt-8 border-t border-secondary-200 pt-4">
                        <h3 className="text-sm font-medium text-secondary-900 mb-2">Report Contents</h3>
                        
                        {reportType === 'company-overview' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>Company profile and basic information</li>
                                <li>Financial highlights and key metrics</li>
                                <li>Industry comparison and benchmarks</li>
                                <li>Historical performance summary</li>
                            </ul>
                        )}
                        
                        {reportType === 'fraud-risk' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>Overall fraud risk score and trends</li>
                                <li>Key risk indicators and red flags</li>
                                <li>Risk alerts and recommendations</li>
                                <li>Financial ratio analysis</li>
                                <li>Fraud prediction model results</li>
                            </ul>
                        )}
                        
                        {reportType === 'risk-assessment' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>Detailed risk assessment results</li>
                                <li>Financial statement analysis</li>
                                <li>Beneish M-Score analysis</li>
                                <li>Altman Z-Score analysis</li>
                                <li>Piotroski F-Score analysis</li>
                                <li>Identified anomalies and red flags</li>
                            </ul>
                        )}
                        
                        {reportType === 'financial-analysis' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>Detailed financial ratio analysis</li>
                                <li>Trend analysis of key metrics</li>
                                <li>Comparison to industry benchmarks</li>
                                <li>Liquidity, solvency and profitability metrics</li>
                                <li>Financial health indicators</li>
                            </ul>
                        )}
                        
                        {reportType === 'financial-statement' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>Balance sheet with comparative analysis</li>
                                <li>Income statement with trend analysis</li>
                                <li>Cash flow statement</li>
                                <li>Notes and explanations</li>
                            </ul>
                        )}
                        
                        {reportType === 'system-activity' && (
                            <ul className="text-sm text-secondary-600 list-disc ml-5 space-y-1">
                                <li>User activity logs and summary</li>
                                <li>System access statistics</li>
                                <li>Feature usage metrics</li>
                                <li>Audit trail of key actions</li>
                            </ul>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GenerateReport;