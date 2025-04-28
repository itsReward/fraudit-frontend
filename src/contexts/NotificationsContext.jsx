// src/contexts/NotificationsContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getRecentRiskAlerts } from '../api/risk';
import { useAuth } from '../hooks/useAuth';
import notificationService from '../services/notificationService';

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications from the API
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getRecentRiskAlerts(10); // Get 10 most recent alerts

            // Format notifications from alerts
            const formattedNotifications = response.data.data.map(alert => ({
                id: alert.alertId,
                type: getAlertType(alert.severity),
                message: alert.message,
                companyName: alert.companyName,
                severity: alert.severity,
                timestamp: alert.createdAt,
                read: alert.isResolved || false,
                link: `/risk/alerts/${alert.alertId}`
            }));

            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Convert severity to notification type
    const getAlertType = (severity) => {
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
    };

    // Add a new notification
    const addNotification = useCallback((notification) => {
        setNotifications(prev => [
            {
                id: notification.id || Date.now(),
                timestamp: notification.timestamp || new Date().toISOString(),
                read: false,
                ...notification
            },
            ...prev
        ]);
        setUnreadCount(prev => prev + 1);
    }, []);

    // Mark a notification as read
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Initialize notification service when authentication status changes
    useEffect(() => {
        notificationService.initialize(isAuthenticated);

        if (isAuthenticated) {
            fetchNotifications();
        }

        return () => {
            if (isAuthenticated) {
                notificationService.stopPolling();
            }
        };
    }, [isAuthenticated, fetchNotifications]);

    // Set up listener for real-time notifications
    useEffect(() => {
        if (!isAuthenticated) return;

        const removeListener = notificationService.addListener((newNotifications) => {
            if (newNotifications.length > 0) {
                setNotifications(prev => [
                    ...newNotifications,
                    ...prev
                ]);
                setUnreadCount(prev => prev + newNotifications.length);
            }
        });

        return () => removeListener();
    }, [isAuthenticated]);

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationsContext;