import React from 'react';

const RiskSummaryCard = ({ title, count, total, variant = 'primary', icon }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    const variantClasses = {
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-800',
    };

    const iconColorClasses = {
        primary: 'text-primary-600',
        success: 'text-success-600',
        warning: 'text-warning-600',
        danger: 'text-danger-600',
    };

    return (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${variantClasses[variant]}`}>
                        <div className={iconColorClasses[variant]}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-secondary-500 truncate">{title}</dt>
                            <dd>
                                <div className="text-lg font-medium text-secondary-900">{count}</div>
                                <div className="mt-1 flex items-center">
                                    <div className="flex-1 h-2 bg-secondary-100 rounded-full">
                                        <div
                                            className={`h-2 rounded-full bg-${variant}-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="ml-2 text-xs text-secondary-500">{percentage}%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskSummaryCard;