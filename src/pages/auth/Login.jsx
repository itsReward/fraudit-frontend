import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const Login = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const [loginError, setLoginError] = useState(null);
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoginError(null);
                await login(values);
            } catch (error) {
                setLoginError(error.response?.data?.message || 'An error occurred during login');
            }
        },
    });

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }


    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-primary-600">Fraudit</h1>
                    <h2 className="mt-6 text-center text-2xl font-bold text-secondary-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-secondary-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                {loginError && (
                    <Alert
                        variant="danger"
                        title="Login failed"
                        dismissible
                        onDismiss={() => setLoginError(null)}
                    >
                        {loginError}
                    </Alert>
                )}

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    formik.touched.username && formik.errors.username
                                        ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                        : 'border-secondary-300 placeholder-secondary-500'
                                } text-secondary-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                                placeholder="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-danger-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    formik.touched.password && formik.errors.password
                                        ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                        : 'border-secondary-300 placeholder-secondary-500'
                                } text-secondary-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-danger-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                checked={formik.values.rememberMe}
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-secondary-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={loading}
                            disabled={loading || !formik.isValid}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;