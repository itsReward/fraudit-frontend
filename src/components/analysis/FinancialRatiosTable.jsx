import React, { useState } from 'react';
import Card from '../common/Card';

const FinancialRatiosTable = ({ data }) => {
    const [activeTab, setActiveTab] = useState('liquidity');

    if (!data) {
        return (
            <Card
                title="Financial Ratios"
                subtitle="Not available"
            >
                <div className="flex items-center justify-center h-32">
                    <p className="text-secondary-500">No financial ratios data available</p>
                </div>
            </Card>
        );
    }

    // Define tabs and their content
    const tabs = [
        {
            id: 'liquidity',
            name: 'Liquidity',
            ratios: [
                { name: 'Current Ratio', value: data.currentRatio, benchmark: '> 2', description: 'Measures ability to pay short-term obligations' },
                { name: 'Quick Ratio', value: data.quickRatio, benchmark: '> 1', description: 'Measures ability to pay short-term obligations without selling inventory' },
                { name: 'Cash Ratio', value: data.cashRatio, benchmark: '> 0.5', description: 'Measures ability to cover short-term liabilities with cash and cash equivalents' },
            ],
        },
        {
            id: 'profitability',
            name: 'Profitability',
            ratios: [
                { name: 'Gross Margin', value: data.grossMargin, benchmark: 'Industry specific', description: 'Percentage of revenue retained after cost of goods sold', format: 'percent' },
                { name: 'Operating Margin', value: data.operatingMargin, benchmark: 'Industry specific', description: 'Percentage of revenue retained after operating expenses', format: 'percent' },
                { name: 'Net Profit Margin', value: data.netProfitMargin, benchmark: 'Industry specific', description: 'Percentage of revenue retained after all expenses', format: 'percent' },
                { name: 'Return on Assets (ROA)', value: data.returnOnAssets, benchmark: '> 5%', description: 'Measures efficiency of using assets to generate profit', format: 'percent' },
                { name: 'Return on Equity (ROE)', value: data.returnOnEquity, benchmark: '> 10%', description: 'Measures efficiency of using equity to generate profit', format: 'percent' },
            ],
        },
        {
            id: 'efficiency',
            name: 'Efficiency',
            ratios: [
                { name: 'Asset Turnover', value: data.assetTurnover, benchmark: 'Higher is better', description: 'Measures efficiency of using assets to generate revenue' },
                { name: 'Inventory Turnover', value: data.inventoryTurnover, benchmark: 'Higher is better', description: 'Measures efficiency of inventory management' },
                { name: 'Accounts Receivable Turnover', value: data.accountsReceivableTurnover, benchmark: 'Higher is better', description: 'Measures efficiency of collecting accounts receivable' },
                { name: 'Days Sales Outstanding', value: data.daysSalesOutstanding, benchmark: 'Lower is better', description: 'Average number of days to collect payment', format: 'days' },
            ],
        },
        {
            id: 'leverage',
            name: 'Leverage',
            ratios: [
                { name: 'Debt to Equity', value: data.debtToEquity, benchmark: '< 2', description: 'Measures financial leverage' },
                { name: 'Debt Ratio', value: data.debtRatio, benchmark: '< 0.5', description: 'Measures percentage of assets financed by debt' },
                { name: 'Interest Coverage', value: data.interestCoverage, benchmark: '> 2', description: 'Measures ability to pay interest on debt' },
            ],
        },
        {
            id: 'quality',
            name: 'Quality',
            ratios: [
                { name: 'Accrual Ratio', value: data.accrualRatio, benchmark: 'Closer to 0 is better', description: 'Measures difference between earnings and cash flow, indicator of earnings quality' },
                { name: 'Earnings Quality', value: data.earningsQuality, benchmark: '> 1 is better', description: 'Ratio of operating cash flow to net income, higher indicates better quality' },
            ],
        },
    ];

    // Get active tab content
    const activeTabContent = tabs.find(tab => tab.id === activeTab);

    // Format ratio value
    const formatValue = (value, format) => {
        if (value === null || value === undefined) return 'N/A';

        switch (format) {
            case 'percent':
                return `${value.toFixed(2)}%`;
            case 'days':
                return `${value.toFixed(1)} days`;
            default:
                return value.toFixed(2);
        }
    };

    // Determine if ratio is good, neutral, or bad
    const getRatioStatus = (ratio, value) => {
        if (value === null || value === undefined) return 'neutral';

        // Simple rules based on ratio name
        // In a real app, these would be more sophisticated and customizable
        switch (ratio.toLowerCase()) {
            case 'current ratio':
                return value >= 2 ? 'good' : value >= 1 ? 'neutral' : 'bad';
            case 'quick ratio':
                return value >= 1 ? 'good' : value >= 0.5 ? 'neutral' : 'bad';
            case 'cash ratio':
                return value >= 0.5 ? 'good' : value >= 0.2 ? 'neutral' : 'bad';
            case 'gross margin':
            case 'operating margin':
            case 'net profit margin':
                return value >= 15 ? 'good' : value >= 5 ? 'neutral' : 'bad';
            case 'return on assets (roa)':
                return value >= 5 ? 'good' : value >= 2 ? 'neutral' : 'bad';
            case 'return on equity (roe)':
                return value >= 15 ? 'good' : value >= 10 ? 'neutral' : 'bad';
            case 'asset turnover':
            case 'inventory turnover':
            case 'accounts receivable turnover':
                return value >= 5 ? 'good' : value >= 2 ? 'neutral' : 'bad';
            case 'days sales outstanding':
                return value <= 30 ? 'good' : value <= 60 ? 'neutral' : 'bad';
            case 'debt to equity':
                return value <= 1 ? 'good' : value <= 2 ? 'neutral' : 'bad';
            case 'debt ratio':
                return value <= 0.3 ? 'good' : value <= 0.6 ? 'neutral' : 'bad';
            case 'interest coverage':
                return value >= 3 ? 'good' : value >= 1.5 ? 'neutral' : 'bad';
            case 'accrual ratio':
                return Math.abs(value) <= 0.1 ? 'good' : Math.abs(value) <= 0.2 ? 'neutral' : 'bad';
            case 'earnings quality':
                return value >= 1.1 ? 'good' : value >= 0.9 ? 'neutral' : 'bad';
            default:
                return 'neutral';
        }
    };

    return (
        <Card
            title="Financial Ratios"
            subtitle="Key financial performance indicators"
        >
            {/* Tabs */}
            <div className="border-b border-secondary-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                            } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab content */}
            <div className="mt-4">
                <table className="min-w-full divide-y divide-secondary-200">
                    <thead>
                    <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Ratio
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Value
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Benchmark
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                    {activeTabContent.ratios.map((ratio, index) => {
                        const status = getRatioStatus(ratio.name, ratio.value);
                        const statusColor = status === 'good' ? 'text-success-600' : status === 'bad' ? 'text-danger-600' : 'text-secondary-500';

                        return (
                            <tr key={index} className="hover:bg-secondary-50">
                                <td className="px-3 py-3 text-sm text-secondary-900 group-last">
                                    <div className="font-medium">{ratio.name}</div>
                                    <div className="text-xs text-secondary-500 mt-1">{ratio.description}</div>
                                </td>
                                <td className={`px-3 py-3 text-sm text-right font-medium ${statusColor}`}>
                                    {formatValue(ratio.value, ratio.format)}
                                </td>
                                <td className="px-3 py-3 text-sm text-secondary-500">
                                    {ratio.benchmark}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <div className="text-xs text-secondary-500 mt-4 pt-3 border-t border-secondary-200">
                    Note: Benchmarks are general guidelines and may vary by industry.
                    Analysis should consider industry-specific norms and company historical trends.
                </div>
            </div>
        </Card>
    );
};

export default FinancialRatiosTable;