// src/hooks/useNotifications.js
import { useContext } from 'react';
import NotificationsContext from '../contexts/NotificationsContext';

export const useNotifications = () => {
    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }

    return context;
};

export default useNotifications;