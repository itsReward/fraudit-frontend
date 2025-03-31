// src/config.js
const config = {
    // API configuration
    api: {
        // Base URL for API endpoints
        baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

        // Enable demo mode (no backend required)
        demoMode: true,

        // Demo mode settings
        demo: {
            // Demo credentials for quick login
            defaultUsername: 'admin',
            defaultPassword: 'password',

            // Simulated network delay (ms)
            minDelay: 300,
            maxDelay: 1000
        }
    },

    // App settings
    app: {
        name: 'Fraudit',
        version: '1.0.0',
        description: 'Financial Fraud Detection System'
    }
};

export default config;