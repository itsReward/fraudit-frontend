// src/pages/ml/MLModelForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiSave, FiX, FiPlus, FiTrash } from 'react-icons/fi';

// Mock API functions - replace with actual API calls when implemented
const mockModels = [
    {
        id: 1,
        name: 'Earnings Manipulation Detector',
        type: 'CLASSIFICATION',
        algorithm: 'Random Forest',
        accuracy: 0.92,
        status: 'ACTIVE',
        lastTrained: '2023-11-15T10:30:00Z',
        description: 'Detects potential earnings manipulation based on financial ratios and statement patterns.',
        createdAt: '2023-10-01T08:15:00Z',
        updatedAt: '2023-11-15T10:30:00Z',
        features: [
            'Days Sales in Receivables Index',
            'Gross Margin Index',
            'Asset Quality Index',
            'Sales Growth Index',
            'Total Accruals to Total Assets'
        ],
        hyperparameters: {
            n_estimators: 100,
            max_depth: 10,
            min_samples_split: 2,
            min_samples_leaf: 1,
            random_state: 42
        },
        author: 'Admin User'
    },
    {
        id: 2,
        name: 'Financial Distress Predictor',
        type: 'CLASSIFICATION',
        algorithm: 'XGBoost',
        accuracy: 0.89,
        status: 'ACTIVE',
        lastTrained: '2023-11-10T14:20:00Z',
        description: 'Predicts potential financial distress based on various financial indicators.',
        createdAt: '2023-09-15T11:30:00Z',
        updatedAt: '2023-11-10T14:20:00Z',
        features: [
            'Current Ratio',
            'Debt to Equity Ratio',
            'Return on Assets',
            'Interest Coverage Ratio',
            'Operating Cash Flow'
        ],
        hyperparameters: {
            learning_rate: 0.1,
            max_depth: 5,
            n_estimators: 100,
            subsample: 0.8,
            colsample_bytree: 0.8,
            random_state: 42
        },
        author: 'Analyst User'
    },
    {
        id: 3,
        name: 'Anomaly Detection System',
        type: 'ANOMALY_DETECTION',
        algorithm: 'Isolation Forest',
        accuracy: 0.85,
        status: 'INACTIVE',
        lastTrained: '2023-10-20T09:45:00Z',
        description: 'Identifies anomalies in financial statements and transaction patterns.',
        createdAt: '2023-08-20T13:40:00Z',
        updatedAt: '2023-10-20T09:45:00Z',
        features: [
            'Transaction Amount',
            'Transaction Frequency',
            'Account Activity Patterns',
            'Time of Day',
            'Historical Transaction Comparison'
        ],
        hyperparameters: {
            n_estimators: 100,
            max_samples: 'auto',
            contamination: 0.1,
            max_features: 1.0,
            bootstrap: true,
            random_state: 42
        },
        author: 'Admin User'
    }
];

// Mock fetch function for getting model by ID
const fetchModel = async (id) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const model = mockModels.find(m => m.id === parseInt(id));

    if (!model) {
        throw new Error('Model not found');
    }

    return { data: { data: model } };
};

// Mock save function
const saveModel = async (modelData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { data: { ...modelData, id: modelData.id || Date.now() } } };
};

const MLModelForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch model data if in edit mode
    const { data, isLoading, error: fetchError } = useQuery(
        ['mlModel', id],
        () => fetchModel(id),
        {
            enabled: isEditMode,
            onError: (err) => {
                setError(err.message || 'Failed to fetch model data');
            }
        }
    );

    // Save mutation
    const saveMutation = useMutation(
        (values) => saveModel(values),
        {
            onSuccess: () => {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/ml/models');
                }, 1500);
            },
            onError: (err) => {
                setError(err.message || 'Failed to save model');
            }
        }
    );

    // Model type options
    const modelTypeOptions = [
        { value: 'CLASSIFICATION', label: 'Classification' },
        { value: 'REGRESSION', label: 'Regression' },
        { value: 'ANOMALY_DETECTION', label: 'Anomaly Detection' },
        { value: 'CLUSTERING', label: 'Clustering' }
    ];

    // Algorithm options based on model type
    const getAlgorithmOptions = (type) => {
        switch (type) {
            case 'CLASSIFICATION':
                return [
                    { value: 'Random Forest', label: 'Random Forest' },
                    { value: 'XGBoost', label: 'XGBoost' },
                    { value: 'Decision Tree', label: 'Decision Tree' },
                    { value: 'Logistic Regression', label: 'Logistic Regression' },
                    { value: 'Support Vector Machine', label: 'Support Vector Machine' },
                    { value: 'Neural Network', label: 'Neural Network' }
                ];
            case 'REGRESSION':
                return [
                    { value: 'Linear Regression', label: 'Linear Regression' },
                    { value: 'Random Forest Regressor', label: 'Random Forest Regressor' },
                    { value: 'XGBoost Regressor', label: 'XGBoost Regressor' },
                    { value: 'Ridge Regression', label: 'Ridge Regression' },
                    { value: 'Lasso Regression', label: 'Lasso Regression' }
                ];
            case 'ANOMALY_DETECTION':
                return [
                    { value: 'Isolation Forest', label: 'Isolation Forest' },
                    { value: 'One-Class SVM', label: 'One-Class SVM' },
                    { value: 'Local Outlier Factor', label: 'Local Outlier Factor' },
                    { value: 'Autoencoders', label: 'Autoencoders' }
                ];
            case 'CLUSTERING':
                return [
                    { value: 'K-Means', label: 'K-Means' },
                    { value: 'DBSCAN', label: 'DBSCAN' },
                    { value: 'Hierarchical Clustering', label: 'Hierarchical Clustering' }
                ];
            default:
                return [];
        }
    };

    // Status options
    const statusOptions = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'DRAFT', label: 'Draft' }
    ];

    // Validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        algorithm: Yup.string().required('Algorithm is required'),
        description: Yup.string().required('Description is required'),
        status: Yup.string().required('Status is required'),
        features: Yup.array().min(1, 'At least one feature is required')
    });

    // Initialize form
    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'CLASSIFICATION',
            algorithm: '',
            description: '',
            status: 'DRAFT',
            features: [''],
            hyperparameters: {}
        },
        validationSchema,
        onSubmit: (values) => {
            // Filter out empty features
            const formattedValues = {
                ...values,
                features: values.features.filter(f => f.trim() !== '')
            };

            if (isEditMode) {
                formattedValues.id = parseInt(id);
            }

            saveMutation.mutate(formattedValues);
        },
        enableReinitialize: true
    });

    // Update form values when model data is fetched
    React.useEffect(() => {
        if (data?.data?.data && isEditMode) {
            const modelData = data.data.data;
            formik.setValues({
                name: modelData.name || '',
                type: modelData.type || 'CLASSIFICATION',
                algorithm: modelData.algorithm || '',
                description: modelData.description || '',
                status: modelData.status || 'DRAFT',
                features: modelData.features || [''],
                hyperparameters: modelData.hyperparameters || {}
            });
        }
    }, [data, isEditMode]);

    // Handle adding a new feature field
    const handleAddFeature = () => {
        formik.setFieldValue('features', [...formik.values.features, '']);
    };

    // Handle removing a feature field
    const handleRemoveFeature = (index) => {
        const updatedFeatures = [...formik.values.features];
        updatedFeatures.splice(index, 1);
        formik.setFieldValue('features', updatedFeatures);
    };

    // Handle feature field change
    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...formik.values.features];
        updatedFeatures[index] = value;
        formik.setFieldValue('features', updatedFeatures);
    };

    // Handle algorithm change based on model type
    React.useEffect(() => {
        formik.setFieldValue('algorithm', '');
    }, [formik.values.type]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    // Error state
    if (fetchError && isEditMode) {
        return (
            <Alert variant="danger" title="Error loading model">
                {error}
                <div className="mt-4">
                    <Button variant="primary" onClick={() => navigate('/ml/models')}>
                        Back to Models
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-secondary-900">
                    {isEditMode ? 'Edit ML Model' : 'Create New ML Model'}
                </h1>
                <Button
                    variant="outline"
                    onClick={() => navigate('/ml/models')}
                >
                    <FiX className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    dismissible
                    onDismiss={() => setError(null)}
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
                >
                    {isEditMode ? 'Model updated successfully!' : 'Model created successfully!'}
                </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-6">
                    <Card title="Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Model Name"
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && formik.errors.name}
                                required
                            />

                            <Select
                                label="Model Type"
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                options={modelTypeOptions}
                                error={formik.touched.type && formik.errors.type}
                                required
                            />

                            <Select
                                label="Algorithm"
                                id="algorithm"
                                name="algorithm"
                                value={formik.values.algorithm}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                options={getAlgorithmOptions(formik.values.type)}
                                error={formik.touched.algorithm && formik.errors.algorithm}
                                required
                                disabled={!formik.values.type}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    label="Description"
                                    id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && formik.errors.description}
                                    required
                                />
                            </div>

                            <Select
                                label="Status"
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                options={statusOptions}
                                error={formik.touched.status && formik.errors.status}
                                required
                            />
                        </div>
                    </Card>

                    <Card title="Model Features">
                        <div className="space-y-4">
                            <p className="text-sm text-secondary-500">
                                Define the features (input variables) that your model will use for prediction.
                            </p>

                            {formik.values.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <Input
                                            placeholder={`Feature ${index + 1}`}
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            error={
                                                formik.touched.features &&
                                                formik.errors.features &&
                                                typeof formik.errors.features !== 'string' &&
                                                formik.errors.features[index]
                                            }
                                        />
                                    </div>
                                    {formik.values.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="shrink-0"
                                        >
                                            <FiTrash className="h-4 w-4 text-danger-500" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddFeature}
                                className="mt-2"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Feature
                            </Button>

                            {formik.touched.features && typeof formik.errors.features === 'string' && (
                                <p className="mt-1 text-xs text-danger-600">{formik.errors.features}</p>
                            )}
                        </div>
                    </Card>

                    <Card title="Advanced Configuration">
                        <div className="space-y-4">
                            <p className="text-sm text-secondary-500">
                                Advanced model configuration and hyperparameters. This section will be populated based on the selected model type and algorithm.
                            </p>

                            <div className="bg-secondary-50 p-4 rounded-md">
                                <p className="text-sm text-secondary-500 italic">
                                    This section would typically include algorithm-specific hyperparameters such as learning rate, number of estimators,
                                    regularization parameters, etc. For this demo, it's left as a placeholder.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/ml/models')}
                            disabled={saveMutation.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={saveMutation.isLoading}
                            disabled={saveMutation.isLoading || !formik.isValid}
                        >
                            <FiSave className="mr-2 h-4 w-4" />
                            {isEditMode ? 'Update Model' : 'Save Model'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MLModelForm;