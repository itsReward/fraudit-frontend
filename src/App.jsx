// src/App.jsx (UPDATED)
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationsProvider } from './contexts/NotificationsContext';
import NotificationToastContainer from './components/notifications/NotificationToastContainer';

// Lazy-loaded components for better performance
const Login = React.lazy(() => import('./pages/auth/Login').then(module => ({ default: module.default })));
const Register = React.lazy(() => import('./pages/auth/Register').then(module => ({ default: module.default })));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard').then(module => ({ default: module.default })));
const CompaniesList = React.lazy(() => import('./pages/companies/CompaniesList').then(module => ({ default: module.default })));
const CompanyDetail = React.lazy(() => import('./pages/companies/CompanyDetail').then(module => ({ default: module.default })));
const CompanyForm = React.lazy(() => import('./pages/companies/CompanyForm').then(module => ({ default: module.default })));
const StatementsList = React.lazy(() => import('./pages/financial/StatementsList').then(module => ({ default: module.default })));
const StatementDetail = React.lazy(() => import('./pages/financial/StatementDetail').then(module => ({ default: module.default })));
const StatementForm = React.lazy(() => import('./pages/financial/StatementForm').then(module => ({ default: module.default })));
const RiskAssessmentsList = React.lazy(() => import('./pages/risk/RiskAssessmentsList').then(module => ({ default: module.default })));
const RiskAssessmentDetail = React.lazy(() => import('./pages/risk/RiskAssessmentDetail').then(module => ({ default: module.default })));
const AlertsPage = React.lazy(() => import('./pages/risk/AlertsPage').then(module => ({ default: module.default })));
const AlertDetailPage = React.lazy(() => import('./pages/risk/AlertDetailPage').then(module => ({ default: module.default })));
const ReportsList = React.lazy(() => import('./pages/reports/ReportsList').then(module => ({ default: module.default })));
const GenerateReport = React.lazy(() => import('./pages/reports/GenerateReport').then(module => ({ default: module.default })));
const UsersList = React.lazy(() => import('./pages/users/UsersList').then(module => ({ default: module.default })));
const UserForm = React.lazy(() => import('./pages/users/UserForm').then(module => ({ default: module.default })));
const Settings = React.lazy(() => import('./pages/settings/Settings').then(module => ({ default: module.default })));
const DocumentsList = React.lazy(() => import('./pages/documents/DocumentsList').then(module => ({ default: module.default })));
const DocumentDetail = React.lazy(() => import('./pages/documents/DocumentDetail').then(module => ({ default: module.default })));
const StatementDocuments = React.lazy(() => import('./pages/documents/StatementDocuments').then(module => ({ default: module.default })));
const MLModelsList = React.lazy(() => import('./pages/ml/MLModelsList').then(module => ({ default: module.default })));
const MLModelForm = React.lazy(() => import('./pages/ml/MLModelForm').then(module => ({ default: module.default })));
const MLModelPerformance = React.lazy(() => import('./pages/ml/MLModelPerformance').then(module => ({ default: module.default })));

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Provide user feedback when they don't have permission
        console.warn(`User with role ${user.role} attempted to access a route requiring roles: ${allowedRoles.join(', ')}`);
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-xl font-semibold text-danger-600 mb-4">Access Denied</h2>
                    <p className="text-secondary-700 mb-4">
                        You don't have permission to access this page. This page requires one of the following roles: {allowedRoles.join(', ')}.
                    </p>
                    <p className="text-secondary-700 mb-6">
                        Your current role is: <span className="font-semibold">{user.role}</span>
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <ErrorBoundary>
            <NotificationsProvider>
                {isAuthenticated && <NotificationToastContainer />}
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loading /></div>}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />

                            {/* Companies */}
                            <Route path="companies">
                                <Route index element={<CompaniesList />} />
                                <Route
                                    path="new"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                            <CompanyForm />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path=":id" element={<CompanyDetail />} />
                                <Route
                                    path=":id/edit"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                            <CompanyForm />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* Financial Statements */}
                            <Route path="statements">
                                <Route index element={<StatementsList />} />
                                <Route path="new" element={<StatementForm />} />
                                <Route path=":id" element={<StatementDetail />} />
                                <Route path=":id/edit" element={<StatementForm />} />
                            </Route>

                            {/* Risk Management */}
                            <Route path="risk">
                                <Route index element={<RiskAssessmentsList />} />
                                <Route path="assessments/:id" element={<RiskAssessmentDetail />} />
                                <Route path="assessments/statement/:statementId" element={<RiskAssessmentDetail />} />
                                <Route path="alerts" element={<AlertsPage />} />
                                <Route path="alerts/:id" element={<AlertDetailPage />} />
                            </Route>

                            {/* Reports */}
                            <Route path="reports">
                                <Route index element={<ReportsList />} />
                                <Route path="generate" element={<GenerateReport />} />
                            </Route>

                            {/* Users Management */}
                            <Route path="users">
                                <Route
                                    index
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                            <UsersList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <UserForm />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path=":id"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                            <UserForm />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* Settings */}
                            <Route path="settings" element={<Settings />} />

                            {/* Documents */}
                            <Route path="documents">
                                <Route index element={<DocumentsList />} />
                                <Route path="statement/:statementId" element={<StatementDocuments />} />
                                <Route path=":id" element={<DocumentDetail />} />
                            </Route>

                            {/* ML Models */}
                            <Route path="ml">
                                <Route path="models">
                                    <Route index element={<MLModelsList />} />
                                    <Route path="new" element={<MLModelForm />} />
                                    <Route path=":id/edit" element={<MLModelForm />} />
                                    <Route path="performance" element={<MLModelPerformance />} />
                                </Route>
                            </Route>
                        </Route>

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </NotificationsProvider>
        </ErrorBoundary>
    );
}

export default App;