// src/api/mockService.js
import { v4 as uuidv4 } from 'uuid';

// Mock user data
const users = [
    {
        id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        username: 'admin',
        email: 'admin@fraudit.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        active: true,
    },
    {
        id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        username: 'analyst',
        email: 'analyst@fraudit.com',
        firstName: 'Analyst',
        lastName: 'User',
        role: 'ANALYST',
        active: true,
    },
];

// Mock companies data
const companies = [
    {
        id: 1,
        name: 'ABC Corporation',
        stockCode: 'ABC',
        sector: 'Technology',
        listingDate: '2015-01-15',
        description: 'A leading technology company specializing in software solutions.',
    },
    {
        id: 2,
        name: 'XYZ Enterprises',
        stockCode: 'XYZ',
        sector: 'Finance',
        listingDate: '2012-06-20',
        description: 'A financial services company providing banking and investment solutions.',
    },
    {
        id: 3,
        name: 'Global Mining Ltd',
        stockCode: 'GML',
        sector: 'Mining',
        listingDate: '2010-03-10',
        description: 'A mining company with operations across multiple continents.',
    },
];

// Mock financial statements data
const statements = [
    {
        id: 1,
        fiscalYearId: 1,
        companyId: 1,
        year: 2023,
        statementType: 'ANNUAL',
        period: 'Full Year',
        uploadDate: '2023-12-15T10:30:00Z',
        status: 'ANALYZED',
        hasFinancialData: true,
        hasRiskAssessment: true,
        uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        uploadedByUsername: 'admin',
        companyName: 'ABC Corporation',
        riskLevel: 'MEDIUM',
    },
    {
        id: 2,
        fiscalYearId: 2,
        companyId: 2,
        year: 2023,
        statementType: 'ANNUAL',
        period: 'Full Year',
        uploadDate: '2023-12-10T14:15:00Z',
        status: 'ANALYZED',
        hasFinancialData: true,
        hasRiskAssessment: true,
        uploadedByUserId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        uploadedByUsername: 'admin',
        companyName: 'XYZ Enterprises',
        riskLevel: 'HIGH',
    },
    {
        id: 3,
        fiscalYearId: 3,
        companyId: 3,
        year: 2023,
        statementType: 'ANNUAL',
        period: 'Full Year',
        uploadDate: '2023-12-05T09:45:00Z',
        status: 'ANALYZED',
        hasFinancialData: true,
        hasRiskAssessment: true,
        uploadedByUserId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        uploadedByUsername: 'analyst',
        companyName: 'Global Mining Ltd',
        riskLevel: 'LOW',
    },
];

// Mock financial data
const financialData = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        revenue: 5000000,
        costOfSales: 2800000,
        grossProfit: 2200000,
        operatingExpenses: 1200000,
        operatingIncome: 1000000,
        netIncome: 750000,
        totalAssets: 8000000,
        totalLiabilities: 3500000,
        totalEquity: 4500000,
        createdAt: '2023-12-15T11:00:00Z',
        updatedAt: '2023-12-15T11:00:00Z',
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        revenue: 12000000,
        costOfSales: 7500000,
        grossProfit: 4500000,
        operatingExpenses: 3200000,
        operatingIncome: 1300000,
        netIncome: 950000,
        totalAssets: 15000000,
        totalLiabilities: 9000000,
        totalEquity: 6000000,
        createdAt: '2023-12-10T15:00:00Z',
        updatedAt: '2023-12-10T15:00:00Z',
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        revenue: 8500000,
        costOfSales: 5200000,
        grossProfit: 3300000,
        operatingExpenses: 2100000,
        operatingIncome: 1200000,
        netIncome: 820000,
        totalAssets: 12000000,
        totalLiabilities: 5500000,
        totalEquity: 6500000,
        createdAt: '2023-12-05T10:30:00Z',
        updatedAt: '2023-12-05T10:30:00Z',
    },
];

