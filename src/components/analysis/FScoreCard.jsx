import React from 'react';
import Card from '../common/Card';

const FScoreCard = ({ data }) => {
    if (!data) {
        return (
            <Card
                title="Piotroski F-Score"
                subtitle="Not available"
            >
                <div className="flex items-center justify-center h-32">
                    <p className="text-secondary-500">No F-Score data available</p>
                </div>
            </Card>
        );
    }

    // Determine financial strength color
    const getStrengthColor = (strength) => {
        switch (strength?.toUpperCase()) {
            case 'STRONG':
                return 'success';
            case 'MODERATE':
                return 'warning';
            case 'WEAK':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const strengthColor = getStrengthColor(data.financialStrength);

    // F-Score interpretation
    const getFScoreInterpretation = (score, strength) => {
        if (!score && score !== 0) return '';

        switch (strength?.toUpperCase()) {
            case 'STRONG':
                return 'Strong financial position with good profitability, improving efficiency, and decreasing leverage.';
            case 'MODERATE':
                return 'Moderate financial strength with some areas of improvement needed.';
            case 'WEAK':
                return 'Weak financial position with potential concerns in profitability, efficiency, or leverage.';
            default:
                return 'No interpretation available.';
        }
    };

    const interpretation = getFScoreInterpretation(data.fScore, data.financialStrength);

    // Create progress bar segments for F-Score (out of 9)
    const progressSegments = [];
    for (let i = 1; i <= 9; i++) {
        progressSegments.push(
            <div
                key={i}
                className={`h-2 w-4 ${
                    i <= (data.fScore || 0)
                        ? `bg-${strengthColor}-500`
                        : 'bg-secondary-200'
                } ${i > 1 ? 'ml-1' : ''}`}
            />
        );
    }

    return (
        <Card
            title="Piotroski F-Score"
            subtitle="Financial strength assessment"
        >
            <div className="space-y-4">
                {/* F-Score and strength */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-secondary-500">F-Score</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold mr-2">{data.fScore || 'N/A'}</p>
                            <span className="text-xs text-secondary-500">out of 9</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-${strengthColor}-100 text-${strengthColor}-800`}>
                        {data.financialStrength || 'Unknown'}
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex mt-2">
                        {progressSegments}
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-xs text-secondary-500">Weak (0-3)</span>
                        <span className="text-xs text-secondary-500">Moderate (4-6)</span>
                        <span className="text-xs text-secondary-500">Strong (7-9)</span>
                    </div>
                </div>

                {/* Interpretation */}
                <div>
                    <p className="text-sm text-secondary-500">Interpretation</p>
                    <p className="text-sm mt-1">{interpretation}</p>
                </div>

                {/* Components */}
                <div>
                    <p className="text-sm font-medium text-secondary-500 mb-2">F-Score Components:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.positiveNetIncome ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.positiveNetIncome ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Positive Net Income</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.positiveOperatingCashFlow ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.positiveOperatingCashFlow ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Positive Operating Cash Flow</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.cashFlowGreaterThanNetIncome ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.cashFlowGreaterThanNetIncome ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Cash Flow > Net Income</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.improvingRoa ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.improvingRoa ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Improving ROA</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.decreasingLeverage ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.decreasingLeverage ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Decreasing Leverage</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.improvingCurrentRatio ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.improvingCurrentRatio ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Improving Current Ratio</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.noNewShares ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.noNewShares ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">No New Shares Issued</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.improvingGrossMargin ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.improvingGrossMargin ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Improving Gross Margin</span>
                        </div>

                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                data.improvingAssetTurnover ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                            }`}>
                                {data.improvingAssetTurnover ? '✓' : '✗'}
                            </div>
                            <span className="text-sm ml-2">Improving Asset Turnover</span>
                        </div>
                    </div>
                </div>

                {/* Reference */}
                <div className="pt-2 text-xs text-secondary-500 border-t border-secondary-200">
                    <p>F-Score range: 0-9 (9 is best). Higher score indicates stronger financial position.</p>
                    <p className="mt-1">Based on Piotroski's F-Score model for financial strength assessment.</p>
                </div>
            </div>
        </Card>
    );
};

export default FScoreCard;