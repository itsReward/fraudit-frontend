import React from 'react';
import Card from '../common/Card';

const RiskScoreCard = ({
                           title,
                           score,
                           maxScore = 100,
                           riskLevel,
                           details = [],
                           className = '',
                       }) => {
    // Calculate percentage for gauge
    const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

    // Determine color based on risk level
    const getLevelColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'VERY_HIGH':
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'primary';
        }
    };

    const color = getLevelColor(riskLevel);

    return (
        <Card
            title={title}
            className={className}
        >
            <div className="flex flex-col items-center">
                {/* Gauge */}
                <div className="relative w-40 h-40">
                    {/* Background track */}
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="currentColor"
                            className="text-secondary-100"
                            strokeWidth="12"
                        />

                        {/* Foreground track */}
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="currentColor"
                            className={`text-${color}-500`}
                            strokeWidth="12"
                            strokeDasharray="339.292"
                            strokeDashoffset={339.292 * (1 - percentage / 100)}
                            transform="rotate(-90 60 60)"
                        />
                    </svg>

                    {/* Risk score in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-secondary-900">{score.toFixed(1)}</span>
                        <span className={`text-sm font-medium text-${color}-600`}>{riskLevel}</span>
                    </div>
                </div>

                {/* Details list */}
                {details.length > 0 && (
                    <div className="mt-4 w-full">
                        <div className="text-sm font-medium text-secondary-500 mb-2">Risk Factors:</div>
                        <div className="space-y-1">
                            {details.map((detail, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-sm text-secondary-500">{detail.label}</span>
                                    <span className="text-sm font-medium">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RiskScoreCard;