// Mock risk assessments
const riskAssessments = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        zScoreRisk: 45.2,
        mScoreRisk: 58.7,
        fScoreRisk: 35.8,
        financialRatioRisk: 40.3,
        mlPredictionRisk: 52.5,
        overallRiskScore: 48.5,
        riskLevel: 'MEDIUM',
        assessmentSummary: 'The company shows moderate risk factors in financial reporting. Further investigation is recommended for specific areas.',
        assessedAt: '2023-12-15T12:00:00Z',
        assessedById: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        assessedByUsername: 'admin',
        alertCount: 3,
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        zScoreRisk: 68.5,
        mScoreRisk: 76.2,
        fScoreRisk: 62.8,
        financialRatioRisk: 70.5,
        mlPredictionRisk: 75.3,
        overallRiskScore: 72.5,
        riskLevel: 'HIGH',
        assessmentSummary: 'The company displays significant financial reporting risk factors. Detailed investigation is highly recommended.',
        assessedAt: '2023-12-10T16:00:00Z',
        assessedById: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        assessedByUsername: 'admin',
        alertCount: 7,
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        zScoreRisk: 22.3,
        mScoreRisk: 30.5,
        fScoreRisk: 18.6,
        financialRatioRisk: 25.4,
        mlPredictionRisk: 28.2,
        overallRiskScore: 25.0,
        riskLevel: 'LOW',
        assessmentSummary: 'The company shows minimal risk factors in financial reporting. Regular monitoring is still recommended.',
        assessedAt: '2023-12-05T11:30:00Z',
        assessedById: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        assessedByUsername: 'analyst',
        alertCount: 1,
    },
];

// Mock risk alerts
const riskAlerts = [
    {
        id: 1,
        assessmentId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        alertType: 'RATIO_ANOMALY',
        severity: 'MEDIUM',
        message: 'Unusual patterns detected in profitability ratios.',
        createdAt: '2023-12-15T12:05:00Z',
        isResolved: false,
    },
    {
        id: 2,
        assessmentId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        alertType: 'M_SCORE_HIGH',
        severity: 'HIGH',
        message: 'High probability of earnings manipulation detected by M-Score analysis.',
        createdAt: '2023-12-10T16:05:00Z',
        isResolved: false,
    },
    {
        id: 3,
        assessmentId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        alertType: 'Z_SCORE_DISTRESS',
        severity: 'HIGH',
        message: 'Z-Score indicates financial distress.',
        createdAt: '2023-12-10T16:10:00Z',
        isResolved: false,
    },
    {
        id: 4,
        assessmentId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        alertType: 'ASSET_GROWTH_ANOMALY',
        severity: 'LOW',
        message: 'Minor anomaly detected in asset growth rate.',
        createdAt: '2023-12-05T11:35:00Z',
        isResolved: true,
        resolvedById: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        resolvedByUsername: 'admin',
        resolvedAt: '2023-12-06T09:15:00Z',
        resolutionNotes: 'Investigated and found to be within acceptable parameters.',
    },
];

// Mock analysis data
const zScores = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        workingCapitalToTotalAssets: 0.28,
        retainedEarningsToTotalAssets: 0.32,
        ebitToTotalAssets: 0.13,
        marketValueEquityToBookValueDebt: 1.42,
        salesToTotalAssets: 0.62,
        zScore: 2.54,
        riskCategory: 'GREY',
        calculatedAt: '2023-12-15T11:45:00Z',
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        workingCapitalToTotalAssets: 0.15,
        retainedEarningsToTotalAssets: 0.18,
        ebitToTotalAssets: 0.09,
        marketValueEquityToBookValueDebt: 0.78,
        salesToTotalAssets: 0.80,
        zScore: 1.65,
        riskCategory: 'DISTRESS',
        calculatedAt: '2023-12-10T15:30:00Z',
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        workingCapitalToTotalAssets: 0.32,
        retainedEarningsToTotalAssets: 0.38,
        ebitToTotalAssets: 0.10,
        marketValueEquityToBookValueDebt: 1.25,
        salesToTotalAssets: 0.71,
        zScore: 3.15,
        riskCategory: 'SAFE',
        calculatedAt: '2023-12-05T11:00:00Z',
    },
];

