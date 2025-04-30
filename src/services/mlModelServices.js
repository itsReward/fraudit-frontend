// src/services/mlModelService.js
import {
    getModels,
    getModelById,
    createModel,
    updateModel,
    activateModel,
    deactivateModel,
    deleteModel,
    getPredictionsByStatementId,
    performPrediction,
    prepareMLFeatures
} from '../api/ml';
import { handleApiResponse } from '../utils/apiUtils';

/**
 * Fetch ML models with filters
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} - ML models data
 */
export const fetchModels = async (params = {}) => {
    return handleApiResponse(
        async () => {
            const response = await getModels(params);
            // The API response format shows data directly in response.data.data without content property
            return response.data.data;
        }
    );
};

/**
 * Fetch a single ML model
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - ML model data
 */
export const fetchModelById = async (id) => {
    return handleApiResponse(
        async () => {
            const response = await getModelById(id);
            return response.data.data;
        }
    );
};

/**
 * Create a new ML model
 * @param {Object} modelData - Model configuration data
 * @returns {Promise<Object>} - Created model data
 */
export const createNewModel = async (modelData) => {
    return handleApiResponse(
        async () => {
            const response = await createModel(modelData);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: 'ML model created successfully'
        }
    );
};

/**
 * Update an existing ML model
 * @param {number} id - Model ID
 * @param {Object} modelData - Updated model data
 * @returns {Promise<Object>} - Updated model data
 */
export const updateExistingModel = async (id, modelData) => {
    return handleApiResponse(
        async () => {
            const response = await updateModel(id, modelData);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: 'ML model updated successfully'
        }
    );
};

/**
 * Toggle model activation
 * @param {number} id - Model ID
 * @param {boolean} activate - Whether to activate or deactivate
 * @returns {Promise<Object>} - Updated model data
 */
export const toggleModelActivation = async (id, activate) => {
    return handleApiResponse(
        async () => {
            const response = activate ?
                await activateModel(id) :
                await deactivateModel(id);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: activate ?
                'Model activated successfully' :
                'Model deactivated successfully'
        }
    );
};

/**
 * Delete an ML model
 * @param {number} id - Model ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteExistingModel = async (id) => {
    return handleApiResponse(
        async () => {
            const response = await deleteModel(id);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: 'ML model deleted successfully'
        }
    );
};

/**
 * Get predictions for a financial statement
 * @param {number} statementId - Financial statement ID
 * @returns {Promise<Object>} - Prediction data
 */
export const fetchPredictionsForStatement = async (statementId) => {
    return handleApiResponse(
        async () => {
            const response = await getPredictionsByStatementId(statementId);
            return response.data.data;
        }
    );
};

/**
 * Run prediction on a financial statement
 * @param {number} statementId - Financial statement ID
 * @returns {Promise<Object>} - Prediction results
 */
export const runPrediction = async (statementId) => {
    return handleApiResponse(
        async () => {
            const response = await performPrediction(statementId);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: 'Prediction completed successfully'
        }
    );
};

/**
 * Prepare features for ML prediction
 * @param {number} statementId - Financial statement ID
 * @returns {Promise<Object>} - Prepared features
 */
export const prepareFeaturesForPrediction = async (statementId) => {
    return handleApiResponse(
        async () => {
            const response = await prepareMLFeatures(statementId);
            return response.data.data;
        }
    );
};

/**
 * Format ML model type for display
 * @param {string} type - Model type
 * @returns {string} - Formatted type
 */
export const formatModelType = (type) => {
    if (!type) return 'Unknown';

    // Convert SNAKE_CASE to Title Case
    return type.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Parse hyperparameters from string to object
 * @param {string|Object} hyperparameters - Hyperparameters
 * @returns {Object} - Parsed hyperparameters
 */
export const parseHyperparameters = (hyperparameters) => {
    if (!hyperparameters) return {};

    if (typeof hyperparameters === 'object') return hyperparameters;

    try {
        return JSON.parse(hyperparameters);
    } catch (e) {
        console.error('Error parsing hyperparameters:', e);
        return {};
    }
};

/**
 * Get default hyperparameters for model type
 * @param {string} modelType - Model type
 * @returns {Object} - Default hyperparameters
 */
export const getDefaultHyperparameters = (modelType) => {
    switch (modelType) {
        case 'RANDOM_FOREST':
            return {
                n_estimators: '100',
                max_depth: '10',
                criterion: 'gini'
            };
        case 'LOGISTIC_REGRESSION':
            return {
                C: '1.0',
                penalty: 'l2',
                solver: 'liblinear'
            };
        case 'NEURAL_NETWORK':
            return {
                hidden_layers: '64,32',
                activation: 'relu',
                learning_rate: '0.001'
            };
        case 'SVM':
            return {
                kernel: 'rbf',
                C: '1.0',
                gamma: 'scale'
            };
        case 'ENSEMBLE':
            return {
                base_models: 'RANDOM_FOREST,LOGISTIC_REGRESSION',
                voting: 'soft'
            };
        default:
            return {};
    }
};

export default {
    fetchModels,
    fetchModelById,
    createNewModel,
    updateExistingModel,
    toggleModelActivation,
    deleteExistingModel,
    fetchPredictionsForStatement,
    runPrediction,
    prepareFeaturesForPrediction,
    formatModelType,
    parseHyperparameters,
    getDefaultHyperparameters
};