// src/components/alerts/AlertDetail.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiXCircle,
    FiBarChart2,
    FiTrendingUp,
    FiTrendingDown,
    FiActivity,
    FiLayers,
    FiPieChart,
    FiArrowLeft
} from 'react-icons/fi';
import { formatDateTime } from '../../utils/dataUtils';
import alertsService from '../../services/alertsService';
import Card from '../common/Card';
import Button from '../common/Button';

const AlertDetail = ({ alert, onResolve, onBack, loading }) => {
    if (!alert) return null;

    const { color } = alertsService.formatAlertSeverity(alert.severity);
    const { label: typeLabel, icon } = alertsService.formatAlertType(alert.alertType);

    // Get the appropriate icon based on the alert type
    const getAlertIcon = () => {
        switch (icon) {
            case 'alert-triangle':
                return <FiAlertTriangle className="h-8 w-8" />;
            case 'chart':
                return <FiPieChart className="h-8 w-8" />;
            case 'bar-chart':
                return <FiBarChart2 className="h-8 w-8" />;
            case 'trending-up':
                return <FiTrendingUp className="h-8 w-8" />;
            case 'trending-down':
                return <FiTrendingDown className="h-8 w-8" />;
            case 'activity':
                return <FiActivity className="h-8 w-8" />;
            case 'layers':
                return <FiLayers className="h-8 w-8" />;
            default:
                return <FiAlertTriangle className="h-8 w-8" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button
                    className="mr-4 text-secondary-500 hover:text-secondary-700"
                    onClick={onBack}
                >
                    <FiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-semibold text-secondary-900">Alert Details</h1>
            </div>

            <Card>
                <div className="space-y-6">
                    {/* Alert Header */}
                    <div className="flex items-start pb-4 border-b border-secondary-200">
                        <div className={`flex-shrink-0 p-3 rounded-md bg-${color}-100`}>
                            <div className={`text-${color}-600`}>
                                {getAlertIcon()}
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h2 className="text-xl font-medium text-secondary-900">
                                    {alert.companyName}
                                </h2>
                                <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}>
                                    {alert.severity} Severity
                                </div>
                            </div>
                            <p className="mt-2 text-lg text-secondary-700">{alert.message}</p>
                            <div className="mt-2 flex items-center text-sm text-secondary-500">
                                <span className="font-medium">{typeLabel}</span>
                                <span className="mx-2">•</span>
                                <span>Created {formatDateTime(alert.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-secondary-500 mb-2">Alert Information</h3>
                            <div className="bg-secondary-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-secondary-500">Company</p>
                                        <p className="text-sm font-medium text-secondary-900">
                                            <Link to={`/companies/${alert.companyId}`} className="text-primary-600 hover:text-primary-800">
                                                {alert.companyName}
                                            </Link>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Alert Type</p>
                                        <p className="text-sm font-medium text-secondary-900">{typeLabel}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Severity</p>
                                        <p className="text-sm font-medium text-secondary-900">{alert.severity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Alert ID</p>
                                        <p className="text-sm font-medium text-secondary-900">{alert.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Created At</p>
                                        <p className="text-sm font-medium text-secondary-900">{formatDateTime(alert.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-secondary-500">Status</p>
                                        <div className="flex items-center">
                                            {alert.isResolved ? (
                                                <>
                                                    <FiCheckCircle className="h-4 w-4 text-success-500 mr-1" />
                                                    <span className="text-sm font-medium text-success-700">Resolved</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiXCircle className="h-4 w-4 text-warning-500 mr-1" />
                                                    <span className="text-sm font-medium text-warning-700">Open</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {alert.isResolved ? (
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-2">Resolution Information</h3>
                                <div className="bg-secondary-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-secondary-500">Resolved By</p>
                                            <p className="text-sm font-medium text-secondary-900">{alert.resolvedByUsername || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary-500">Resolved At</p>
                                            <p className="text-sm font-medium text-secondary-900">{formatDateTime(alert.resolvedAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary-500">Resolution Notes</p>
                                            <p className="text-sm font-medium text-secondary-900 mt-1">
                                                {alert.resolutionNotes || 'No notes provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-2">Suggested Actions</h3>
                                <div className="bg-secondary-50 p-4 rounded-lg">
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2">
                                                1
                                            </span>
                                            <span className="text-secondary-700">Review the financial statements for this period</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2">
                                                2
                                            </span>
                                            <span className="text-secondary-700">Check for accounting irregularities or discrepancies</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2">
                                                3
                                            </span>
                                            <span className="text-secondary-700">Compare with industry benchmarks and historical data</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2">
                                                4
                                            </span>
                                            <span className="text-secondary-700">Document findings and decide on appropriate action</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Related Information */}
                    <div className="border-t border-secondary-200 pt-4">
                        <h3 className="text-sm font-medium text-secondary-500 mb-2">Related Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {alert.assessmentId && (
                                <Link to={`/risk/assessments/${alert.assessmentId}`} className="block p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                                    <div className="flex items-center">
                                        <FiBarChart2 className="h-5 w-5 text-primary-500 mr-2" />
                                        <span className="text-sm font-medium text-primary-600">View Risk Assessment</span>
                                    </div>
                                </Link>
                            )}

                            {alert.companyId && (
                                <Link to={`/companies/${alert.companyId}`} className="block p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                                    <div className="flex items-center">
                                        <FiPieChart className="h-5 w-5 text-primary-500 mr-2" />
                                        <span className="text-sm font-medium text-primary-600">View Company</span>
                                    </div>
                                </Link>
                            )}

                            {alert.statementId && (
                                <Link to={`/statements/${alert.statementId}`} className="block p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                                    <div className="flex items-center">
                                        <FiActivity className="h-5 w-5 text-primary-500 mr-2" />
                                        <span className="text-sm font-medium text-primary-600">View Financial Statement</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {!alert.isResolved && (
                        <div className="flex justify-end border-t border-secondary-200 pt-4">
                            <Button
                                variant="primary"
                                onClick={() => onResolve(alert.id)}
                                isLoading={loading}
                            >
                                <FiCheckCircle className="mr-2 h-4 w-4" />
                                Mark as Resolved
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AlertDetail;