const mScores = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        daysSalesReceivablesIndex: 1.05,
        grossMarginIndex: 1.03,
        assetQualityIndex: 1.18,
        salesGrowthIndex: 1.22,
        depreciationIndex: 1.01,
        sgAdminExpensesIndex: 0.96,
        leverageIndex: 1.12,
        totalAccrualsToTotalAssets: 0.04,
        mScore: -1.95,
        manipulationProbability: 'MEDIUM',
        calculatedAt: '2023-12-15T11:50:00Z',
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        daysSalesReceivablesIndex: 1.32,
        grossMarginIndex: 1.15,
        assetQualityIndex: 1.28,
        salesGrowthIndex: 1.35,
        depreciationIndex: 1.08,
        sgAdminExpensesIndex: 0.92,
        leverageIndex: 1.25,
        totalAccrualsToTotalAssets: 0.08,
        mScore: -1.48,
        manipulationProbability: 'HIGH',
        calculatedAt: '2023-12-10T15:35:00Z',
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        daysSalesReceivablesIndex: 0.98,
        grossMarginIndex: 0.99,
        assetQualityIndex: 1.05,
        salesGrowthIndex: 1.08,
        depreciationIndex: 1.01,
        sgAdminExpensesIndex: 1.02,
        leverageIndex: 0.95,
        totalAccrualsToTotalAssets: 0.02,
        mScore: -2.45,
        manipulationProbability: 'LOW',
        calculatedAt: '2023-12-05T11:05:00Z',
    },
];

const fScores = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        positiveNetIncome: true,
        positiveOperatingCashFlow: true,
        cashFlowGreaterThanNetIncome: false,
        improvingRoa: true,
        decreasingLeverage: false,
        improvingCurrentRatio: true,
        noNewShares: true,
        improvingGrossMargin: false,
        improvingAssetTurnover: true,
        fScore: 6,
        financialStrength: 'MODERATE',
        calculatedAt: '2023-12-15T11:55:00Z',
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        positiveNetIncome: true,
        positiveOperatingCashFlow: true,
        cashFlowGreaterThanNetIncome: false,
        improvingRoa: false,
        decreasingLeverage: false,
        improvingCurrentRatio: false,
        noNewShares: false,
        improvingGrossMargin: false,
        improvingAssetTurnover: true,
        fScore: 3,
        financialStrength: 'WEAK',
        calculatedAt: '2023-12-10T15:40:00Z',
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        positiveNetIncome: true,
        positiveOperatingCashFlow: true,
        cashFlowGreaterThanNetIncome: true,
        improvingRoa: true,
        decreasingLeverage: true,
        improvingCurrentRatio: true,
        noNewShares: true,
        improvingGrossMargin: true,
        improvingAssetTurnover: true,
        fScore: 9,
        financialStrength: 'STRONG',
        calculatedAt: '2023-12-05T11:10:00Z',
    },
];

const financialRatios = [
    {
        id: 1,
        statementId: 1,
        companyId: 1,
        companyName: 'ABC Corporation',
        year: 2023,
        currentRatio: 1.85,
        quickRatio: 1.42,
        cashRatio: 0.78,
        grossMargin: 44.0,
        operatingMargin: 20.0,
        netProfitMargin: 15.0,
        returnOnAssets: 9.38,
        returnOnEquity: 16.67,
        assetTurnover: 0.62,
        inventoryTurnover: 5.2,
        accountsReceivableTurnover: 8.3,
        daysSalesOutstanding: 44.0,
        debtToEquity: 0.78,
        debtRatio: 0.44,
        interestCoverage: 8.5,
        priceToEarnings: 18.5,
        priceToBook: 2.2,
        accrualRatio: 0.03,
        earningsQuality: 0.92,
        calculatedAt: '2023-12-15T11:40:00Z',
    },
    {
        id: 2,
        statementId: 2,
        companyId: 2,
        companyName: 'XYZ Enterprises',
        year: 2023,
        currentRatio: 1.28,
        quickRatio: 0.95,
        cashRatio: 0.42,
        grossMargin: 37.5,
        operatingMargin: 10.83,
        netProfitMargin: 7.92,
        returnOnAssets: 6.33,
        returnOnEquity: 15.83,
        assetTurnover: 0.8,
        inventoryTurnover: 6.8,
        accountsReceivableTurnover: 6.2,
        daysSalesOutstanding: 58.9,
        debtToEquity: 1.5,
        debtRatio: 0.6,
        interestCoverage: 4.8,
        priceToEarnings: 12.2,
        priceToBook: 1.8,
        accrualRatio: 0.05,
        earningsQuality: 0.85,
        calculatedAt: '2023-12-10T15:25:00Z',
    },
    {
        id: 3,
        statementId: 3,
        companyId: 3,
        companyName: 'Global Mining Ltd',
        year: 2023,
        currentRatio: 2.15,
        quickRatio: 1.68,
        cashRatio: 0.92,
        grossMargin: 38.82,
        operatingMargin: 14.12,
        netProfitMargin: 9.65,
        returnOnAssets: 6.83,
        returnOnEquity: 12.62,
        assetTurnover: 0.71,
        inventoryTurnover: 4.5,
        accountsReceivableTurnover: 9.8,
        daysSalesOutstanding: 37.2,
        debtToEquity: 0.85,
        debtRatio: 0.46,
        interestCoverage: 10.2,
        priceToEarnings: 14.8,
        priceToBook: 1.5,
        accrualRatio: 0.02,
        earningsQuality: 1.05,
        calculatedAt: '2023-12-05T10:55:00Z',
    },
];

