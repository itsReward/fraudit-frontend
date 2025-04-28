// src/components/notifications/NotificationToast.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotificationToast = ({ notification, onClose, autoClose = true, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    onClose && onClose(notification.id);
                }, 300); // Wait for fade out animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, notification.id, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose && onClose(notification.id);
        }, 300); // Wait for fade out animation
    };

    // Get variant based on notification type or severity
    const getVariant = () => {
        // First check the type
        switch (notification.type) {
            case 'SUCCESS':
                return 'success';
            case 'WARNING':
                return 'warning';
            case 'DANGER':
                return 'danger';
            case 'INFO':
                return 'info';
            default:
                // If no specific type, fall back to severity
                switch (notification.severity) {
                    case 'HIGH':
                    case 'VERY_HIGH':
                        return 'danger';
                    case 'MEDIUM':
                        return 'warning';
                    case 'LOW':
                        return 'success';
                    default:
                        return 'info';
                }
        }
    };

    // Get icon based on variant
    const getIcon = (variant) => {
        switch (variant) {
            case 'success':
                return <FiCheckCircle className="h-5 w-5 text-success-500" />;
            case 'warning':
                return <FiAlertTriangle className="h-5 w-5 text-warning-500" />;
            case 'danger':
                return <FiAlertCircle className="h-5 w-5 text-danger-500" />;
            case 'info':
            default:
                return <FiInfo className="h-5 w-5 text-primary-500" />;
        }
    };

    const variant = getVariant();
    const icon = getIcon(variant);

    const variantClasses = {
        success: 'bg-success-50 border-success-200',
        warning: 'bg-warning-50 border-warning-200',
        danger: 'bg-danger-50 border-danger-200',
        info: 'bg-primary-50 border-primary-200',
    };

    return (
        <div
            className={`
                w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 
                ${variantClasses[variant]}
                transition-opacity duration-300 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
        >
            <div className="p-3">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        {notification.title && (
                            <p className="text-sm font-medium text-secondary-900 line-clamp-1">{notification.title}</p>
                        )}
                        <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
                            {notification.companyName && (
                                <span className="font-semibold">{notification.companyName}: </span>
                            )}
                            {notification.message}
                        </p>
                        {notification.link && (
                            <Link
                                to={notification.link}
                                className="mt-1 text-xs inline-block text-primary-600 hover:text-primary-800"
                            >
                                View details
                            </Link>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;