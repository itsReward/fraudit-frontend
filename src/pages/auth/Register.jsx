import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const Register = () => {
    const { register, isAuthenticated } = useAuth();
    const [registerError, setRegisterError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            role: 'ANALYST',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .max(30, 'Username must be at most 30 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                )
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
            firstName: Yup.string(),
            lastName: Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                setRegisterError(null);

                // Remove confirmPassword before sending to API
                const { confirmPassword, ...userData } = values;

                await register(userData);
                setRegisterSuccess(true);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                setRegisterError(error.response?.data?.message || 'An error occurred during registration');
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-primary-600">Fraudit</h1>
                    <h2 className="mt-6 text-center text-2xl font-bold text-secondary-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-secondary-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                {registerSuccess && (
                    <Alert
                        variant="success"
                        title="Registration successful!"
                    >
                        Your account has been created. You will be redirected to the login page shortly.
                    </Alert>
                )}

                {registerError && (
                    <Alert
                        variant="danger"
                        title="Registration failed"
                        dismissible
                        onDismiss={() => setRegisterError(null)}
                    >
                        {registerError}
                    </Alert>
                )}

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="username" className="block text-sm font-medium text-secondary-700">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            formik.touched.username && formik.errors.username
                                                ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                                : 'border-secondary-300 placeholder-secondary-500'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.username && formik.errors.username && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.username}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            formik.touched.email && formik.errors.email
                                                ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                                : 'border-secondary-300 placeholder-secondary-500'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700">
                                    First name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        className="appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.firstName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700">
                                    Last name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className="appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            formik.touched.password && formik.errors.password
                                                ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                                : 'border-secondary-300 placeholder-secondary-500'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                                    Confirm password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            formik.touched.confirmPassword && formik.errors.confirmPassword
                                                ? 'border-danger-300 text-danger-900 placeholder-danger-300'
                                                : 'border-secondary-300 placeholder-secondary-500'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-danger-600">{formik.errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={!formik.isValid || formik.isSubmitting || registerSuccess}
                            isLoading={formik.isSubmitting}
                        >
                            Create account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;