// Dashboard data
const dashboardData = {
    fraudRiskStats: {
        totalAssessments: 45,
        highRiskCount: 12,
        mediumRiskCount: 18,
        lowRiskCount: 15,
        averageRiskScore: 48.5,
        unresolvedAlerts: 23,
    },
    companyRiskSummary: [
        {
            companyId: 2,
            companyName: 'XYZ Enterprises',
            stockCode: 'XYZ',
            sector: 'Finance',
            riskLevel: 'HIGH',
            riskScore: 72.5,
            assessmentDate: '2023-12-10T16:00:00Z',
        },
        {
            companyId: 1,
            companyName: 'ABC Corporation',
            stockCode: 'ABC',
            sector: 'Technology',
            riskLevel: 'MEDIUM',
            riskScore: 48.5,
            assessmentDate: '2023-12-15T12:00:00Z',
        },
        {
            companyId: 3,
            companyName: 'Global Mining Ltd',
            stockCode: 'GML',
            sector: 'Mining',
            riskLevel: 'LOW',
            riskScore: 25.0,
            assessmentDate: '2023-12-05T11:30:00Z',
        },
    ],
    fraudIndicatorsDistribution: {
        zScore: { high: 12, medium: 20, low: 13 },
        mScore: { high: 15, medium: 18, low: 12 },
        fScore: { high: 10, medium: 22, low: 13 },
        financialRatio: { high: 11, medium: 19, low: 15 },
        mlPrediction: { high: 14, medium: 17, low: 14 },
    },
    recentRiskAlerts: [
        {
            alertId: 1,
            companyName: 'ABC Corporation',
            alertType: 'RATIO_ANOMALY',
            severity: 'MEDIUM',
            message: 'Unusual patterns detected in profitability ratios.',
            createdAt: '2023-12-15T12:05:00Z',
            isResolved: false,
        },
        {
            alertId: 2,
            companyName: 'XYZ Enterprises',
            alertType: 'M_SCORE_HIGH',
            severity: 'HIGH',
            message: 'High probability of earnings manipulation detected by M-Score analysis.',
            createdAt: '2023-12-10T16:05:00Z',
            isResolved: false,
        },
        {
            alertId: 3,
            companyName: 'XYZ Enterprises',
            alertType: 'Z_SCORE_DISTRESS',
            severity: 'HIGH',
            message: 'Z-Score indicates financial distress.',
            createdAt: '2023-12-10T16:10:00Z',
            isResolved: false,
        },
        {
            alertId: 5,
            companyName: 'DEF Industries',
            alertType: 'ACCRUAL_RATIO_HIGH',
            severity: 'MEDIUM',
            message: 'High accrual ratio detected, indicating potential earnings management.',
            createdAt: '2023-12-08T09:30:00Z',
            isResolved: false,
        },
        {
            alertId: 6,
            companyName: 'GHI Holdings',
            alertType: 'REVENUE_GROWTH_ANOMALY',
            severity: 'MEDIUM',
            message: 'Unusual patterns in revenue growth compared to industry peers.',
            createdAt: '2023-12-07T14:20:00Z',
            isResolved: false,
        },
    ],
    fraudRiskTrends: [
        {
            period: '2023-01',
            averageRiskScore: 42.5,
            assessmentCount: 12,
            highRiskCount: 2,
            mediumRiskCount: 5,
            lowRiskCount: 5,
        },
        {
            period: '2023-02',
            averageRiskScore: 45.2,
            assessmentCount: 15,
            highRiskCount: 3,
            mediumRiskCount: 6,
            lowRiskCount: 6,
        },
        {
            period: '2023-03',
            averageRiskScore: 43.8,
            assessmentCount: 13,
            highRiskCount: 3,
            mediumRiskCount: 5,
            lowRiskCount: 5,
        },
        {
            period: '2023-04',
            averageRiskScore: 46.5,
            assessmentCount: 16,
            highRiskCount: 4,
            mediumRiskCount: 7,
            lowRiskCount: 5,
        },
        {
            period: '2023-05',
            averageRiskScore: 45.0,
            assessmentCount: 14,
            highRiskCount: 3,
            mediumRiskCount: 6,
            lowRiskCount: 5,
        },
        {
            period: '2023-06',
            averageRiskScore: 47.2,
            assessmentCount: 15,
            highRiskCount: 4,
            mediumRiskCount: 6,
            lowRiskCount: 5,
        },
        {
            period: '2023-07',
            averageRiskScore: 48.5,
            assessmentCount: 17,
            highRiskCount: 5,
            mediumRiskCount: 7,
            lowRiskCount: 5,
        },
        {
            period: '2023-08',
            averageRiskScore: 50.2,
            assessmentCount: 18,
            highRiskCount: 6,
            mediumRiskCount: 7,
            lowRiskCount: 5,
        },
        {
            period: '2023-09',
            averageRiskScore: 49.5,
            assessmentCount: 16,
            highRiskCount: 5,
            mediumRiskCount: 7,
            lowRiskCount: 4,
        },
        {
            period: '2023-10',
            averageRiskScore: 51.3,
            assessmentCount: 19,
            highRiskCount: 6,
            mediumRiskCount: 8,
            lowRiskCount: 5,
        },
        {
            period: '2023-11',
            averageRiskScore: 52.8,
            assessmentCount: 20,
            highRiskCount: 7,
            mediumRiskCount: 8,
            lowRiskCount: 5,
        },
        {
            period: '2023-12',
            averageRiskScore: 48.5,
            assessmentCount: 15,
            highRiskCount: 5,
            mediumRiskCount: 6,
            lowRiskCount: 4,
        },
    ],
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 700);

