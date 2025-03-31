import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '../../hooks/useTheme';

const RiskDistributionChart = ({ data = {} }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        if (chartRef.current && Object.keys(data).length > 0) {
            // Destroy existing chart if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            // Chart colors
            const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

            // Prepare data
            const indicators = Object.keys(data);

            // Create dataset for each risk level
            const highRiskData = indicators.map(indicator => data[indicator]?.high || 0);
            const mediumRiskData = indicators.map(indicator => data[indicator]?.medium || 0);
            const lowRiskData = indicators.map(indicator => data[indicator]?.low || 0);

            // Create chart
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: indicators.map(indicator => {
                        switch (indicator) {
                            case 'zScore':
                                return 'Altman Z-Score';
                            case 'mScore':
                                return 'Beneish M-Score';
                            case 'fScore':
                                return 'Piotroski F-Score';
                            case 'financialRatio':
                                return 'Financial Ratios';
                            case 'mlPrediction':
                                return 'ML Prediction';
                            default:
                                return indicator;
                        }
                    }),
                    datasets: [
                        {
                            label: 'High Risk',
                            data: highRiskData,
                            backgroundColor: '#E53E3E', // danger-600
                            borderColor: '#C53030', // danger-700
                            borderWidth: 1,
                        },
                        {
                            label: 'Medium Risk',
                            data: mediumRiskData,
                            backgroundColor: '#DD6B20', // warning-600
                            borderColor: '#C05621', // warning-700
                            borderWidth: 1,
                        },
                        {
                            label: 'Low Risk',
                            data: lowRiskData,
                            backgroundColor: '#38A169', // success-600
                            borderColor: '#2F855A', // success-700
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: textColor,
                            },
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                color: gridColor,
                            },
                            ticks: {
                                color: textColor,
                            },
                        },
                        y: {
                            grid: {
                                color: gridColor,
                            },
                            ticks: {
                                color: textColor,
                                precision: 0,
                            },
                            title: {
                                display: true,
                                text: 'Number of Assessments',
                                color: textColor,
                            },
                        },
                    },
                },
            });
        }

        // Cleanup on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, darkMode]);

    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-secondary-500">No distribution data available</p>
            </div>
        );
    }

    return <canvas ref={chartRef} />;
};

export default RiskDistributionChart;