import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStatementById, createStatement } from '../../api/financial';
import { getCompanies } from '../../api/companies';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiSave, FiX, FiPlus, FiCheck } from 'react-icons/fi';

// Assuming these fiscal year API functions would exist:
const createFiscalYear = (fiscalYearData) => {
    // This would be replaced with an actual API call
    console.log("Creating fiscal year:", fiscalYearData);
    return Promise.resolve({
        data: {
            success: true,
            message: "Fiscal year created successfully",
            data: { id: Date.now(), ...fiscalYearData }
        }
    });
};

const getFiscalYearsByCompany = (companyId) => {
    // This would be replaced with an actual API call
    console.log("Fetching fiscal years for company:", companyId);
    return Promise.resolve({
        data: {
            success: true,
            message: "Fiscal years retrieved successfully",
            data: [] // Empty for demonstration purposes
        }
    });
};

const StatementForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [createdFiscalYear, setCreatedFiscalYear] = useState(null);
    const [showFiscalYearForm, setShowFiscalYearForm] = useState(false);

    // Extract companyId from query params if available
    const searchParams = new URLSearchParams(location.search);
    const preselectedCompanyId = searchParams.get('companyId');
    const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId || '');

    // Fetch statement data if in edit mode
    const { data: statementData, isLoading: fetchLoading, error: fetchError } = useQuery(
        ['statement', id],
        () => getStatementById(id),
        {
            enabled: isEditMode,
            onError: (err) => {
                setError(err.response?.data?.message || 'Failed to fetch statement data');
            },
        }
    );

    // Fetch companies for dropdown
    const { data: companiesData, isLoading: companiesLoading } = useQuery(
        ['companies', { limit: 100 }],
        () => getCompanies({ size: 100 })
    );

    // Fetch fiscal years for selected company
    const { data: fiscalYearsData, isLoading: fiscalYearsLoading, refetch: refetchFiscalYears } = useQuery(
        ['fiscalYears', selectedCompanyId],
        () => getFiscalYearsByCompany(selectedCompanyId),
        {
            enabled: !!selectedCompanyId && !isEditMode,
            onError: (err) => {
                console.error("Error fetching fiscal years:", err);
            }
        }
    );

    const companies = companiesData?.data?.data?.content || [];
    const fiscalYears = fiscalYearsData?.data?.data || [];

    // Create fiscal year mutation
    const fiscalYearMutation = useMutation(
        (values) => createFiscalYear(values),
        {
            onSuccess: (response) => {
                const newFiscalYear = response.data.data;
                setCreatedFiscalYear(newFiscalYear);
                setShowFiscalYearForm(false);

                // Update the statement form with the new fiscal year ID
                statementFormik.setFieldValue('fiscalYearId', newFiscalYear.id.toString());

                // Refetch fiscal years to update the dropdown
                refetchFiscalYears();
            },
            onError: (err) => {
                setError(err.response?.data?.message || 'Failed to create fiscal year');
            }
        }
    );

    // Create statement mutation
    const statementMutation = useMutation(
        (values) => {
            // Convert fiscalYearId to number
            const payload = {
                ...values,
                fiscalYearId: parseInt(values.fiscalYearId, 10)
            };
            console.log("Creating statement with payload:", payload);
            return createStatement(payload);
        },
        {
            onSuccess: () => {
                setSuccess(true);
                queryClient.invalidateQueries('statements');

                // Redirect after a brief delay
                setTimeout(() => {
                    navigate('/statements');
                }, 1500);
            },
            onError: (err) => {
                console.error("Statement creation error:", err.response?.data);
                setError(err.response?.data?.message || 'Failed to save financial statement');
            },
        }
    );

    // Fiscal year validation schema
    const fiscalYearValidationSchema = Yup.object({
        companyId: Yup.number().required('Company is required'),
        year: Yup.number().required('Year is required').min(2000, 'Year must be 2000 or later').max(2100, 'Year must be 2100 or earlier'),
        startDate: Yup.date().required('Start date is required'),
        endDate: Yup.date().required('End date is required')
            .min(Yup.ref('startDate'), 'End date must be after start date'),
        isAudited: Yup.boolean()
    });

    // Fiscal year form
    const fiscalYearFormik = useFormik({
        initialValues: {
            companyId: selectedCompanyId || '',
            year: new Date().getFullYear(),
            startDate: `${new Date().getFullYear()}-01-01`, // Default to Jan 1st of current year
            endDate: `${new Date().getFullYear()}-12-31`, // Default to Dec 31st of current year
            isAudited: false
        },
        validationSchema: fiscalYearValidationSchema,
        onSubmit: (values) => {
            fiscalYearMutation.mutate({
                ...values,
                companyId: parseInt(values.companyId, 10),
                year: parseInt(values.year, 10)
            });
        },
        enableReinitialize: true
    });

    // Statement form validation schema
    const statementValidationSchema = Yup.object({
        fiscalYearId: Yup.string().required('Fiscal year is required'),
        statementType: Yup.string().required('Statement type is required'),
        period: Yup.string().nullable(),
    });

    // Statement form
    const statementFormik = useFormik({
        initialValues: {
            fiscalYearId: '',
            statementType: 'ANNUAL',
            period: 'Full Year',
        },
        validationSchema: statementValidationSchema,
        onSubmit: (values) => {
            setError(null);
            setSuccess(false);
            statementMutation.mutate(values);
        },
        enableReinitialize: true,
    });

    // Update form values when statement data is fetched in edit mode
    useEffect(() => {
        if (isEditMode && statementData?.data?.data) {
            const statement = statementData.data.data;
            statementFormik.setValues({
                fiscalYearId: statement.fiscalYearId || '',
                statementType: statement.statementType || 'ANNUAL',
                period: statement.period || '',
            });
        }
    }, [isEditMode, statementData, statementFormik.setValues]);

    // Update fiscal year form when company changes
    useEffect(() => {
        if (selectedCompanyId) {
            fiscalYearFormik.setFieldValue('companyId', selectedCompanyId);
        }
    }, [selectedCompanyId, fiscalYearFormik.setFieldValue]);

    // Handle company selection change
    const handleCompanyChange = (e) => {
        const companyId = e.target.value;
        setSelectedCompanyId(companyId);
        // Reset fiscal year selection when company changes
        statementFormik.setFieldValue('fiscalYearId', '');
    };

    if ((isEditMode && fetchLoading) || companiesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (fetchError && isEditMode) {
        return (
            <Alert variant="danger" title="Error loading statement">
                {error || 'An error occurred while fetching statement data. Please try again later.'}
            </Alert>
        );
    }

    // Get the selected company name for display
    const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">
                    {isEditMode ? 'Edit Financial Statement' : 'Add New Financial Statement'}
                </h1>
                <p className="mt-1 text-secondary-500">
                    {isEditMode
                        ? 'Update the financial statement information'
                        : 'Enter details to add a new financial statement'}
                </p>
            </div>

            {/* Step 1: Select Company */}
            <Card title="Step 1: Select Company">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="companySelect" className="block text-sm font-medium text-secondary-700">
                            Company*
                        </label>
                        <select
                            id="companySelect"
                            className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={selectedCompanyId}
                            onChange={handleCompanyChange}
                            disabled={isEditMode}
                        >
                            <option value="">Select a company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name} ({company.stockCode})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCompanyId && (
                        <div className="pt-3 flex justify-between items-center">
                            <p className="text-sm text-secondary-700">
                                Selected Company: <span className="font-medium">{selectedCompany?.name}</span>
                            </p>
                            {!isEditMode && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setShowFiscalYearForm(true)}
                                    disabled={!selectedCompanyId}
                                >
                                    <FiPlus className="mr-2 h-4 w-4" />
                                    Create New Fiscal Year
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Step 2: Create or Select Fiscal Year */}
            {selectedCompanyId && (
                <Card title="Step 2: Select or Create Fiscal Year">
                    {showFiscalYearForm ? (
                        /* Fiscal Year Creation Form */
                        <form onSubmit={fiscalYearFormik.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-secondary-700">
                                        Year*
                                    </label>
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        className={`mt-1 block w-full border ${
                                            fiscalYearFormik.touched.year && fiscalYearFormik.errors.year
                                                ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                                : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                        placeholder="2025"
                                        value={fiscalYearFormik.values.year}
                                        onChange={fiscalYearFormik.handleChange}
                                        onBlur={fiscalYearFormik.handleBlur}
                                    />
                                    {fiscalYearFormik.touched.year && fiscalYearFormik.errors.year ? (
                                        <p className="mt-1 text-sm text-danger-600">{fiscalYearFormik.errors.year}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="isAudited" className="block text-sm font-medium text-secondary-700">
                                        Audited
                                    </label>
                                    <div className="mt-2">
                                        <div className="form-check">
                                            <input
                                                id="isAudited"
                                                name="isAudited"
                                                type="checkbox"
                                                className="h-4 w-4 border-secondary-300 rounded text-primary-600 focus:ring-primary-500"
                                                checked={fiscalYearFormik.values.isAudited}
                                                onChange={fiscalYearFormik.handleChange}
                                            />
                                            <label htmlFor="isAudited" className="ml-2 text-sm text-secondary-700">
                                                This fiscal year has been audited
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-secondary-700">
                                        Start Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className={`mt-1 block w-full border ${
                                            fiscalYearFormik.touched.startDate && fiscalYearFormik.errors.startDate
                                                ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                                : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                        value={fiscalYearFormik.values.startDate}
                                        onChange={fiscalYearFormik.handleChange}
                                        onBlur={fiscalYearFormik.handleBlur}
                                    />
                                    {fiscalYearFormik.touched.startDate && fiscalYearFormik.errors.startDate ? (
                                        <p className="mt-1 text-sm text-danger-600">{fiscalYearFormik.errors.startDate}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-secondary-700">
                                        End Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className={`mt-1 block w-full border ${
                                            fiscalYearFormik.touched.endDate && fiscalYearFormik.errors.endDate
                                                ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                                : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                        value={fiscalYearFormik.values.endDate}
                                        onChange={fiscalYearFormik.handleChange}
                                        onBlur={fiscalYearFormik.handleBlur}
                                    />
                                    {fiscalYearFormik.touched.endDate && fiscalYearFormik.errors.endDate ? (
                                        <p className="mt-1 text-sm text-danger-600">{fiscalYearFormik.errors.endDate}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowFiscalYearForm(false)}
                                >
                                    <FiX className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={fiscalYearMutation.isLoading}
                                    disabled={fiscalYearMutation.isLoading || !fiscalYearFormik.isValid}
                                >
                                    <FiSave className="mr-2 h-4 w-4" />
                                    Create Fiscal Year
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* Fiscal Year Selection */
                        <div className="space-y-4">
                            {fiscalYearsLoading ? (
                                <div className="flex items-center justify-center h-24">
                                    <Loading size="sm" />
                                </div>
                            ) : fiscalYears.length > 0 || createdFiscalYear ? (
                                <div>
                                    <label htmlFor="fiscalYearId" className="block text-sm font-medium text-secondary-700">
                                        Select Fiscal Year*
                                    </label>
                                    <select
                                        id="fiscalYearId"
                                        name="fiscalYearId"
                                        className={`mt-1 block w-full border ${
                                            statementFormik.touched.fiscalYearId && statementFormik.errors.fiscalYearId
                                                ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                                : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                        value={statementFormik.values.fiscalYearId}
                                        onChange={statementFormik.handleChange}
                                        onBlur={statementFormik.handleBlur}
                                    >
                                        <option value="">Select a fiscal year</option>
                                        {/* Show the newly created fiscal year at the top */}
                                        {createdFiscalYear && (
                                            <option
                                                value={createdFiscalYear.id}
                                                key={`new-${createdFiscalYear.id}`}
                                            >
                                                {createdFiscalYear.year} (New)
                                            </option>
                                        )}
                                        {/* Show existing fiscal years */}
                                        {fiscalYears.map(year => (
                                            <option key={year.id} value={year.id}>
                                                {year.year} ({year.startDate} - {year.endDate})
                                                {year.isAudited ? ' - Audited' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {statementFormik.touched.fiscalYearId && statementFormik.errors.fiscalYearId ? (
                                        <p className="mt-1 text-sm text-danger-600">{statementFormik.errors.fiscalYearId}</p>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-secondary-500">No fiscal years found for this company.</p>
                                    <p className="text-secondary-500 text-sm mt-1">Please create a fiscal year to continue.</p>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="mt-4"
                                        onClick={() => setShowFiscalYearForm(true)}
                                    >
                                        <FiPlus className="mr-2 h-4 w-4" />
                                        Create Fiscal Year
                                    </Button>
                                </div>
                            )}

                            {createdFiscalYear && (
                                <div className="mt-2 bg-success-50 border border-success-200 rounded-md p-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <FiCheck className="h-5 w-5 text-success-500" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-success-800">Fiscal Year Created</h3>
                                            <div className="mt-1 text-sm text-success-700">
                                                <p>New fiscal year {createdFiscalYear.year} has been created successfully.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            )}

            {/* Step 3: Create Financial Statement */}
            {selectedCompanyId && (statementFormik.values.fiscalYearId || isEditMode) && (
                <Card title="Step 3: Create Financial Statement">
                    {error && (
                        <Alert
                            variant="danger"
                            title="Error"
                            dismissible
                            onDismiss={() => setError(null)}
                            className="mb-4"
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            variant="success"
                            title="Success"
                            dismissible
                            onDismiss={() => setSuccess(false)}
                            className="mb-4"
                        >
                            {isEditMode
                                ? 'Financial statement updated successfully!'
                                : 'Financial statement created successfully!'}
                        </Alert>
                    )}

                    <form onSubmit={statementFormik.handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="statementType" className="block text-sm font-medium text-secondary-700">
                                    Statement Type*
                                </label>
                                <select
                                    id="statementType"
                                    name="statementType"
                                    className={`mt-1 block w-full border ${
                                        statementFormik.touched.statementType && statementFormik.errors.statementType
                                            ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                            : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                    value={statementFormik.values.statementType}
                                    onChange={statementFormik.handleChange}
                                    onBlur={statementFormik.handleBlur}
                                >
                                    <option value="ANNUAL">Annual</option>
                                    <option value="QUARTERLY">Quarterly</option>
                                    <option value="INTERIM">Interim</option>
                                </select>
                                {statementFormik.touched.statementType && statementFormik.errors.statementType ? (
                                    <p className="mt-1 text-sm text-danger-600">{statementFormik.errors.statementType}</p>
                                ) : null}
                            </div>

                            <div>
                                <label htmlFor="period" className="block text-sm font-medium text-secondary-700">
                                    Period
                                </label>
                                <input
                                    type="text"
                                    id="period"
                                    name="period"
                                    className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="e.g., Q1, H1, or Full Year"
                                    value={statementFormik.values.period}
                                    onChange={statementFormik.handleChange}
                                    onBlur={statementFormik.handleBlur}
                                />
                                {statementFormik.touched.period && statementFormik.errors.period ? (
                                    <p className="mt-1 text-sm text-danger-600">{statementFormik.errors.period}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="pt-4 text-sm text-secondary-500">
                            <p>After creating the financial statement, you'll be able to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Upload financial statement documents</li>
                                <li>Enter financial data</li>
                                <li>Perform risk assessments</li>
                            </ul>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/statements')}
                            >
                                <FiX className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={statementMutation.isLoading}
                                disabled={statementMutation.isLoading || !statementFormik.isValid}
                            >
                                <FiSave className="h-4 w-4 mr-2" />
                                {isEditMode ? 'Update Statement' : 'Create Statement'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default StatementForm;