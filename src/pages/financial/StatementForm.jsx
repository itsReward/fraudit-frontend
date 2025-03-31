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
import { FiSave, FiX } from 'react-icons/fi';

const StatementForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Extract companyId from query params if available
    const searchParams = new URLSearchParams(location.search);
    const preselectedCompanyId = searchParams.get('companyId');

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

    const companies = companiesData?.data?.data?.content || [];

    // Create mutation for adding statement
    const mutation = useMutation(
        (values) => createStatement(values),
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
                setError(err.response?.data?.message || 'Failed to save financial statement');
            },
        }
    );

    // Form validation schema
    const validationSchema = Yup.object({
        fiscalYearId: Yup.number().required('Fiscal year is required'),
        statementType: Yup.string().required('Statement type is required'),
        period: Yup.string().nullable(),
    });

    // Initialize form
    const formik = useFormik({
        initialValues: {
            fiscalYearId: '',
            statementType: 'ANNUAL',
            period: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setError(null);
            setSuccess(false);
            mutation.mutate(values);
        },
        enableReinitialize: true,
    });

    // Update form values when statement data is fetched in edit mode
    useEffect(() => {
        if (isEditMode && statementData?.data?.data) {
            const statement = statementData.data.data;
            formik.setValues({
                fiscalYearId: statement.fiscalYearId || '',
                statementType: statement.statementType || 'ANNUAL',
                period: statement.period || '',
            });
        } else if (preselectedCompanyId) {
            // Pre-fill company if specified in URL
            // In a real app, you'd fetch fiscal years for this company
            // For now, just set the companyId in state for future use
        }
    }, [isEditMode, statementData, preselectedCompanyId, formik.setValues]);

    if (fetchLoading || companiesLoading) {
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

            <Card>
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

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="fiscalYearId" className="block text-sm font-medium text-secondary-700">
                                Company & Fiscal Year*
                            </label>
                            {/*
                                In a real implementation, this would be a cascading select:
                                1. First select a company
                                2. Then select a fiscal year for that company

                                For demo simplicity, we're using a single dropdown
                            */}
                            <select
                                id="fiscalYearId"
                                name="fiscalYearId"
                                className={`mt-1 block w-full border ${
                                    formik.touched.fiscalYearId && formik.errors.fiscalYearId
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                value={formik.values.fiscalYearId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select a company and fiscal year</option>
                                {/*
                                    For demo purposes, we'll just list companies
                                    In a real app, you'd fetch fiscal years for each company
                                */}
                                {companies.map((company) => (
                                    <optgroup key={company.id} label={company.name}>
                                        <option value={`${company.id}-2023`}>{company.name} - FY 2023</option>
                                        <option value={`${company.id}-2022`}>{company.name} - FY 2022</option>
                                        <option value={`${company.id}-2021`}>{company.name} - FY 2021</option>
                                    </optgroup>
                                ))}
                            </select>
                            {formik.touched.fiscalYearId && formik.errors.fiscalYearId ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.fiscalYearId}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="statementType" className="block text-sm font-medium text-secondary-700">
                                Statement Type*
                            </label>
                            <select
                                id="statementType"
                                name="statementType"
                                className={`mt-1 block w-full border ${
                                    formik.touched.statementType && formik.errors.statementType
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                value={formik.values.statementType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="ANNUAL">Annual</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="INTERIM">Interim</option>
                            </select>
                            {formik.touched.statementType && formik.errors.statementType ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.statementType}</p>
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
                                value={formik.values.period}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.period && formik.errors.period ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.period}</p>
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
                            isLoading={mutation.isLoading}
                            disabled={mutation.isLoading || !formik.isValid}
                        >
                            <FiSave className="h-4 w-4 mr-2" />
                            {isEditMode ? 'Update Statement' : 'Create Statement'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default StatementForm;