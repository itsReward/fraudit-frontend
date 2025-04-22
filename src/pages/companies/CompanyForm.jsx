import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyById, createCompany, updateCompany } from '../../api/companies';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiSave, FiX } from 'react-icons/fi';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch company data if in edit mode
    const { data: companyData, isLoading: fetchLoading, error: fetchError } = useQuery(
        ['company', id],
        () => getCompanyById(id),
        {
            enabled: isEditMode,
            onError: (err) => {
                setError(err.response?.data?.message || 'Failed to fetch company data');
            },
        }
    );

    // Create mutation for adding/updating company
    const mutation = useMutation(
        (values) => {
            // Add debug logs
            console.log("Sending company data:", values);
            return isEditMode
                ? updateCompany(id, values)
                : createCompany(values);
        },
        {
            onSuccess: (response) => {
                // Add debug log
                console.log("Mutation success response:", response);
                setSuccess(true);
                queryClient.invalidateQueries('companies');

                // Redirect after a brief delay to show success message
                setTimeout(() => {
                    navigate('/companies');
                }, 1500);
            },
            onError: (err) => {
                console.error("Mutation error:", err);
                setError(err.response?.data?.message || 'Failed to save company');
            },
        }
    );

    // Form validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Company name is required'),
        stockCode: Yup.string()
            .required('Stock code is required')
            .matches(/^[A-Za-z0-9]+$/, 'Stock code can only contain letters and numbers')
            .max(10, 'Stock code must be at most 10 characters'),
        sector: Yup.string(),
        listingDate: Yup.date().nullable(),
        description: Yup.string(),
    });

    // Initialize form
    const formik = useFormik({
        initialValues: {
            name: '',
            stockCode: '',
            sector: '',
            listingDate: '',
            description: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setError(null);
            setSuccess(false);
            mutation.mutate(values);
        },
        enableReinitialize: true,
    });

    // Update form values when company data is fetched in edit mode
    useEffect(() => {
        if (isEditMode && companyData) {
            // Add debug log
            console.log("Setting form values from company data:", companyData);

            // Handle different response structures
            const company = companyData.data?.data || companyData.data || {};

            formik.setValues({
                name: company.name || '',
                stockCode: company.stockCode || '',
                sector: company.sector || '',
                listingDate: company.listingDate ? company.listingDate.split('T')[0] : '', // Format as YYYY-MM-DD
                description: company.description || '',
            });
        }
    }, [isEditMode, companyData, formik.setValues]);

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (fetchError && isEditMode) {
        return (
            <Alert variant="danger" title="Error loading company">
                {error || 'An error occurred while fetching company data. Please try again later.'}
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">
                    {isEditMode ? 'Edit Company' : 'Add New Company'}
                </h1>
                <p className="mt-1 text-secondary-500">
                    {isEditMode
                        ? 'Update the company information'
                        : 'Enter details to add a new company to the system'}
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
                            ? 'Company updated successfully!'
                            : 'Company created successfully!'}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                                Company Name*
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`mt-1 block w-full border ${
                                    formik.touched.name && formik.errors.name
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                placeholder="Enter company name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.name}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="stockCode" className="block text-sm font-medium text-secondary-700">
                                Stock Code*
                            </label>
                            <input
                                type="text"
                                id="stockCode"
                                name="stockCode"
                                className={`mt-1 block w-full border ${
                                    formik.touched.stockCode && formik.errors.stockCode
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                placeholder="Enter stock code"
                                value={formik.values.stockCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.stockCode && formik.errors.stockCode ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.stockCode}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="sector" className="block text-sm font-medium text-secondary-700">
                                Sector
                            </label>
                            <select
                                id="sector"
                                name="sector"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={formik.values.sector}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select sector</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Retail">Retail</option>
                                <option value="Energy">Energy</option>
                                <option value="Mining">Mining</option>
                                <option value="Construction">Construction</option>
                                <option value="Telecommunications">Telecommunications</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="listingDate" className="block text-sm font-medium text-secondary-700">
                                Listing Date
                            </label>
                            <input
                                type="date"
                                id="listingDate"
                                name="listingDate"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={formik.values.listingDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.listingDate && formik.errors.listingDate ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.listingDate}</p>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter company description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/companies')}
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
                            {isEditMode ? 'Update Company' : 'Create Company'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CompanyForm;