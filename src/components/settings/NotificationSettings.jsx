// src/components/settings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { FiSave, FiBell, FiBellOff } from 'react-icons/fi';
import notificationService from '../../services/notificationService';

const NotificationSettings = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Load saved preferences from localStorage
    const loadSavedPreferences = () => {
        try {
            const savedPrefs = localStorage.getItem('notification_preferences');
            if (savedPrefs) {
                return JSON.parse(savedPrefs);
            }
        } catch (err) {
            console.error('Error loading notification preferences:', err);
        }

        // Default preferences
        return {
            enabled: true,
            showToasts: true,
            desktopNotifications: false,
            emailNotifications: false,
            emailFrequency: 'daily',
            highPriorityOnly: false,
            severityLevels: {
                veryHigh: true,
                high: true,
                medium: true,
                low: true
            },
            notificationTypes: {
                financialRatios: true,
                zScore: true,
                mScore: true,
                fScore: true,
                mlPredictions: true,
                systemAlerts: true
            }
        };
    };

    // Validation schema
    const validationSchema = Yup.object({
        enabled: Yup.boolean(),
        showToasts: Yup.boolean(),
        desktopNotifications: Yup.boolean(),
        emailNotifications: Yup.boolean(),
        emailFrequency: Yup.string()
            .oneOf(['immediate', 'hourly', 'daily', 'weekly'], 'Invalid email frequency'),
        highPriorityOnly: Yup.boolean(),
        severityLevels: Yup.object({
            veryHigh: Yup.boolean(),
            high: Yup.boolean(),
            medium: Yup.boolean(),
            low: Yup.boolean()
        }),
        notificationTypes: Yup.object({
            financialRatios: Yup.boolean(),
            zScore: Yup.boolean(),
            mScore: Yup.boolean(),
            fScore: Yup.boolean(),
            mlPredictions: Yup.boolean(),
            systemAlerts: Yup.boolean()
        })
    });

    // Initialize form with saved preferences
    const formik = useFormik({
        initialValues: loadSavedPreferences(),
        validationSchema,
        onSubmit: (values) => {
            try {
                // Save preferences to localStorage
                localStorage.setItem('notification_preferences', JSON.stringify(values));

                // Show success message
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);

                // Reset error state
                setError(null);
            } catch (err) {
                setError('Failed to save notification preferences');
                console.error('Error saving notification preferences:', err);
            }
        }
    });

    // Create a test notification when user changes settings
    const handleTestNotification = () => {
        // Only if notifications are enabled
        if (!formik.values.enabled) {
            setError('Enable notifications to test them');
            return;
        }

        // Find the highest severity level that's enabled
        let testSeverity = 'MEDIUM';
        if (formik.values.severityLevels.veryHigh || formik.values.severityLevels.high) {
            testSeverity = 'HIGH';
        } else if (formik.values.severityLevels.medium) {
            testSeverity = 'MEDIUM';
        } else if (formik.values.severityLevels.low) {
            testSeverity = 'LOW';
        }

        // Create a demo notification
        notificationService.createDemoNotification(testSeverity);
    };

    return (
        <Card
            title="Notification Settings"
            subtitle="Manage how you receive alerts and notifications"
        >
            {success && (
                <Alert
                    variant="success"
                    title="Settings Saved"
                    dismissible
                    onDismiss={() => setSuccess(false)}
                    className="mb-4"
                >
                    Your notification preferences have been saved successfully.
                </Alert>
            )}

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

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* General notification settings */}
                <div>
                    <h3 className="text-lg font-medium text-secondary-900">General Settings</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="enabled"
                                    name="enabled"
                                    type="checkbox"
                                    checked={formik.values.enabled}
                                    onChange={formik.handleChange}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="enabled" className="font-medium text-secondary-900">
                                    Enable notifications
                                </label>
                                <p className="text-secondary-500">Receive alerts about risk factors and system events</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="showToasts"
                                    name="showToasts"
                                    type="checkbox"
                                    checked={formik.values.showToasts}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="showToasts" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Show toast notifications
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Show popup notifications in the application
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="desktopNotifications"
                                    name="desktopNotifications"
                                    type="checkbox"
                                    checked={formik.values.desktopNotifications}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="desktopNotifications" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Desktop notifications
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Receive browser notifications even when the app is in the background
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="emailNotifications"
                                    name="emailNotifications"
                                    type="checkbox"
                                    checked={formik.values.emailNotifications}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="emailNotifications" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Email notifications
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Receive email notifications about important alerts
                                </p>
                            </div>
                        </div>

                        {formik.values.emailNotifications && formik.values.enabled && (
                            <div className="pl-7">
                                <label htmlFor="emailFrequency" className="block text-sm font-medium text-secondary-700">
                                    Email Frequency
                                </label>
                                <select
                                    id="emailFrequency"
                                    name="emailFrequency"
                                    value={formik.values.emailFrequency}
                                    onChange={formik.handleChange}
                                    className="mt-1 block w-full rounded-md border-secondary-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                >
                                    <option value="immediate">Immediate</option>
                                    <option value="hourly">Hourly Digest</option>
                                    <option value="daily">Daily Digest</option>
                                    <option value="weekly">Weekly Digest</option>
                                </select>
                            </div>
                        )}

                        <div className="flex items-start pt-4">
                            <div className="flex items-center h-5">
                                <input
                                    id="highPriorityOnly"
                                    name="highPriorityOnly"
                                    type="checkbox"
                                    checked={formik.values.highPriorityOnly}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="highPriorityOnly" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    High priority only
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Only receive notifications for high priority alerts
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Severity levels */}
                <div className="pt-4 border-t border-secondary-200">
                    <h3 className="text-lg font-medium text-secondary-900">Severity Levels</h3>
                    <p className="text-sm text-secondary-500 mt-1">
                        Choose which severity levels you want to be notified about
                    </p>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="severityLevels.veryHigh"
                                    name="severityLevels.veryHigh"
                                    type="checkbox"
                                    checked={formik.values.severityLevels.veryHigh}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="severityLevels.veryHigh" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Very High Severity
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Critical issues requiring immediate attention
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="severityLevels.high"
                                    name="severityLevels.high"
                                    type="checkbox"
                                    checked={formik.values.severityLevels.high}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="severityLevels.high" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    High Severity
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Significant issues that should be addressed soon
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="severityLevels.medium"
                                    name="severityLevels.medium"
                                    type="checkbox"
                                    checked={formik.values.severityLevels.medium}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="severityLevels.medium" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Medium Severity
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Moderate issues that should be monitored
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="severityLevels.low"
                                    name="severityLevels.low"
                                    type="checkbox"
                                    checked={formik.values.severityLevels.low}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="severityLevels.low" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Low Severity
                                </label>
                                <p className={formik.values.enabled ? 'text-secondary-500' : 'text-secondary-400'}>
                                    Minor issues or informational alerts
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification types */}
                <div className="pt-4 border-t border-secondary-200">
                    <h3 className="text-lg font-medium text-secondary-900">Notification Types</h3>
                    <p className="text-sm text-secondary-500 mt-1">
                        Select which types of notifications you want to receive
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.financialRatios"
                                    name="notificationTypes.financialRatios"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.financialRatios}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.financialRatios" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Financial Ratio Anomalies
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.zScore"
                                    name="notificationTypes.zScore"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.zScore}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.zScore" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    Z-Score Alerts
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.mScore"
                                    name="notificationTypes.mScore"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.mScore}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.mScore" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    M-Score Alerts
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.fScore"
                                    name="notificationTypes.fScore"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.fScore}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.fScore" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    F-Score Alerts
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.mlPredictions"
                                    name="notificationTypes.mlPredictions"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.mlPredictions}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.mlPredictions" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    ML Prediction Alerts
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="notificationTypes.systemAlerts"
                                    name="notificationTypes.systemAlerts"
                                    type="checkbox"
                                    checked={formik.values.notificationTypes.systemAlerts}
                                    onChange={formik.handleChange}
                                    disabled={!formik.values.enabled}
                                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="notificationTypes.systemAlerts" className={`font-medium ${formik.values.enabled ? 'text-secondary-900' : 'text-secondary-400'}`}>
                                    System Alerts
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-secondary-200 flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={!formik.values.enabled}
                        onClick={handleTestNotification}
                    >
                        <FiBell className="mr-2 h-4 w-4" />
                        Test Notification
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={formik.isSubmitting}
                    >
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default NotificationSettings;