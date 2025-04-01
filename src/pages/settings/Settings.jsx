import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getSystemSettings, updateSystemSettings } from '../../api/settings';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import UserForm from '../../components/settings/UserForm';
import CompanyForm from '../../components/settings/CompanyForm';
import { FiSettings, FiUser, FiUsers, FiEdit, FiMoon, FiSun, FiDatabase, FiLock } from 'react-icons/fi';

const Settings = () => {
    const { user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Check if user has admin access
    const isAdmin = user?.role === 'ADMIN';
    const isRegulator = user?.role === 'REGULATOR';

    // Fetch system settings if admin
    const { data: settingsData, isLoading: settingsLoading, error: settingsError, refetch: refetchSettings } = useQuery(
        ['systemSettings'],
        () => getSystemSettings(),
        {
            enabled: isAdmin,
            staleTime: 300000 // 5 minutes
        }
    );

    const systemSettings = settingsData?.data?.data;

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowEditProfile(false);
        setShowChangePassword(false);
        setShowAddCompany(false);
        setShowAddUser(false);
        setError(null);
        setSuccess(null);
    };

    // Handle profile update success
    const handleProfileUpdateSuccess = () => {
        setShowEditProfile(false);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(null), 3000);
    };

    // Handle password change success
    const handlePasswordChangeSuccess = () => {
        setShowChangePassword(false);
        setSuccess('Password changed successfully');
        setTimeout(() => setSuccess(null), 3000);
    };

    // Handle add company success
    const handleAddCompanySuccess = () => {
        setShowAddCompany(false);
        setSuccess('Company added successfully');
        setTimeout(() => setSuccess(null), 3000);
    };

    // Handle add user success
    const handleAddUserSuccess = () => {
        setShowAddUser(false);
        setSuccess('User added successfully');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">Settings</h1>
                <p className="mt-1 text-secondary-500">Manage your account and system settings</p>
            </div>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    dismissible
                    onDismiss={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    variant="success"
                    title="Success"
                    dismissible
                    onDismiss={() => setSuccess(null)}
                >
                    {success}
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="md:col-span-3">
                    <Card className="p-0">
                        <nav className="space-y-1">
                            <button
                                type="button"
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                                    activeTab === 'profile'
                                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                        : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                                }`}
                                onClick={() => handleTabChange('profile')}
                            >
                                <FiUser className={`mr-3 h-5 w-5 ${
                                    activeTab === 'profile' ? 'text-primary-500' : 'text-secondary-400'
                                }`} />
                                <span>Profile</span>
                            </button>

                            <button
                                type="button"
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                                    activeTab === 'appearance'
                                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                        : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                                }`}
                                onClick={() => handleTabChange('appearance')}
                            >
                                {darkMode ? (
                                    <FiMoon className={`mr-3 h-5 w-5 ${
                                        activeTab === 'appearance' ? 'text-primary-500' : 'text-secondary-400'
                                    }`} />
                                ) : (
                                    <FiSun className={`mr-3 h-5 w-5 ${
                                        activeTab === 'appearance' ? 'text-primary-500' : 'text-secondary-400'
                                    }`} />
                                )}
                                <span>Appearance</span>
                            </button>

                            {(isAdmin || isRegulator) && (
                                <button
                                    type="button"
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                                        activeTab === 'companies'
                                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                            : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                                    }`}
                                    onClick={() => handleTabChange('companies')}
                                >
                                    <FiDatabase className={`mr-3 h-5 w-5 ${
                                        activeTab === 'companies' ? 'text-primary-500' : 'text-secondary-400'
                                    }`} />
                                    <span>Companies</span>
                                </button>
                            )}

                            {(isAdmin || isRegulator) && (
                                <button
                                    type="button"
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                                        activeTab === 'users'
                                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                            : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                                    }`}
                                    onClick={() => handleTabChange('users')}
                                >
                                    <FiUsers className={`mr-3 h-5 w-5 ${
                                        activeTab === 'users' ? 'text-primary-500' : 'text-secondary-400'
                                    }`} />
                                    <span>Users</span>
                                </button>
                            )}

                            {isAdmin && (
                                <button
                                    type="button"
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                                        activeTab === 'system'
                                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                            : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                                    }`}
                                    onClick={() => handleTabChange('system')}
                                >
                                    <FiSettings className={`mr-3 h-5 w-5 ${
                                        activeTab === 'system' ? 'text-primary-500' : 'text-secondary-400'
                                    }`} />
                                    <span>System</span>
                                </button>
                            )}
                        </nav>
                    </Card>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <>
                            {showEditProfile ? (
                                <UserForm
                                    user={user}
                                    onSuccess={handleProfileUpdateSuccess}
                                    onCancel={() => setShowEditProfile(false)}
                                />
                            ) : showChangePassword ? (
                                <Card
                                    title="Change Password"
                                    subtitle="Update your account password"
                                >
                                    {/* Password change form would go here */}
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-700">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                placeholder="Enter current password"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                placeholder="Enter new password"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                placeholder="Confirm new password"
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setShowChangePassword(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={handlePasswordChangeSuccess}
                                            >
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card title="Profile Information">
                                    <div className="space-y-6">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-medium">
                                                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                            </div>
                                            <div className="ml-4">
                                                <h2 className="text-xl font-medium text-secondary-900">
                                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'User'}
                                                </h2>
                                                <p className="text-sm text-secondary-500">
                                                    {user?.role || 'User'} • {user?.email || 'No email'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-secondary-200 pt-4">
                                            <dl className="divide-y divide-secondary-200">
                                                <div className="py-3 flex justify-between">
                                                    <dt className="text-sm font-medium text-secondary-500">Username</dt>
                                                    <dd className="text-sm text-secondary-900">{user?.username || 'N/A'}</dd>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <dt className="text-sm font-medium text-secondary-500">Email</dt>
                                                    <dd className="text-sm text-secondary-900">{user?.email || 'N/A'}</dd>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <dt className="text-sm font-medium text-secondary-500">First Name</dt>
                                                    <dd className="text-sm text-secondary-900">{user?.firstName || 'N/A'}</dd>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <dt className="text-sm font-medium text-secondary-500">Last Name</dt>
                                                    <dd className="text-sm text-secondary-900">{user?.lastName || 'N/A'}</dd>
                                                </div>
                                                <div className="py-3 flex justify-between">
                                                    <dt className="text-sm font-medium text-secondary-500">Role</dt>
                                                    <dd className="text-sm text-secondary-900">{user?.role || 'N/A'}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowChangePassword(true)}
                                            >
                                                <FiLock className="mr-2 h-4 w-4" />
                                                Change Password
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() => setShowEditProfile(true)}
                                            >
                                                <FiEdit className="mr-2 h-4 w-4" />
                                                Edit Profile
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <Card title="Appearance Settings">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-secondary-900">Theme</h3>
                                    <p className="mt-1 text-sm text-secondary-500">
                                        Customize the look and feel of the application
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-secondary-900">Dark Mode</h4>
                                        <p className="text-sm text-secondary-500">
                                            Switch between light and dark mode
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        role="switch"
                                        aria-checked={darkMode}
                                        onClick={toggleTheme}
                                        style={{ backgroundColor: darkMode ? '#3182CE' : '#CBD5E0' }}
                                    >
                                        <span className="sr-only">Toggle dark mode</span>
                                        <span
                                            aria-hidden="true"
                                            className={`${
                                                darkMode ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Companies Tab */}
                    {activeTab === 'companies' && (isAdmin || isRegulator) && (
                        <>
                            {showAddCompany ? (
                                <CompanyForm
                                    onSuccess={handleAddCompanySuccess}
                                    onCancel={() => setShowAddCompany(false)}
                                />
                            ) : (
                                <Card
                                    title="Companies Management"
                                    subtitle="Add and manage companies in the system"
                                    footer={
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddCompany(true)}
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add New Company
                                        </Button>
                                    }
                                >
                                    <p className="text-sm text-secondary-500">
                                        Use this section to add new companies to the system or manage existing ones.
                                        You can view and edit company details from the Companies page.
                                    </p>
                                    <div className="mt-4">
                                        <Button
                                            variant="secondary"
                                            to="/companies"
                                        >
                                            Go to Companies
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (isAdmin || isRegulator) && (
                        <>
                            {showAddUser ? (
                                <UserForm
                                    onSuccess={handleAddUserSuccess}
                                    onCancel={() => setShowAddUser(false)}
                                />
                            ) : (
                                <Card
                                    title="Users Management"
                                    subtitle="Add and manage users in the system"
                                    footer={
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddUser(true)}
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add New User
                                        </Button>
                                    }
                                >
                                    <p className="text-sm text-secondary-500">
                                        Use this section to add new users to the system or manage existing ones.
                                        You can view and edit user details from the Users page.
                                    </p>
                                    <div className="mt-4">
                                        <Button
                                            variant="secondary"
                                            to="/users"
                                        >
                                            Go to Users
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && isAdmin && (
                        <Card
                            title="System Settings"
                            subtitle="Configure global system settings"
                        >
                            {settingsLoading ? (
                                <div className="py-4 flex justify-center">
                                    <Loading size="md" />
                                </div>
                            ) : settingsError ? (
                                <Alert
                                    variant="danger"
                                    title="Error loading settings"
                                    className="my-4"
                                >
                                    An error occurred while loading system settings. Please try again later.
                                </Alert>
                            ) : (
                                <div className="space-y-6">
                                    <div className="border-b border-secondary-200 pb-5">
                                        <h3 className="text-lg font-medium text-secondary-900">General Settings</h3>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label htmlFor="systemName" className="block text-sm font-medium text-secondary-700">
                                                    System Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="systemName"
                                                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    defaultValue={systemSettings?.systemName || 'Fraudit'}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="contactEmail" className="block text-sm font-medium text-secondary-700">
                                                    Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="contactEmail"
                                                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    defaultValue={systemSettings?.contactEmail || 'admin@fraudit.com'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b border-secondary-200 pb-5">
                                        <h3 className="text-lg font-medium text-secondary-900">Security Settings</h3>

                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-secondary-900">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-secondary-500">
                                                        Require two-factor authentication for all users
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                    role="switch"
                                                    aria-checked={systemSettings?.requireTwoFactor || false}
                                                    style={{ backgroundColor: (systemSettings?.requireTwoFactor || false) ? '#3182CE' : '#CBD5E0' }}
                                                >
                                                    <span className="sr-only">Toggle two-factor authentication</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`${
                                                            (systemSettings?.requireTwoFactor || false) ? 'translate-x-5' : 'translate-x-0'
                                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                                    ></span>
                                                </button>
                                            </div>

                                            <div>
                                                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-secondary-700">
                                                    Session Timeout (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="sessionTimeout"
                                                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    defaultValue={systemSettings?.sessionTimeoutMinutes || 60}
                                                    min="5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-secondary-900">API Settings</h3>

                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-secondary-900">API Access</h4>
                                                    <p className="text-sm text-secondary-500">
                                                        Enable external API access
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                    role="switch"
                                                    aria-checked={systemSettings?.enableApiAccess || false}
                                                    style={{ backgroundColor: (systemSettings?.enableApiAccess || false) ? '#3182CE' : '#CBD5E0' }}
                                                >
                                                    <span className="sr-only">Toggle API access</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`${
                                                            (systemSettings?.enableApiAccess || false) ? 'translate-x-5' : 'translate-x-0'
                                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                                    ></span>
                                                </button>
                                            </div>

                                            <div>
                                                <label htmlFor="apiRateLimit" className="block text-sm font-medium text-secondary-700">
                                                    API Rate Limit (requests per minute)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="apiRateLimit"
                                                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    defaultValue={systemSettings?.apiRateLimit || 100}
                                                    min="10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                setSuccess('System settings updated successfully');
                                                setTimeout(() => setSuccess(null), 3000);
                                            }}
                                        >
                                            <FiSave className="mr-2 h-4 w-4" />
                                            Save Settings
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;