const createApiResponse = (data, message = 'Success') => ({
    data: {
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    }
});

const paginate = (items, page = 0, size = 10) => {
    const start = page * size;
    const paginatedItems = items.slice(start, start + size);
    return {
        content: paginatedItems,
        page: page,
        size: size,
        totalElements: items.length,
        totalPages: Math.ceil(items.length / size),
        first: page === 0,
        last: start + size >= items.length
    };
};

// Authentication API
export const authAPI = {
    login: async (credentials) => {
        await randomDelay();

        // Check if credentials match any mock user
        const user = users.find(u => u.username === credentials.username);

        if (user && credentials.password === 'password') { // Simple password check for demo
            const token = 'mock-jwt-token';
            const expiresAt = Date.now() + 3600000; // 1 hour from now

            // Store in localStorage for persistence
            localStorage.setItem('demo_token', token);
            localStorage.setItem('demo_user', JSON.stringify(user));

            return createApiResponse({
                userId: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: token,
                expiresAt: expiresAt
            }, 'Login successful');
        } else {
            throw {
                response: {
                    data: {
                        success: false,
                        message: 'Invalid username or password'
                    }
                }
            };
        }
    },

    register: async (userData) => {
        await randomDelay();

        // Check if username or email already exists
        if (users.some(u => u.username === userData.username)) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: 'Username already taken'
                    }
                }
            };
        }

        if (users.some(u => u.email === userData.email)) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: 'Email already in use'
                    }
                }
            };
        }

        // Create new user
        const newUser = {
            id: uuidv4(),
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName || null,
            lastName: userData.lastName || null,
            role: userData.role || 'ANALYST',
            active: true
        };

        // Add to mock database
        users.push(newUser);

        return createApiResponse(null, 'Registration successful');
    },

    logout: async () => {
        await randomDelay();

        // Clear stored data
        localStorage.removeItem('demo_token');
        localStorage.removeItem('demo_user');

        return createApiResponse(null, 'Logged out successfully');
    }
};

