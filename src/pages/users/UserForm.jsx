import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '../../api/users';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { FiSave, FiX } from 'react-icons/fi';

const UserForm = ({ user = null, onSuccess, onCancel }) => {
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const isEditMode = !!user;

    // Validation schema
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters')
            .required('Username is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        firstName: Yup.string(),
        lastName: Yup.string(),
        role: Yup.string().required('Role is required'),
        password: isEditMode
            ? Yup.string() // password not required for edit
            : Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                )
                .required('Password is required'),
        confirmPassword: isEditMode
            ? Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
            : Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
    });

    // Create mutation for adding/updating user
    const mutation = useMutation(
        (values) => {
            // Remove confirmPassword and empty password (for edit mode) before sending to API
            const userData = { ...values };
            delete userData.confirmPassword;

            if (isEditMode && !userData.password) {
                delete userData.password;
            }

            return isEditMode
                ? updateUser(user.id, userData)
                : createUser(userData);
        },
        {
            onSuccess: (data) => {
                setSuccess(true);
                queryClient.invalidateQueries('users');

                // Call the success callback after a brief delay
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess(data?.data?.data);
                    }, 1500);
                }
            },
            onError: (err) => {
                setError(err.response?.data?.message || 'Failed to save user');
            },
        }
    );

    // Initialize form
    const formik = useFormik({
        initialValues: {
            username: user?.username || '',
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            role: user?.role || 'ANALYST',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setError(null);
            setSuccess(false);
            mutation.mutate(values);
        },
        enableReinitialize: true,
    });

    // Available roles
    const roleOptions = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'REGULATOR', label: 'Regulator' },
        { value: 'AUDITOR', label: 'Auditor' },
        { value: 'ANALYST', label: 'Analyst' },
    ];

    return (
        <Card
            title={isEditMode ? 'Edit User' : 'Add New User'}
            subtitle={isEditMode ? 'Update user information' : 'Enter details to add a new user'}
        >
            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    dismissible
                    onDismiss={() => setError(null)}
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    variant="success"
                    title="Success"
                    dismissible
                    onDismiss={() => setSuccess(false)}
                    className="mb-4"
                >
                    {isEditMode
                        ? 'User updated successfully!'
                        : 'User created successfully!'}
                </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                        label="Username"
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && formik.errors.username}
                        required
                        disabled={isEditMode} // Username cannot be changed after creation
                    />

                    <Input
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                        required
                    />

                    <Input
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && formik.errors.firstName}
                    />

                    <Input
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && formik.errors.lastName}
                    />

                    <Select
                        label="Role"
                        id="role"
                        name="role"
                        options={roleOptions}
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.role && formik.errors.role}
                        required
                    />
                </div>

                <div className="border-t border-secondary-200 pt-4">
                    <h3 className="text-sm font-medium text-secondary-900 mb-3">
                        {isEditMode ? 'Change Password (leave blank to keep current)' : 'Set Password'}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder={isEditMode ? "Enter new password" : "Enter password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && formik.errors.password}
                            required={!isEditMode}
                            helpText={isEditMode ? "Leave blank to keep current password" : ""}
                        />

                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            required={!isEditMode || !!formik.values.password}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={mutation.isLoading}
                    >
                        <FiX className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={mutation.isLoading}
                        disabled={mutation.isLoading || !formik.isValid}
                    >
                        <FiSave className="h-4 w-4 mr-2" />
                        {isEditMode ? 'Update User' : 'Create User'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default UserForm;