// src/services/notificationService.js
import { getRecentRiskAlerts } from '../api/risk';

/**
 * Real-time notification service
 * In a real application, this would use WebSockets or Server-Sent Events
 * For our demo, we'll simulate with polling and localStorage to track seen notifications
 */
class NotificationService {
    constructor() {
        this.listeners = [];
        this.isPolling = false;
        this.pollingInterval = 30000; // 30 seconds
        this.intervalId = null;
        this.seenNotificationsKey = 'fraudit_seen_notifications';
    }

    /**
     * Initialize the service and start polling if authenticated
     * @param {boolean} isAuthenticated - Whether the user is authenticated
     */
    initialize(isAuthenticated) {
        if (isAuthenticated && !this.isPolling) {
            this.startPolling();
        } else if (!isAuthenticated && this.isPolling) {
            this.stopPolling();
        }
    }

    /**
     * Start polling for new notifications
     */
    startPolling() {
        this.isPolling = true;

        // Check immediately on start
        this.checkForNewNotifications();

        // Then set up interval
        this.intervalId = setInterval(() => {
            this.checkForNewNotifications();
        }, this.pollingInterval);

        console.log('Notification polling started');
    }

    /**
     * Stop polling for notifications
     */
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPolling = false;
        console.log('Notification polling stopped');
    }

    /**
     * Check for new notifications by comparing with previously seen ones
     */
    async checkForNewNotifications() {
        try {
            const response = await getRecentRiskAlerts(5);
            const alerts = response.data.data || [];

            // Get IDs of previously seen notifications
            const seenNotifications = this.getSeenNotifications();

            // Filter for new notifications
            const newNotifications = alerts.filter(alert => !seenNotifications.includes(alert.alertId));

            if (newNotifications.length > 0) {
                // Mark these as seen
                this.markAsSeen(newNotifications.map(n => n.alertId));

                // Format and notify listeners
                const formattedNotifications = newNotifications.map(alert => ({
                    id: alert.alertId,
                    type: this.getSeverityType(alert.severity),
                    title: `New ${alert.severity} Alert`,
                    message: alert.message,
                    companyName: alert.companyName,
                    severity: alert.severity,
                    timestamp: alert.createdAt,
                    read: false,
                    link: `/risk/alerts/${alert.alertId}`
                }));

                this.notifyListeners(formattedNotifications);
            }
        } catch (error) {
            console.error('Error checking for notifications:', error);
        }
    }

    /**
     * Convert severity to notification type
     * @param {string} severity - Alert severity
     * @returns {string} - Notification type
     */
    getSeverityType(severity) {
        switch (severity?.toUpperCase()) {
            case 'VERY_HIGH':
            case 'HIGH':
                return 'DANGER';
            case 'MEDIUM':
                return 'WARNING';
            case 'LOW':
                return 'INFO';
            default:
                return 'INFO';
        }
    }

    /**
     * Get previously seen notification IDs from localStorage
     * @returns {Array<string|number>} - Array of seen notification IDs
     */
    getSeenNotifications() {
        try {
            const stored = localStorage.getItem(this.seenNotificationsKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting seen notifications:', error);
            return [];
        }
    }

    /**
     * Mark notifications as seen in localStorage
     * @param {Array<string|number>} ids - Notification IDs to mark as seen
     */
    markAsSeen(ids) {
        try {
            const seenNotifications = this.getSeenNotifications();
            const updatedSeen = [...new Set([...seenNotifications, ...ids])];

            // Limit storage to last 100 notifications to prevent excessive growth
            const limitedSeen = updatedSeen.slice(-100);

            localStorage.setItem(this.seenNotificationsKey, JSON.stringify(limitedSeen));
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
        }
    }

    /**
     * Add a notification listener
     * @param {Function} listener - Callback function for new notifications
     * @returns {Function} - Function to remove the listener
     */
    addListener(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);

            // Return function to remove this listener
            return () => {
                this.listeners = this.listeners.filter(l => l !== listener);
            };
        }
        return () => {}; // No-op if not a function
    }

    /**
     * Notify all listeners of new notifications
     * @param {Array<Object>} notifications - New notifications
     */
    notifyListeners(notifications) {
        if (notifications.length === 0) return;

        this.listeners.forEach(listener => {
            try {
                listener(notifications);
            } catch (error) {
                console.error('Error in notification listener:', error);
            }
        });
    }

    /**
     * Create a demo notification for testing
     * @param {string} severity - Alert severity (HIGH, MEDIUM, LOW)
     * @returns {Object} - Created notification
     */
    createDemoNotification(severity = 'MEDIUM') {
        const companies = ['ABC Corporation', 'XYZ Enterprises', 'Global Mining Ltd', 'Tech Solutions Inc.'];
        const messageTemplates = {
            HIGH: [
                'Potential earnings manipulation detected',
                'Significant discrepancy in financial statements',
                'Unusual pattern in revenue recognition',
                'High risk indicators in cash flow statements'
            ],
            MEDIUM: [
                'Unusual ratio variations detected',
                'Moderate anomalies in financial reporting',
                'Unexpected changes in accounting methods',
                'Asset growth inconsistencies identified'
            ],
            LOW: [
                'Minor inconsistency detected in financial reporting',
                'Small deviation from expected ratios',
                'Slight irregularity in expense reporting',
                'Non-critical anomaly identified'
            ]
        };

        const company = companies[Math.floor(Math.random() * companies.length)];
        const messages = messageTemplates[severity] || messageTemplates.MEDIUM;
        const message = messages[Math.floor(Math.random() * messages.length)];

        const notification = {
            id: Date.now(),
            type: this.getSeverityType(severity),
            title: `New ${severity} Alert`,
            message: `${message} for ${company}`,
            companyName: company,
            severity: severity,
            timestamp: new Date().toISOString(),
            read: false,
            link: `/risk/alerts/${Date.now()}`
        };

        // Notify listeners
        this.notifyListeners([notification]);

        return notification;
    }

    /**
     * Manually trigger a notification (for testing)
     * @param {Object} notification - Notification object
     */
    triggerNotification(notification) {
        this.notifyListeners([notification]);
    }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;