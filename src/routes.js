import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Authentication pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Companies
import CompaniesList from './pages/companies/CompaniesList';
import CompanyDetail from './pages/companies/CompanyDetail';
import CompanyForm from './pages/companies/CompanyForm';

// Financial statements
import StatementsList from './pages/financial/StatementsList';
import StatementDetail from './pages/financial/StatementDetail';
import StatementForm from './pages/financial/StatementForm';

// Risk management
import RiskAssessmentsList from './pages/risk/RiskAssessmentsList';
import RiskAssessmentDetail from './pages/risk/RiskAssessmentDetail';
import AlertsList from './pages/risk/AlertsList';
import AlertResolveForm from './pages/risk/AlertResolveForm';

// Reports
import ReportsList from './pages/reports/ReportsList';
import GenerateReport from './pages/reports/GenerateReport';

// User management
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';

// Settings
import Settings from './pages/settings/Settings';

// Define roles for route access control
const ROLES = {
    ADMIN: 'ADMIN',
    REGULATOR: 'REGULATOR',
    AUDITOR: 'AUDITOR',
    ANALYST: 'ANALYST'
};

// Route definitions with authentication and role-based access control
const routes = [
    // Public routes (no authentication required)
    {
        path: '/login',
        element: <Login />,
        public: true
    },
    {
        path: '/register',
        element: <Register />,
        public: true
    },

    // Protected routes (authentication required)
    {
        path: '/',
        element: <AppLayout />,
        children: [
            // Dashboard
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Companies
            {
                path: 'companies',
                element: <CompaniesList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'companies/:id',
                element: <CompanyDetail />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'companies/new',
                element: <CompanyForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR]
            },
            {
                path: 'companies/:id/edit',
                element: <CompanyForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR]
            },

            // Statements
            {
                path: 'statements',
                element: <StatementsList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'statements/:id',
                element: <StatementDetail />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'statements/new',
                element: <StatementForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'statements/:id/edit',
                element: <StatementForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Risk
            {
                path: 'risk',
                element: <RiskAssessmentsList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'risk/assessments/:id',
                element: <RiskAssessmentDetail />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'risk/assessments/statement/:statementId',
                element: <RiskAssessmentDetail />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'risk/alerts',
                element: <AlertsList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'risk/alerts/:id/resolve',
                element: <AlertResolveForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Reports
            {
                path: 'reports',
                element: <ReportsList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'reports/generate',
                element: <GenerateReport />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Users
            {
                path: 'users',
                element: <UsersList />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR]
            },
            {
                path: 'users/:id',
                element: <UserForm />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR]
            },
            {
                path: 'users/new',
                element: <UserForm />,
                allowedRoles: [ROLES.ADMIN]
            },

            // Settings
            {
                path: 'settings',
                element: <Settings />,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Machine Learning Models (placeholder based on sidebar)
            {
                path: 'ml/models',
                element: <div>ML Models Page</div>,
                allowedRoles: [ROLES.ADMIN, ROLES.ANALYST]
            },

            // Documents (placeholder based on sidebar)
            {
                path: 'documents',
                element: <div>Documents Page</div>,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },
            {
                path: 'documents/statement/:statementId',
                element: <div>Statement Documents Page</div>,
                allowedRoles: [ROLES.ADMIN, ROLES.REGULATOR, ROLES.AUDITOR, ROLES.ANALYST]
            },

            // Fallback for any unknown routes within protected area
            {
                path: '*',
                element: <Navigate to="/dashboard" replace />
            }
        ]
    },

    // Fallback for any unknown routes
    {
        path: '*',
        element: <Navigate to="/login" replace />
    }
];

export default routes;