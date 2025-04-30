import React from 'react';
import Card from '../common/Card';

const MScoreCard = ({ data }) => {
    if (!data) {
        return (
            <Card
                title="Beneish M-Score"
                subtitle="Not available"
            >
                <div className="flex items-center justify-center h-32">
                    <p className="text-secondary-500">No M-Score data available</p>
                </div>
            </Card>
        );
    }

    // Determine manipulation probability color
    const getProbabilityColor = (probability) => {
        switch (probability?.toUpperCase()) {
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const probabilityColor = getProbabilityColor(data.manipulationProbability);

    // M-Score interpretation
    const getMScoreInterpretation = (score, probability) => {
        if (!score) return '';

        switch (probability?.toUpperCase()) {
            case 'HIGH':
                return 'High probability of earnings manipulation detected. Further investigation is recommended.';
            case 'MEDIUM':
                return 'Some signs of potential earnings manipulation. Monitor closely.';
            case 'LOW':
                return 'Low probability of earnings manipulation. Financial reporting appears proper.';
            default:
                return 'No interpretation available.';
        }
    };

    const interpretation = getMScoreInterpretation(data.mScore, data.manipulationProbability);

    return (
        <Card
            title="Beneish M-Score"
            subtitle="Earnings manipulation detection"
        >
            <div className="space-y-4">
                {/* M-Score and probability */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-secondary-500">M-Score</p>
                        <p className="text-2xl font-bold">
                            {data.mscore !== undefined && data.mscore !== null
                                ? data.mscore.toFixed(2)
                                : 'N/A'}
                        </p>

                    </div>
                    <div className={`px-3 py-1 rounded-full bg-${probabilityColor}-100 text-${probabilityColor}-800`}>
                        {data.manipulationProbability || 'Unknown'}
                    </div>
                </div>

                {/* Interpretation */}
                <div>
                    <p className="text-sm text-secondary-500">Interpretation</p>
                    <p className="text-sm mt-1">{interpretation}</p>
                </div>

                {/* Components */}
                <div>
                    <p className="text-sm font-medium text-secondary-500 mb-2">M-Score Components:</p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Days Sales in Receivables Index</span>
                            <span className="text-sm font-medium">{data.daysSalesReceivablesIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Gross Margin Index</span>
                            <span className="text-sm font-medium">{data.grossMarginIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Asset Quality Index</span>
                            <span className="text-sm font-medium">{data.assetQualityIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Sales Growth Index</span>
                            <span className="text-sm font-medium">{data.salesGrowthIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Depreciation Index</span>
                            <span className="text-sm font-medium">{data.depreciationIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">SG&A Expenses Index</span>
                            <span className="text-sm font-medium">{data.sgAdminExpensesIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Leverage Index</span>
                            <span className="text-sm font-medium">{data.leverageIndex?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Total Accruals to Total Assets</span>
                            <span className="text-sm font-medium">{data.totalAccrualsToTotalAssets?.toFixed(4) || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Reference */}
                <div className="pt-2 text-xs text-secondary-500 border-t border-secondary-200">
                    <p>M-Score &gt; -1.78: High Probability | -2.22 &lt; M &lt; -1.78: Medium | M &lt; -2.22: Low</p>
                    <p className="mt-1">Based on Beneish M-Score model for earnings manipulation detection.</p>
                </div>
            </div>
        </Card>
    );
};

export default MScoreCard;