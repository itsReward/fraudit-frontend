import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Loading from './components/common/Loading';

// Lazy-loaded components for better performance
// Note the change in import format - we're using the default export
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
const AlertsList = React.lazy(() => import('./pages/risk/AlertsList').then(module => ({ default: module.default })));
const ReportsList = React.lazy(() => import('./pages/reports/ReportsList').then(module => ({ default: module.default })));
const GenerateReport = React.lazy(() => import('./pages/reports/GenerateReport').then(module => ({ default: module.default })));
const UsersList = React.lazy(() => import('./pages/users/UsersList').then(module => ({ default: module.default })));
const UserForm = React.lazy(() => import('./pages/users/UserForm').then(module => ({ default: module.default })));
const Settings = React.lazy(() => import('./pages/settings/Settings').then(module => ({ default: module.default })));
const DocumentsList = React.lazy(() => import('./pages/documents/DocumentsList').then(module => ({ default: module.default })));
const DocumentDetail = React.lazy(() => import('./pages/documents/DocumentDetail').then(module => ({ default: module.default })));
const StatementDocuments = React.lazy(() => import('./pages/documents/StatementDocuments').then(module => ({ default: module.default })));


// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
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
                        <Route path=":id" element={<CompanyDetail />} />
                        <Route
                            path="new"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                    <CompanyForm />
                                </ProtectedRoute>
                            }
                        />
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
                        <Route path=":id" element={<StatementDetail />} />
                        <Route path="new" element={<StatementForm />} />
                        <Route path=":id/edit" element={<StatementForm />} />
                    </Route>

                    {/* Risk Assessments */}
                    <Route path="risk">
                        <Route index element={<RiskAssessmentsList />} />
                        <Route path="assessments/:id" element={<RiskAssessmentDetail />} />
                        <Route path="alerts" element={<AlertsList />} />
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
                            path=":id"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN', 'REGULATOR']}>
                                    <UserForm />
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
                    </Route>

                    {/* Settings */}
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />

                {/* Documents */}
                <Route path="documents" element={<DocumentsList />} />
                <Route path="documents/:id" element={<DocumentDetail />} />
                <Route path="documents/statement/:statementId" element={<StatementDocuments />} />
            </Routes>
        </Suspense>
    );
}

export default App;