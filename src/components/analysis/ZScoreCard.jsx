import React from 'react';
import Card from '../common/Card';

const ZScoreCard = ({ data }) => {
    if (!data) {
        return (
            <Card
                title="Altman Z-Score"
                subtitle="Not available"
            >
                <div className="flex items-center justify-center h-32">
                    <p className="text-secondary-500">No Z-Score data available</p>
                </div>
            </Card>
        );
    }

    // Determine risk category color
    const getCategoryColor = (category) => {
        switch (category?.toUpperCase()) {
            case 'DISTRESS':
                return 'danger';
            case 'GREY':
                return 'warning';
            case 'SAFE':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const categoryColor = getCategoryColor(data.riskCategory);

    // Z-Score interpretation
    const getZScoreInterpretation = (score, category) => {
        if (!score) return '';

        switch (category?.toUpperCase()) {
            case 'DISTRESS':
                return 'High likelihood of financial distress within the next 2 years.';
            case 'GREY':
                return 'In the grey zone - some financial risk but not immediate distress.';
            case 'SAFE':
                return 'Financially stable with low probability of distress.';
            default:
                return 'No interpretation available.';
        }
    };

    const interpretation = getZScoreInterpretation(data.zScore, data.riskCategory);

    return (
        <Card
            title="Altman Z-Score"
            subtitle="Bankruptcy risk assessment"
        >
            <div className="space-y-4">
                {/* Z-Score and category */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-secondary-500">Z-Score</p>
                        <p className="text-2xl font-bold">{data.zScore?.toFixed(2) || 'N/A'}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-${categoryColor}-100 text-${categoryColor}-800`}>
                        {data.riskCategory || 'Unknown'}
                    </div>
                </div>

                {/* Interpretation */}
                <div>
                    <p className="text-sm text-secondary-500">Interpretation</p>
                    <p className="text-sm mt-1">{interpretation}</p>
                </div>

                {/* Components */}
                <div>
                    <p className="text-sm font-medium text-secondary-500 mb-2">Z-Score Components:</p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Working Capital / Total Assets</span>
                            <span className="text-sm font-medium">{data.workingCapitalToTotalAssets?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Retained Earnings / Total Assets</span>
                            <span className="text-sm font-medium">{data.retainedEarningsToTotalAssets?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">EBIT / Total Assets</span>
                            <span className="text-sm font-medium">{data.ebitToTotalAssets?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Market Value of Equity / Total Debt</span>
                            <span className="text-sm font-medium">{data.marketValueEquityToBookValueDebt?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-secondary-500">Sales / Total Assets</span>
                            <span className="text-sm font-medium">{data.salesToTotalAssets?.toFixed(4) || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Reference */}
                <div className="pt-2 text-xs text-secondary-500 border-t border-secondary-200">
                    <p>Z &lt; 1.8: Distress | 1.8 &lt; Z &lt; 3.0: Grey Zone | Z &gt; 3.0: Safe</p>
                    <p className="mt-1">Based on Altman's Z-Score model (1968).</p>
                </div>
            </div>
        </Card>
    );
};

export default ZScoreCard;