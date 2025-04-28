// src/services/alertsService.js
import { getRiskAlerts, getRiskAlertById, resolveRiskAlert } from '../api/risk';
import { handleApiResponse } from '../utils/apiUtils';

/**
 * Fetch alerts with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Formatted alerts data
 */
export const fetchAlerts = async (params) => {
    return handleApiResponse(
        async () => {
            const response = await getRiskAlerts(params);
            const alerts = response.data.data;

            // Format the response if needed
            return {
                alerts: alerts.content || [],
                pagination: {
                    page: alerts.page,
                    size: alerts.size,
                    totalElements: alerts.totalElements,
                    totalPages: alerts.totalPages
                }
            };
        }
    );
};

/**
 * Fetch a single alert by ID
 * @param {number} id - Alert ID
 * @returns {Promise<Object>} - Alert data
 */
export const fetchAlertById = async (id) => {
    return handleApiResponse(
        async () => {
            const response = await getRiskAlertById(id);
            return response.data.data;
        }
    );
};

/**
 * Resolve an alert
 * @param {number} id - Alert ID
 * @param {string} resolutionNotes - Resolution notes
 * @returns {Promise<Object>} - Updated alert data
 */
export const resolveAlert = async (id, resolutionNotes) => {
    return handleApiResponse(
        async () => {
            const response = await resolveRiskAlert(id, resolutionNotes);
            return response.data.data;
        },
        {
            showSuccessToast: true,
            successMessage: 'Alert resolved successfully'
        }
    );
};

/**
 * Format alert severity for display
 * @param {string} severity - Alert severity
 * @returns {Object} - Formatted severity with color and label
 */
export const formatAlertSeverity = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'VERY_HIGH':
            return { color: 'danger', label: 'Very High' };
        case 'HIGH':
            return { color: 'danger', label: 'High' };
        case 'MEDIUM':
            return { color: 'warning', label: 'Medium' };
        case 'LOW':
            return { color: 'success', label: 'Low' };
        default:
            return { color: 'secondary', label: severity || 'Unknown' };
    }
};

/**
 * Format alert type for display
 * @param {string} alertType - Alert type
 * @returns {Object} - Formatted type with icon and label
 */
export const formatAlertType = (alertType) => {
    switch (alertType) {
        case 'Z_SCORE_DISTRESS':
            return { icon: 'chart', label: 'Z-Score Distress' };
        case 'M_SCORE_HIGH':
            return { icon: 'alert-triangle', label: 'M-Score Issue' };
        case 'F_SCORE_LOW':
            return { icon: 'trending-down', label: 'F-Score Issue' };
        case 'RATIO_ANOMALY':
            return { icon: 'bar-chart', label: 'Ratio Anomaly' };
        case 'ACCRUAL_RATIO_HIGH':
            return { icon: 'activity', label: 'High Accrual Ratio' };
        case 'REVENUE_GROWTH_ANOMALY':
            return { icon: 'trending-up', label: 'Revenue Growth Anomaly' };
        case 'ASSET_GROWTH_ANOMALY':
            return { icon: 'layers', label: 'Asset Growth Anomaly' };
        default:
            return { icon: 'alert-circle', label: alertType?.replace(/_/g, ' ') || 'Unknown' };
    }
};

export default {
    fetchAlerts,
    fetchAlertById,
    resolveAlert,
    formatAlertSeverity,
    formatAlertType
};