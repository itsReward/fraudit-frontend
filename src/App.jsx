import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Loading from './components/common/Loading';

// Lazy-loaded components for better performance
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const CompaniesList = React.lazy(() => import('./pages/companies/CompaniesList'));
const CompanyDetail = React.lazy(() => import('./pages/companies/CompanyDetail'));
const CompanyForm = React.lazy(() => import('./pages/companies/CompanyForm'));
const StatementsList = React.lazy(() => import('./pages/financial/StatementsList'));
const StatementDetail = React.lazy(() => import('./pages/financial/StatementDetail'));
const StatementForm = React.lazy(() => import('./pages/financial/StatementForm'));
const RiskAssessmentsList = React.lazy(() => import('./pages/risk/RiskAssessmentsList'));
const RiskAssessmentDetail = React.lazy(() => import('./pages/risk/RiskAssessmentDetail'));
const AlertsList = React.lazy(() => import('./pages/risk/AlertsList'));
const ReportsList = React.lazy(() => import('./pages/reports/ReportsList'));
const GenerateReport = React.lazy(() => import('./pages/reports/GenerateReport'));
const UsersList = React.lazy(() => import('./pages/users/UsersList'));
const UserForm = React.lazy(() => import('./pages/users/UserForm'));
const Settings = React.lazy(() => import('./pages/settings/Settings'));

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
            </Routes>
        </Suspense>
    );
}

export default App;