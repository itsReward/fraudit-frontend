import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const RecentAlertsCard = ({ alerts }) => {
    const getSeverityColor = (severity) => {
        switch (severity?.toUpperCase()) {
            case 'VERY_HIGH':
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'info';
        }
    };

    return (
        <Card
            title="Recent Alerts"
            subtitle="Latest risk alerts"
            footer={
                <Link
                    to="/risk/alerts"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                    View all alerts
                </Link>
            }
        >
            <div className="space-y-3">
                {alerts && alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-3 py-2">
                            <div className={`mt-0.5 h-2 w-2 rounded-full bg-${getSeverityColor(alert.severity)}-500 flex-shrink-0`} />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-secondary-900">{alert.message}</p>
                                <div className="mt-1 flex justify-between">
                                    <span className="text-xs text-secondary-500">{alert.companyName}</span>
                                    <span className="text-xs text-secondary-500">{alert.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-secondary-500 text-sm text-center py-4">No recent alerts</p>
                )}
            </div>
        </Card>
    );
};

export default RecentAlertsCard;