// src/pages/settings/Settings.jsx
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FiUser, FiBell, FiLock, FiShield, FiSettings } from 'react-icons/fi';
import NotificationSettings from '../../components/settings/NotificationSettings';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Settings = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
        { name: 'Profile', icon: FiUser },
        { name: 'Notifications', icon: FiBell },
        { name: 'Security', icon: FiLock },
        { name: 'Privacy', icon: FiShield },
        { name: 'Preferences', icon: FiSettings },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">Settings</h1>
                <p className="mt-1 text-secondary-500">Manage your account settings and preferences</p>
            </div>

            <div className="bg-white shadow-card rounded-lg">
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <div className="sm:flex sm:items-start border-b border-secondary-200">
                        <div className="sm:w-64 sm:border-r sm:border-secondary-200">
                            <Tab.List className="flex flex-col">
                                {tabs.map((tab, index) => (
                                    <Tab
                                        key={tab.name}
                                        className={({ selected }) =>
                                            classNames(
                                                'flex items-center px-4 py-3 text-sm font-medium',
                                                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                                                selected
                                                    ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-500'
                                                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                                            )
                                        }
                                    >
                                        <tab.icon
                                            className={classNames(
                                                'mr-3 h-5 w-5 flex-shrink-0',
                                                selectedTab === index ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span>{tab.name}</span>
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>
                        <div className="p-4 sm:p-6 sm:flex-1">
                            <Tab.Panels>
                                {/* Profile Settings */}
                                <Tab.Panel>
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-lg font-medium text-secondary-900 mb-6">Profile Settings</h3>
                                        <p className="text-secondary-500">
                                            Profile settings will be implemented in the future. Here you'll be able to update your name, email, and other personal information.
                                        </p>
                                    </div>
                                </Tab.Panel>

                                {/* Notification Settings */}
                                <Tab.Panel>
                                    <div className="max-w-2xl mx-auto">
                                        <NotificationSettings />
                                    </div>
                                </Tab.Panel>

                                {/* Security Settings */}
                                <Tab.Panel>
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-lg font-medium text-secondary-900 mb-6">Security Settings</h3>
                                        <p className="text-secondary-500">
                                            Security settings will be implemented in the future. Here you'll be able to change your password, set up two-factor authentication, and manage active sessions.
                                        </p>
                                    </div>
                                </Tab.Panel>

                                {/* Privacy Settings */}
                                <Tab.Panel>
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-lg font-medium text-secondary-900 mb-6">Privacy Settings</h3>
                                        <p className="text-secondary-500">
                                            Privacy settings will be implemented in the future. Here you'll be able to control your data and privacy preferences.
                                        </p>
                                    </div>
                                </Tab.Panel>

                                {/* Preferences */}
                                <Tab.Panel>
                                    <div className="max-w-2xl mx-auto">
                                        <h3 className="text-lg font-medium text-secondary-900 mb-6">System Preferences</h3>
                                        <p className="text-secondary-500">
                                            System preferences will be implemented in the future. Here you'll be able to customize the application's appearance and behavior.
                                        </p>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </div>
                    </div>
                </Tab.Group>
            </div>
        </div>
    );
};

export default Settings;