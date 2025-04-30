// src/pages/ml/MLModelsList.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getModels, activateModel, deactivateModel, deleteModel } from '../../api/ml';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { FiPlus, FiEdit, FiTrash2, FiPlay, FiPause, FiBarChart2, FiAward } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const MLModelsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterActive, setFilterActive] = useState('');

  // Check permissions for creating/modifying models
  const canEditModels = user && ['ADMIN', 'ANALYST'].includes(user.role);

  // Fetch ML models with filtering
  const { data, isLoading, error } = useQuery(
      ['mlModels', { type: filterType, active: filterActive }],
      () => getModels({ modelType: filterType, active: filterActive === '' ? undefined : filterActive === 'true' }),
      {
        onSuccess: (response) => {
          // Debug log to check response structure
          console.log('ML models response:', response);
        },
        onError: (err) => {
          console.error('Error fetching ML models:', err);
        }
      }
  );

  // Format models from API response
  // Handle both possible response formats - with or without content property
  const models = data?.data?.data?.content || data?.data?.data || [];

  // Activate/deactivate model mutation
  const toggleActivationMutation = useMutation(
      ({ id, activate }) => activate ? activateModel(id) : deactivateModel(id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['mlModels']);
        }
      }
  );

  // Delete model mutation
  const deleteMutation = useMutation(
      (id) => deleteModel(id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['mlModels']);
          setIsDeleteModalOpen(false);
        }
      }
  );

  // Handle model activation toggle
  const handleToggleActivation = (id, currentlyActive) => {
    // Log the action for debugging
    console.log(`Toggling model ${id} activation from ${currentlyActive} to ${!currentlyActive}`);
    toggleActivationMutation.mutate({ id, activate: !currentlyActive });
  };

  // Handle model delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Execute model deletion
  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Format model type for display
  const formatModelType = (type) => {
    if (!type) return 'Unknown';

    // Convert SNAKE_CASE to Title Case
    return type.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format accuracy score for display
  const formatAccuracy = (accuracy) => {
    if (accuracy === undefined || accuracy === null) return 'N/A';

    return `${(accuracy * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="danger" title="Error loading ML models">
          {error.response?.data?.message || 'An error occurred while fetching ML models. Please try again later.'}
        </Alert>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900">Machine Learning Models</h1>
            <p className="mt-1 text-secondary-500">Manage and monitor machine learning models for fraud detection</p>
          </div>

          {canEditModels && (
              <Button
                  to="/ml/models/new"
                  variant="primary"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create New Model
              </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="filterType" className="block text-sm font-medium text-secondary-700 mb-1">
                Model Type
              </label>
              <select
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                <option value="RANDOM_FOREST">Random Forest</option>
                <option value="LOGISTIC_REGRESSION">Logistic Regression</option>
                <option value="NEURAL_NETWORK">Neural Network</option>
                <option value="SVM">SVM</option>
                <option value="ENSEMBLE">Ensemble</option>
              </select>
            </div>

            <div className="w-full md:w-1/3">
              <label htmlFor="filterActive" className="block text-sm font-medium text-secondary-700 mb-1">
                Status
              </label>
              <select
                  id="filterActive"
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="w-full md:w-1/3 md:self-end">
              <Button
                  variant="secondary"
                  onClick={() => {
                    setFilterType('');
                    setFilterActive('');
                  }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Models List */}
        {models.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                  <Card key={model.id} className="h-full flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-1">{model.modelName || model.name}</h3>
                        <div className="flex items-center mb-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            (model.isActive || model.active)
                                                ? 'bg-success-100 text-success-800'
                                                : 'bg-secondary-100 text-secondary-800'
                                        }`}>
                                            {(model.isActive || model.active) ? 'Active' : 'Inactive'}
                                        </span>
                          <span className="ml-2 text-xs text-secondary-500">
                                            {formatModelType(model.modelType)}
                                        </span>
                        </div>
                      </div>

                      {(model.isActive || model.active) && (
                          <div className="flex items-center bg-success-50 px-2 py-1 rounded text-sm">
                            <FiAward className="text-success-500 mr-1" />
                            <span className="text-success-700">In Use</span>
                          </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <p className="text-sm text-secondary-500">Version</p>
                        <span className="text-sm">
                                        { model.modelVersion || 'N/A'}
                                    </span>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Trained</p>
                        <span className="text-sm">
                                        {(model.trainedDate || model.trainedDate) ? new Date(model.trainedDate || model.trainedDate).toLocaleDateString() : 'N/A'}
                                    </span>
                      </div>

                      {(model.description || model.modelDescription) && (
                          <div>
                            <p className="text-sm text-secondary-500">Description</p>
                            <p className="text-sm text-secondary-700 line-clamp-2">
                              {model.description || model.modelDescription}
                            </p>
                          </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-between">
                      <div>
                        <Link to={`/ml/models/performance?modelId=${model.id}`}>
                          <Button
                              variant="outline"
                              size="sm"
                          >
                            <FiBarChart2 className="mr-2 h-4 w-4" />
                            Performance
                          </Button>
                        </Link>
                      </div>

                      {canEditModels && (
                          <div className="flex space-x-2">
                            <Link to={`/ml/models/${model.id}/edit`}>
                              <Button
                                  variant="secondary"
                                  size="sm"
                              >
                                <FiEdit className="h-4 w-4" />
                              </Button>
                            </Link>

                            <Button
                                variant={(model.isActive || model.active) ? "warning" : "success"}
                                size="sm"
                                onClick={() => handleToggleActivation(model.id, model.isActive || model.active)}
                                disabled={toggleActivationMutation.isLoading}
                            >
                              {(model.isActive || model.active) ? (
                                  <FiPause className="h-4 w-4" />
                              ) : (
                                  <FiPlay className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => confirmDelete(model.id)}
                                disabled={deleteMutation.isLoading}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      )}
                    </div>
                  </Card>
              ))}
            </div>
        ) : (
            <Card>
              <div className="py-8 text-center">
                <FiAward className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No ML models found</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  {filterType || filterActive
                      ? 'Try adjusting your filters to find what you\'re looking for.'
                      : 'Get started by creating a new machine learning model.'}
                </p>
                {canEditModels && !filterType && !filterActive && (
                    <div className="mt-6">
                      <Button
                          to="/ml/models/new"
                          variant="primary"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Create New Model
                      </Button>
                    </div>
                )}
              </div>
            </Card>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete ML Model"
            size="sm"
        >
          <div className="space-y-4">
            <p className="text-secondary-700">
              Are you sure you want to delete this ML model? This action cannot be undone.
            </p>

            <div className="bg-warning-50 p-3 rounded-md text-sm text-warning-800">
              <p>
                <strong>Warning:</strong> If this model is currently used for fraud detection,
                deleting it may affect risk assessments and alerts.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                  variant="secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deleteMutation.isLoading}
              >
                Delete Model
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default MLModelsList;