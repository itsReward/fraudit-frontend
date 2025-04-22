// src/config.js - Updated configuration
const config = {
    // API configuration
    api: {
        // Base URL for API endpoints
        baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',

        // Enable demo mode (no backend required)
        // Set to false when connecting to a real backend
        demoMode: process.env.REACT_APP_DEMO_MODE === 'false' || false,

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
        description: 'Financial Fraud Detection System for Zimbabwe Stock Exchange',

        // Toast settings
        toast: {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        }
    }
};

export default config;