// src/hooks/useMLModels.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import mlModelService from '../services/mlModelService';

/**
 * Hook for working with ML models
 * @returns {Object} - Methods and state for ML models
 */
export const useMLModels = () => {
    const queryClient = useQueryClient();

    // Fetch ML models with optional filters
    const getModels = (params = {}) => {
        return useQuery(
            ['mlModels', params],
            () => mlModelService.fetchModels(params),
            {
                keepPreviousData: true,
                staleTime: 30000 // 30 seconds
            }
        );
    };

    // Fetch a single ML model by ID
    const getModelById = (id) => {
        return useQuery(
            ['mlModel', id],
            () => mlModelService.fetchModelById(id),
            {
                enabled: !!id
            }
        );
    };

    // Create a new ML model
    const createModel = () => {
        return useMutation(
            (modelData) => mlModelService.createNewModel(modelData),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('mlModels');
                }
            }
        );
    };

    // Update an existing ML model
    const updateModel = () => {
        return useMutation(
            ({id, data}) => mlModelService.updateExistingModel(id, data),
            {
                onSuccess: (data, variables) => {
                    queryClient.invalidateQueries('mlModels');
                    queryClient.invalidateQueries(['mlModel', variables.id]);
                }
            }
        );
    };

    // Toggle model activation status
    const toggleActivation = () => {
        return useMutation(
            ({id, activate}) => mlModelService.toggleModelActivation(id, activate),
            {
                onSuccess: (data, variables) => {
                    queryClient.invalidateQueries('mlModels');
                    queryClient.invalidateQueries(['mlModel', variables.id]);
                }
            }
        );
    };

    // Delete a model
    const deleteModel = () => {
        return useMutation(
            (id) => mlModelService.deleteExistingModel(id),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('mlModels');
                }
            }
        );
    };

    // Get predictions for a statement
    const getPredictions = (statementId) => {
        return useQuery(
            ['mlPredictions', statementId],
            () => mlModelService.fetchPredictionsForStatement(statementId),
            {
                enabled: !!statementId
            }
        );
    };

    // Run prediction on a statement
    const runPrediction = () => {
        return useMutation(
            (statementId) => mlModelService.runPrediction(statementId),
            {
                onSuccess: (data, statementId) => {
                    queryClient.invalidateQueries(['mlPredictions', statementId]);
                }
            }
        );
    };

    // Helper method to format model type for display
    const formatModelType = (type) => {
        return mlModelService.formatModelType(type);
    };

    // Helper method to parse hyperparameters
    const parseHyperparameters = (hyperparameters) => {
        return mlModelService.parseHyperparameters(hyperparameters);
    };

    // Helper method to get default hyperparameters
    const getDefaultHyperparameters = (modelType) => {
        return mlModelService.getDefaultHyperparameters(modelType);
    };

    return {
        getModels,
        getModelById,
        createModel,
        updateModel,
        toggleActivation,
        deleteModel,
        getPredictions,
        runPrediction,
        formatModelType,
        parseHyperparameters,
        getDefaultHyperparameters
    };
};

export default useMLModels;