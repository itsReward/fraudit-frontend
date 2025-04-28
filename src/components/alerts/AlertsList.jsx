// src/components/alerts/AlertsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiBarChart2,
    FiTrendingUp,
    FiTrendingDown,
    FiActivity,
    FiLayers,
    FiPieChart
} from 'react-icons/fi';
import { formatDateTime } from '../../utils/dataUtils';
import alertsService from '../../services/alertsService';
import Card from '../common/Card';
import Button from '../common/Button';

const AlertsList = ({ alerts, isLoading, onResolve }) => {
    const getAlertIcon = (alertType) => {
        const { icon } = alertsService.formatAlertType(alertType);

        switch (icon) {
            case 'alert-triangle':
                return <FiAlertTriangle className="h-5 w-5" />;
            case 'chart':
                return <FiPieChart className="h-5 w-5" />;
            case 'bar-chart':
                return <FiBarChart2 className="h-5 w-5" />;
            case 'trending-up':
                return <FiTrendingUp className="h-5 w-5" />;
            case 'trending-down':
                return <FiTrendingDown className="h-5 w-5" />;
            case 'activity':
                return <FiActivity className="h-5 w-5" />;
            case 'layers':
                return <FiLayers className="h-5 w-5" />;
            default:
                return <FiAlertTriangle className="h-5 w-5" />;
        }
    };

    // Show empty state if no alerts
    if (alerts.length === 0 && !isLoading) {
        return (
            <Card>
                <div className="text-center py-8">
                    <FiCheckCircle className="mx-auto h-12 w-12 text-success-500" />
                    <h3 className="mt-2 text-sm font-medium text-secondary-900">No alerts found</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                        There are no alerts matching your criteria.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {alerts.map((alert) => {
                const { color } = alertsService.formatAlertSeverity(alert.severity);
                const { label: typeLabel } = alertsService.formatAlertType(alert.alertType);

                return (
                    <Card key={alert.id} className="hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 p-3 rounded-md bg-${color}-100`}>
                                <div className={`text-${color}-600`}>
                                    {getAlertIcon(alert.alertType)}
                                </div>
                            </div>

                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-secondary-900">
                                        {alert.companyName}
                                    </h3>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                                        {alert.severity}
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-secondary-700">{alert.message}</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <div className="text-xs text-secondary-500">
                                        <span className="font-medium">{typeLabel}</span> • Created {formatDateTime(alert.createdAt)}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link to={`/risk/alerts/${alert.id}`}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                            >
                                                View Details
                                            </Button>
                                        </Link>

                                        {!alert.isResolved && (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => onResolve(alert.id)}
                                            >
                                                Resolve
                                            </Button>
                                        )}

                                        {alert.isResolved && (
                                            <div className="flex items-center text-xs text-success-600">
                                                <FiCheckCircle className="h-4 w-4 mr-1" />
                                                <span>Resolved by {alert.resolvedByUsername || 'User'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default AlertsList;