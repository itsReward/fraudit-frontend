// src/components/notifications/NotificationToastContainer.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const { notifications, markAsRead } = useNotifications();

    // Watch for new unread notifications and create toasts for them
    useEffect(() => {
        const unreadNotifications = notifications.filter(n => !n.read && !toasts.some(t => t.id === n.id));

        if (unreadNotifications.length > 0) {
            setToasts(prevToasts => [
                ...prevToasts,
                ...unreadNotifications.map(notification => ({
                    ...notification,
                    toastId: `toast-${notification.id}-${Date.now()}` // Unique ID for each toast
                }))
            ]);
        }
    }, [notifications, toasts]);

    const removeToast = (id) => {
        markAsRead(id); // Mark the notification as read
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    // Limit the number of visible toasts
    const visibleToasts = toasts.slice(0, 3);

    // Create a portal to render toasts at the root of the document
    return createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-4 max-w-xs w-full">
            {visibleToasts.map(toast => (
                <NotificationToast
                    key={toast.toastId}
                    notification={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>,
        document.body
    );
};

export default NotificationToastContainer;