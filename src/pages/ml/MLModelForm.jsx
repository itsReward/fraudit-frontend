// src/pages/ml/MLModelForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getModelById, createModel, updateModel } from '../../api/ml';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FiSave, FiX } from 'react-icons/fi';

const MLModelForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch model data if in edit mode
    const { data: modelData, isLoading: fetchLoading, error: fetchError } = useQuery(
        ['mlModel', id],
        () => getModelById(id),
        {
            enabled: isEditMode,
            onError: (err) => {
                setError(err.response?.data?.message || 'Failed to fetch model data');
            },
        }
    );

    // Create/Update mutation
    const mutation = useMutation(
        (values) => {
            return isEditMode
                ? updateModel(id, values)
                : createModel(values);
        },
        {
            onSuccess: () => {
                setSuccess(true);
                queryClient.invalidateQueries('mlModels');

                // Redirect after a brief delay to show success message
                setTimeout(() => {
                    navigate('/ml/models');
                }, 1500);
            },
            onError: (err) => {
                setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} ML model`);
            },
        }
    );

    // Form validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Model name is required').max(100, 'Model name must be at most 100 characters'),
        modelType: Yup.string().required('Model type is required'),
        description: Yup.string().max(500, 'Description must be at most 500 characters'),
        features: Yup.array().min(1, 'At least one feature is required'),
        hyperparameters: Yup.object(),
        active: Yup.boolean(),
    });

    // Initialize features state (for adding/removing features)
    const [features, setFeatures] = useState([]);
    const [featureInput, setFeatureInput] = useState('');

    // Initialize form
    const formik = useFormik({
        initialValues: {
            name: '',
            modelType: '',
            description: '',
            features: [],
            hyperparameters: {},
            active: false,
        },
        validationSchema,
        onSubmit: (values) => {
            setError(null);
            setSuccess(false);

            // Format the data for the API
            const formattedValues = {
                ...values,
                features: features,
                hyperparameters: JSON.stringify(values.hyperparameters),
            };

            mutation.mutate(formattedValues);
        },
        enableReinitialize: true,
    });

    // Add a feature to the list
    const addFeature = () => {
        if (featureInput.trim() === '') return;

        if (!features.includes(featureInput.trim())) {
            const updatedFeatures = [...features, featureInput.trim()];
            setFeatures(updatedFeatures);
            formik.setFieldValue('features', updatedFeatures);
        }

        setFeatureInput('');
    };

    // Remove a feature from the list
    const removeFeature = (feature) => {
        const updatedFeatures = features.filter(f => f !== feature);
        setFeatures(updatedFeatures);
        formik.setFieldValue('features', updatedFeatures);
    };

    // Handle hyperparameter changes
    const [hyperParams, setHyperParams] = useState({
        n_estimators: '100',
        max_depth: '10',
        criterion: 'gini',
    });

    const updateHyperParameter = (key, value) => {
        const updatedParams = { ...hyperParams, [key]: value };
        setHyperParams(updatedParams);
        formik.setFieldValue('hyperparameters', updatedParams);
    };

    // Update form values when model data is fetched in edit mode
    useEffect(() => {
        if (isEditMode && modelData?.data?.data) {
            const model = modelData.data.data;

            // Parse features and hyperparameters
            let parsedFeatures = [];
            if (Array.isArray(model.features)) {
                parsedFeatures = model.features;
            } else if (typeof model.features === 'string') {
                try {
                    parsedFeatures = JSON.parse(model.features);
                } catch (e) {
                    parsedFeatures = model.features.split(',').map(f => f.trim());
                }
            }

            let parsedHyperParams = {};
            if (typeof model.hyperparameters === 'string') {
                try {
                    parsedHyperParams = JSON.parse(model.hyperparameters);
                } catch (e) {
                    console.error('Error parsing hyperparameters:', e);
                    parsedHyperParams = {};
                }
            } else if (typeof model.hyperparameters === 'object') {
                parsedHyperParams = model.hyperparameters;
            }

            // Set form values
            formik.setValues({
                name: model.name || '',
                modelType: model.modelType || '',
                description: model.description || '',
                features: parsedFeatures,
                hyperparameters: parsedHyperParams,
                active: model.active || false,
            });

            // Update local state
            setFeatures(parsedFeatures);
            setHyperParams(parsedHyperParams);
        }
    }, [isEditMode, modelData, formik.setValues]);

    // Get hyperparameter fields based on model type
    const getHyperParameterFields = () => {
        switch (formik.values.modelType) {
            case 'RANDOM_FOREST':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="n_estimators" className="block text-sm font-medium text-secondary-700">
                                Number of Estimators
                            </label>
                            <input
                                type="number"
                                id="n_estimators"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.n_estimators || '100'}
                                onChange={(e) => updateHyperParameter('n_estimators', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="max_depth" className="block text-sm font-medium text-secondary-700">
                                Max Depth
                            </label>
                            <input
                                type="number"
                                id="max_depth"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.max_depth || '10'}
                                onChange={(e) => updateHyperParameter('max_depth', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="criterion" className="block text-sm font-medium text-secondary-700">
                                Criterion
                            </label>
                            <select
                                id="criterion"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.criterion || 'gini'}
                                onChange={(e) => updateHyperParameter('criterion', e.target.value)}
                            >
                                <option value="gini">Gini</option>
                                <option value="entropy">Entropy</option>
                            </select>
                        </div>
                    </div>
                );
            case 'LOGISTIC_REGRESSION':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="C" className="block text-sm font-medium text-secondary-700">
                                Regularization (C)
                            </label>
                            <input
                                type="number"
                                id="C"
                                step="0.01"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.C || '1.0'}
                                onChange={(e) => updateHyperParameter('C', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="penalty" className="block text-sm font-medium text-secondary-700">
                                Penalty
                            </label>
                            <select
                                id="penalty"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.penalty || 'l2'}
                                onChange={(e) => updateHyperParameter('penalty', e.target.value)}
                            >
                                <option value="l1">L1</option>
                                <option value="l2">L2</option>
                                <option value="elasticnet">Elastic Net</option>
                            </select>
                        </div>
                    </div>
                );
            case 'NEURAL_NETWORK':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="hidden_layers" className="block text-sm font-medium text-secondary-700">
                                Hidden Layers
                            </label>
                            <input
                                type="text"
                                id="hidden_layers"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.hidden_layers || '64,32'}
                                onChange={(e) => updateHyperParameter('hidden_layers', e.target.value)}
                                placeholder="e.g., 64,32"
                            />
                            <p className="mt-1 text-xs text-secondary-500">
                                Comma-separated list of nodes in each hidden layer (e.g., 64,32)
                            </p>
                        </div>
                        <div>
                            <label htmlFor="activation" className="block text-sm font-medium text-secondary-700">
                                Activation Function
                            </label>
                            <select
                                id="activation"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.activation || 'relu'}
                                onChange={(e) => updateHyperParameter('activation', e.target.value)}
                            >
                                <option value="relu">ReLU</option>
                                <option value="sigmoid">Sigmoid</option>
                                <option value="tanh">Tanh</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="learning_rate" className="block text-sm font-medium text-secondary-700">
                                Learning Rate
                            </label>
                            <input
                                type="number"
                                id="learning_rate"
                                step="0.001"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.learning_rate || '0.001'}
                                onChange={(e) => updateHyperParameter('learning_rate', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'SVM':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="kernel" className="block text-sm font-medium text-secondary-700">
                                Kernel
                            </label>
                            <select
                                id="kernel"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.kernel || 'rbf'}
                                onChange={(e) => updateHyperParameter('kernel', e.target.value)}
                            >
                                <option value="linear">Linear</option>
                                <option value="rbf">RBF</option>
                                <option value="poly">Polynomial</option>
                                <option value="sigmoid">Sigmoid</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="C" className="block text-sm font-medium text-secondary-700">
                                Regularization (C)
                            </label>
                            <input
                                type="number"
                                id="C"
                                step="0.01"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.C || '1.0'}
                                onChange={(e) => updateHyperParameter('C', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'ENSEMBLE':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="base_models" className="block text-sm font-medium text-secondary-700">
                                Base Models
                            </label>
                            <input
                                type="text"
                                id="base_models"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.base_models || 'RANDOM_FOREST,LOGISTIC_REGRESSION'}
                                onChange={(e) => updateHyperParameter('base_models', e.target.value)}
                                placeholder="e.g., RANDOM_FOREST,LOGISTIC_REGRESSION"
                            />
                            <p className="mt-1 text-xs text-secondary-500">
                                Comma-separated list of model types to include in the ensemble
                            </p>
                        </div>
                        <div>
                            <label htmlFor="voting" className="block text-sm font-medium text-secondary-700">
                                Voting Method
                            </label>
                            <select
                                id="voting"
                                className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={hyperParams.voting || 'soft'}
                                onChange={(e) => updateHyperParameter('voting', e.target.value)}
                            >
                                <option value="hard">Hard Voting</option>
                                <option value="soft">Soft Voting</option>
                            </select>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-secondary-50 p-4 rounded-md">
                        <p className="text-secondary-700 text-sm">
                            Select a model type to configure hyperparameters.
                        </p>
                    </div>
                );
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (fetchError && isEditMode) {
        return (
            <Alert variant="danger" title="Error loading model">
                {error || 'An error occurred while fetching model data. Please try again later.'}
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">
                    {isEditMode ? 'Edit ML Model' : 'Create New ML Model'}
                </h1>
                <p className="mt-1 text-secondary-500">
                    {isEditMode
                        ? 'Update the machine learning model parameters and configuration'
                        : 'Configure a new machine learning model for fraud detection'}
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
                            ? 'ML model updated successfully!'
                            : 'ML model created successfully!'}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                                Model Name*
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
                                placeholder="Enter model name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.name}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="modelType" className="block text-sm font-medium text-secondary-700">
                                Model Type*
                            </label>
                            <select
                                id="modelType"
                                name="modelType"
                                className={`mt-1 block w-full border ${
                                    formik.touched.modelType && formik.errors.modelType
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                                value={formik.values.modelType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select model type</option>
                                <option value="RANDOM_FOREST">Random Forest</option>
                                <option value="LOGISTIC_REGRESSION">Logistic Regression</option>
                                <option value="NEURAL_NETWORK">Neural Network</option>
                                <option value="SVM">Support Vector Machine</option>
                                <option value="ENSEMBLE">Ensemble Model</option>
                            </select>
                            {formik.touched.modelType && formik.errors.modelType ? (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.modelType}</p>
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
                            rows={3}
                            className="mt-1 block w-full border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter model description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <p className="mt-1 text-sm text-danger-600">{formik.errors.description}</p>
                        ) : null}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Features*
                        </label>
                        <div className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 border border-secondary-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Enter feature name"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addFeature();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addFeature}
                            >
                                Add
                            </Button>
                        </div>

                        {formik.touched.features && formik.errors.features ? (
                            <p className="mt-1 text-sm text-danger-600">{formik.errors.features}</p>
                        ) : null}

                        <div className="mt-2 flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center"
                                >
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        className="ml-2 focus:outline-none"
                                        onClick={() => removeFeature(feature)}
                                    >
                                        <FiX className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {features.length === 0 && (
                            <p className="text-sm text-secondary-500 mt-2">
                                No features added yet. Add features the model will use for prediction.
                            </p>
                        )}
                    </div>

                    {/* Hyperparameters Section */}
                    <div>
                        <h3 className="text-sm font-medium text-secondary-700 mb-2">Hyperparameters</h3>
                        {formik.values.modelType ? (
                            getHyperParameterFields()
                        ) : (
                            <div className="bg-secondary-50 p-4 rounded-md">
                                <p className="text-secondary-700 text-sm">
                                    Select a model type to configure hyperparameters.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={formik.values.active}
                            onChange={formik.handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-secondary-700">
                            Activate model immediately after {isEditMode ? 'update' : 'creation'}
                        </label>
                    </div>

                    <div className="border-t border-secondary-200 pt-4">
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/ml/models')}
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
                                {isEditMode ? 'Update Model' : 'Create Model'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default MLModelForm;