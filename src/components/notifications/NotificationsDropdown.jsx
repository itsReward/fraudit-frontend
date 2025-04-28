// src/components/notifications/NotificationsDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiX, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { formatDateTime } from '../../utils/dataUtils';
import { useNotifications } from '../../hooks/useNotifications';
import Loading from '../common/Loading';

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Refresh notifications when dropdown is opened
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (id) => {
        markAsRead(id);
    };

    // Get icon based on notification type or severity
    const getNotificationIcon = (notification) => {
        // First check the type
        switch (notification.type) {
            case 'INFO':
                return <FiInfo className="h-5 w-5 text-primary-500" />;
            case 'SUCCESS':
                return <FiCheckCircle className="h-5 w-5 text-success-500" />;
            case 'WARNING':
                return <FiAlertTriangle className="h-5 w-5 text-warning-500" />;
            case 'DANGER':
                return <FiAlertCircle className="h-5 w-5 text-danger-500" />;
            default:
                // If no specific type, fall back to severity
                switch (notification.severity) {
                    case 'HIGH':
                    case 'VERY_HIGH':
                        return <FiAlertCircle className="h-5 w-5 text-danger-500" />;
                    case 'MEDIUM':
                        return <FiAlertTriangle className="h-5 w-5 text-warning-500" />;
                    case 'LOW':
                        return <FiInfo className="h-5 w-5 text-success-500" />;
                    default:
                        return <FiInfo className="h-5 w-5 text-primary-500" />;
                }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="p-1 rounded-full text-secondary-400 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <FiBell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-danger-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-secondary-200 flex justify-between items-center">
                            <p className="text-sm font-medium text-secondary-900">Notifications</p>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary-600 hover:text-primary-800"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="px-4 py-3 text-center">
                                <Loading size="sm" color="primary" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-secondary-500 text-center">
                                No new notifications
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        to={notification.link || '#'}
                                        className={`block hover:bg-secondary-50 ${
                                            !notification.read ? 'bg-primary-50' : ''
                                        }`}
                                        onClick={() => handleNotificationClick(notification.id)}
                                    >
                                        <div className="px-4 py-3">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification)}
                                                </div>
                                                <div className="ml-3 w-0 flex-1">
                                                    <p className="text-sm font-medium text-secondary-900">
                                                        {notification.companyName && (
                                                            <span className="font-semibold">{notification.companyName}: </span>
                                                        )}
                                                        {notification.message}
                                                    </p>
                                                    <p className="mt-1 text-xs text-secondary-500">
                                                        {formatDateTime(notification.timestamp)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="ml-3 flex-shrink-0">
                                                        <span className="inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-secondary-200">
                            <Link
                                to="/risk/alerts"
                                className="block px-4 py-2 text-sm text-center text-primary-600 hover:bg-secondary-50"
                                onClick={() => setIsOpen(false)}
                            >
                                View all alerts
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;