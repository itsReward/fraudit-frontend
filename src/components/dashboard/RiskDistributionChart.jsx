import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const RiskDistributionChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) {
            return;
        }

        // Destroy existing chart if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        // Prepare data for the chart
        const categories = Object.keys(data);
        const highRiskData = categories.map(cat => data[cat]?.highRisk || 0);
        const mediumRiskData = categories.map(cat => data[cat]?.mediumRisk || 0);
        const lowRiskData = categories.map(cat => data[cat]?.lowRisk || 0);

        // Create the chart
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(cat => cat.replace('_', ' ')), // Format labels by replacing underscores
                datasets: [
                    {
                        label: 'High Risk',
                        data: highRiskData,
                        backgroundColor: 'rgba(220, 38, 38, 0.7)',
                        borderColor: 'rgba(220, 38, 38, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Medium Risk',
                        data: mediumRiskData,
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Low Risk',
                        data: lowRiskData,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        display: true, // Ensure legend is displayed
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Fraud Indicators',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: {top: 10, bottom: 0}
                        },
                        stacked: true, // Stack bars on x-axis
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Occurrences',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: {top: 0, left: 0, right: 0, bottom: 0}
                        },
                        stacked: true, // Stack bars on y-axis
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Clean up function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    // Format category names for better display
    const formatCategoryName = (category) => {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div className="w-full h-full">
            {!data || Object.keys(data).length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-secondary-500">No distribution data available</p>
                </div>
            ) : (
                <canvas ref={chartRef} />
            )}
        </div>
    );
};

export default RiskDistributionChart;