// Companies API
// Companies API
export const companiesAPI = {
    getCompanies: async (params) => {
        await randomDelay();

        let filteredCompanies = [...companies];

        // Apply filters if provided
        if (params?.sector) {
            filteredCompanies = filteredCompanies.filter(c => c.sector === params.sector);
        }

        // Apply pagination
        const pagedData = paginate(filteredCompanies, params?.page || 0, params?.size || 10);

        return createApiResponse(pagedData);
    },

    getCompanyById: async (id) => {
        await randomDelay();

        const company = companies.find(c => c.id === parseInt(id));

        if (!company) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Company not found with id: ${id}`
                    }
                }
            };
        }

        return createApiResponse(company);
    },

    getCompanyRiskProfile: async (id) => {
        await randomDelay();

        const riskProfile = dashboardData.companyRiskSummary.find(r => r.companyId === parseInt(id));

        if (!riskProfile) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Risk profile not found for company id: ${id}`
                    }
                }
            };
        }

        return createApiResponse(riskProfile);
    },

    createCompany: async (companyData) => {
        await randomDelay();

        try {
            // Check if company name or stock code already exists
            if (companies.some(c => c.name === companyData.name)) {
                throw {
                    response: {
                        data: {
                            success: false,
                            message: 'Company name already exists'
                        }
                    }
                };
            }

            if (companies.some(c => c.stockCode === companyData.stockCode)) {
                throw {
                    response: {
                        data: {
                            success: false,
                            message: 'Stock code already exists'
                        }
                    }
                };
            }

            // Create new company
            const newCompany = {
                id: companies.length + 1,
                name: companyData.name,
                stockCode: companyData.stockCode,
                sector: companyData.sector || '',
                listingDate: companyData.listingDate || new Date().toISOString().split('T')[0],
                description: companyData.description || ''
            };

            // Add to mock database
            companies.push(newCompany);

            return createApiResponse(newCompany, 'Company created successfully');
        } catch (error) {
            // Pass through the error
            throw error;
        }
    },

    updateCompany: async (id, companyData) => {
        await randomDelay();

        try {
            // Find the company
            const companyIndex = companies.findIndex(c => c.id === parseInt(id));

            if (companyIndex === -1) {
                throw {
                    response: {
                        data: {
                            success: false,
                            message: `Company not found with id: ${id}`
                        }
                    }
                };
            }

            // Check if updated name or stock code conflicts with existing ones
            if (companyData.name !== companies[companyIndex].name &&
                companies.some(c => c.name === companyData.name)) {
                throw {
                    response: {
                        data: {
                            success: false,
                            message: 'Company name already exists'
                        }
                    }
                };
            }

            if (companyData.stockCode !== companies[companyIndex].stockCode &&
                companies.some(c => c.stockCode === companyData.stockCode)) {
                throw {
                    response: {
                        data: {
                            success: false,
                            message: 'Stock code already exists'
                        }
                    }
                };
            }

            // Update company
            const updatedCompany = {
                ...companies[companyIndex],
                name: companyData.name,
                stockCode: companyData.stockCode,
                sector: companyData.sector || companies[companyIndex].sector,
                listingDate: companyData.listingDate || companies[companyIndex].listingDate,
                description: companyData.description || companies[companyIndex].description
            };

            companies[companyIndex] = updatedCompany;

            return createApiResponse(updatedCompany, 'Company updated successfully');
        } catch (error) {
            // Pass through the error
            throw error;
        }
    }
};

