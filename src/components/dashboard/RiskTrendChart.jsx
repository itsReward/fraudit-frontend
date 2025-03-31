import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '../../hooks/useTheme';

const RiskTrendChart = ({ data = [] }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        if (chartRef.current && data.length > 0) {
            // Destroy existing chart if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            // Prepare data
            const periods = data.map(item => item.period);
            const averageScores = data.map(item => item.averageRiskScore);
            const highRiskCounts = data.map(item => item.highRiskCount);
            const mediumRiskCounts = data.map(item => item.mediumRiskCount);
            const lowRiskCounts = data.map(item => item.lowRiskCount);

            // Chart colors
            const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

            // Create chart
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: periods,
                    datasets: [
                        {
                            label: 'Average Risk Score',
                            data: averageScores,
                            borderColor: '#3182CE', // primary-600
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y',
                        },
                        {
                            label: 'High Risk',
                            data: highRiskCounts,
                            borderColor: '#E53E3E', // danger-600
                            backgroundColor: 'rgba(229, 62, 62, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1',
                        },
                        {
                            label: 'Medium Risk',
                            data: mediumRiskCounts,
                            borderColor: '#DD6B20', // warning-600
                            backgroundColor: 'rgba(221, 107, 32, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1',
                        },
                        {
                            label: 'Low Risk',
                            data: lowRiskCounts,
                            borderColor: '#38A169', // success-600
                            backgroundColor: 'rgba(56, 161, 105, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
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
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Risk Score',
                                color: textColor,
                            },
                            min: 0,
                            max: 100,
                            grid: {
                                color: gridColor,
                            },
                            ticks: {
                                color: textColor,
                            },
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Count',
                                color: textColor,
                            },
                            min: 0,
                            grid: {
                                drawOnChartArea: false,
                                color: gridColor,
                            },
                            ticks: {
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

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-secondary-500">No trend data available</p>
            </div>
        );
    }

    return <canvas ref={chartRef} />;
};

export default RiskTrendChart;