// src/pages/risk/AlertDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRiskAlertById } from '../../api/risk';
import AlertDetail from '../../components/alerts/AlertDetail';
import AlertResolveForm from '../../components/alerts/AlertResolveForm';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import alertsService from '../../services/alertsService';

const AlertDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addNotification } = useNotifications();

    const [resolveModalOpen, setResolveModalOpen] = useState(false);

    // Fetch alert data
    const {
        data: alertData,
        isLoading,
        error,
        refetch
    } = useQuery(
        ['alert', id],
        () => getRiskAlertById(id),
        {
            enabled: !!id,
            onError: (err) => {
                console.error('Error fetching alert:', err);
                addNotification({
                    type: 'DANGER',
                    title: 'Error',
                    message: 'Failed to load alert details'
                });
            }
        }
    );

    // Resolve alert mutation
    const resolveMutation = useMutation(
        ({ alertId, resolutionNotes }) => alertsService.resolveAlert(alertId, resolutionNotes),
        {
            onSuccess: () => {
                // Invalidate and refetch alerts data
                queryClient.invalidateQueries(['alerts']);
                queryClient.invalidateQueries(['alert', id]);

                // Show success notification
                addNotification({
                    type: 'SUCCESS',
                    title: 'Alert Resolved',
                    message: 'The alert has been successfully resolved'
                });

                // Close modal
                setResolveModalOpen(false);
            },
            onError: (err) => {
                console.error('Error resolving alert:', err);
                addNotification({
                    type: 'DANGER',
                    title: 'Failed to Resolve Alert',
                    message: err.message || 'An error occurred while resolving the alert'
                });
            }
        }
    );

    // Handle navigate back
    const handleBack = () => {
        navigate('/risk/alerts');
    };

    // Handle resolve click
    const handleResolveClick = () => {
        setResolveModalOpen(true);
    };

    const alert = alertData?.data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    if (error || !alert) {
        return (
            <Alert
                variant="danger"
                title="Error loading alert"
                icon={<FiAlertTriangle className="h-5 w-5" />}
            >
                The alert could not be found or there was an error loading it. Please try again later.
            </Alert>
        );
    }

    return (
        <>
            <AlertDetail
                alert={alert}
                onResolve={handleResolveClick}
                onBack={handleBack}
                loading={resolveMutation.isLoading}
            />

            <AlertResolveForm
                alertId={parseInt(id)}
                alertData={alert}
                isOpen={resolveModalOpen}
                onClose={() => setResolveModalOpen(false)}
                onSuccess={() => refetch()}
            />
        </>
    );
};

export default AlertDetailPage;