// Financial Statements API
export const statementsAPI = {
    getStatements: async (params) => {
        await randomDelay();

        let filteredStatements = [...statements];

        // Apply filters if provided
        if (params?.companyId) {
            filteredStatements = filteredStatements.filter(s => s.companyId === parseInt(params.companyId));
        }

        if (params?.statementType) {
            filteredStatements = filteredStatements.filter(s => s.statementType === params.statementType);
        }

        if (params?.status) {
            filteredStatements = filteredStatements.filter(s => s.status === params.status);
        }

        // Apply pagination
        const pagedData = paginate(filteredStatements, params?.page || 0, params?.size || 10);

        return createApiResponse(pagedData);
    },

    getStatementById: async (id) => {
        await randomDelay();

        const statement = statements.find(s => s.id === parseInt(id));

        if (!statement) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Statement not found with id: ${id}`
                    }
                }
            };
        }

        return createApiResponse(statement);
    }
};

// Financial Data API
export const financialDataAPI = {
    getFinancialDataByStatementId: async (statementId) => {
        await randomDelay();

        const data = financialData.find(d => d.statementId === parseInt(statementId));

        if (!data) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Financial data not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(data);
    }
};

// Risk Assessment API
export const riskAPI = {
    performRiskAssessment: async (statementId) => {
        await randomDelay();

    },
    getRiskAssessments: async (params) => {
        await randomDelay();

        let filteredAssessments = [...riskAssessments];

        // Apply filters
        if (params?.companyId) {
            filteredAssessments = filteredAssessments.filter(a => a.companyId === parseInt(params.companyId));
        }

        if (params?.riskLevel) {
            filteredAssessments = filteredAssessments.filter(a => a.riskLevel === params.riskLevel);
        }

        // Apply pagination
        const pagedData = paginate(filteredAssessments, params?.page || 0, params?.size || 10);

        return createApiResponse(pagedData);
    },

    getRiskAssessmentById: async (id) => {
        await randomDelay();

        const assessment = riskAssessments.find(a => a.id === parseInt(id));

        if (!assessment) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Risk assessment not found with id: ${id}`
                    }
                }
            };
        }

        return createApiResponse(assessment);
    },

    getRiskAssessmentByStatementId: async (statementId) => {
        await randomDelay();

        const assessment = riskAssessments.find(a => a.statementId === parseInt(statementId));

        if (!assessment) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Risk assessment not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(assessment);
    },

    getRiskAlerts: async (params) => {
        await randomDelay();

        let filteredAlerts = [...riskAlerts];

        // Apply filters
        if (params?.assessmentId) {
            filteredAlerts = filteredAlerts.filter(a => a.assessmentId === parseInt(params.assessmentId));
        }

        if (params?.severity) {
            filteredAlerts = filteredAlerts.filter(a => a.severity === params.severity);
        }

        if (params?.isResolved !== undefined) {
            filteredAlerts = filteredAlerts.filter(a => a.isResolved === params.isResolved);
        }

        // Apply pagination
        const pagedData = paginate(filteredAlerts, params?.page || 0, params?.size || 10);

        return createApiResponse(pagedData);
    }
};

// Financial Analysis API
export const analysisAPI = {
    getFinancialRatiosByStatementId: async (statementId) => {
        await randomDelay();

        const ratios = financialRatios.find(r => r.statementId === parseInt(statementId));

        if (!ratios) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Financial ratios not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(ratios);
    },

    getAltmanZScoreByStatementId: async (statementId) => {
        await randomDelay();

        const zScore = zScores.find(z => z.statementId === parseInt(statementId));

        if (!zScore) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `Z-Score not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(zScore);
    },

    getBeneishMScoreByStatementId: async (statementId) => {
        await randomDelay();

        const mScore = mScores.find(m => m.statementId === parseInt(statementId));

        if (!mScore) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `M-Score not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(mScore);
    },

    getPiotroskiFScoreByStatementId: async (statementId) => {
        await randomDelay();

        const fScore = fScores.find(f => f.statementId === parseInt(statementId));

        if (!fScore) {
            throw {
                response: {
                    data: {
                        success: false,
                        message: `F-Score not found for statement id: ${statementId}`
                    }
                }
            };
        }

        return createApiResponse(fScore);
    }
};

// Dashboard API
export const dashboardAPI = {
    fraudIndicatorsDistribution: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.fraudIndicatorsDistribution);
    },
    companyRiskSummary: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.companyRiskSummary);
    },
    fraudRiskStats: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.fraudRiskStats);
    },
    fraudRiskTrends: async() => {
        await randomDelay();
        return createApiResponse(dashboardData.fraudRiskTrends);
    },
    recentRiskAlerts: async() => {
        await randomDelay();
        return createApiResponse(dashboardData.recentRiskAlerts);
    },
    getFraudRiskStats: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.fraudRiskStats);
    },

    getCompanyRiskSummary: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.companyRiskSummary);
    },

    getFraudIndicatorsDistribution: async () => {
        await randomDelay();
        return createApiResponse(dashboardData.fraudIndicatorsDistribution);
    },

    getRecentRiskAlerts: async (limit = 5) => {
        await randomDelay();
        const limitedAlerts = dashboardData.recentRiskAlerts;
        return createApiResponse(limitedAlerts);
    },

    getFraudRiskTrends: async (companyId) => {
        await randomDelay();

        // If companyId provided, filter the data (in a real app)
        // For demo, we just return the same data
        return createApiResponse(dashboardData.fraudRiskTrends);
    }
};

export default {
    auth: authAPI,
    companies: companiesAPI,
    statements: statementsAPI,
    financialData: financialDataAPI,
    risk: riskAPI,
    analysis: analysisAPI,
    dashboard: dashboardAPI
};