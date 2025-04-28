// src/components/alerts/AlertResolveForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import alertsService from '../../services/alertsService';

const AlertResolveForm = ({ alertId, alertData, isOpen, onClose, onSuccess }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form validation schema
    const validationSchema = Yup.object({
        resolutionNotes: Yup.string()
            .required('Resolution notes are required')
            .min(10, 'Resolution notes must be at least 10 characters')
            .max(1000, 'Resolution notes must be at most 1000 characters')
    });

    // Initialize form
    const formik = useFormik({
        initialValues: {
            resolutionNotes: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            setError(null);

            try {
                await alertsService.resolveAlert(alertId, values.resolutionNotes);

                // Reset form
                formik.resetForm();

                // Close modal and trigger success callback
                onClose();
                if (onSuccess) {
                    onSuccess();
                }

                // Navigate back to alerts list if no onSuccess handler
                if (!onSuccess) {
                    navigate('/risk/alerts');
                }
            } catch (err) {
                setError(err.message || 'Failed to resolve alert');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Resolve Alert"
            size="md"
        >
            <div className="space-y-4">
                {/* Alert Info */}
                {alertData && (
                    <div className="bg-secondary-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-secondary-900">
                            {alertData.companyName}: {alertData.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                            Alert ID: {alertId} • Severity: {alertData.severity}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="text-sm text-danger-600 bg-danger-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="resolutionNotes" className="block text-sm font-medium text-secondary-700 mb-1">
                                Resolution Notes *
                            </label>
                            <textarea
                                id="resolutionNotes"
                                name="resolutionNotes"
                                rows={4}
                                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                    formik.touched.resolutionNotes && formik.errors.resolutionNotes
                                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                                }`}
                                placeholder="Provide details about how this alert was investigated and resolved..."
                                value={formik.values.resolutionNotes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.resolutionNotes && formik.errors.resolutionNotes && (
                                <p className="mt-1 text-sm text-danger-600">{formik.errors.resolutionNotes}</p>
                            )}
                        </div>

                        <div className="text-xs text-secondary-500">
                            <p>Resolution notes should include:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-0.5">
                                <li>Steps taken to investigate the alert</li>
                                <li>Findings from your investigation</li>
                                <li>Justification for resolving the alert</li>
                                <li>Any follow-up actions that were taken or should be taken</li>
                            </ul>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                <FiX className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={submitting}
                                disabled={submitting || !formik.isValid}
                            >
                                <FiCheckCircle className="mr-2 h-4 w-4" />
                                Resolve Alert
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AlertResolveForm;