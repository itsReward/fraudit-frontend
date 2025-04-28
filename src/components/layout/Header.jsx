// src/components/layout/Header.jsx (UPDATED)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu, FiUser, FiLogOut, FiSettings, FiMoon, FiSun } from 'react-icons/fi';
import NotificationsDropdown from '../notifications/NotificationsDropdown';

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

    return (
        <header className="bg-white dark:bg-secondary-800 shadow-sm z-10">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex px-2 lg:px-0">
                        <div className="flex-shrink-0 flex items-center md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-900 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                onClick={toggleSidebar}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <FiMenu className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="hidden md:flex md:items-center md:ml-4">
                            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                Fraudit
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {/* Theme toggle */}
                        <button
                            type="button"
                            className="p-2 rounded-full text-secondary-400 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={toggleTheme}
                        >
                            <span className="sr-only">Toggle theme</span>
                            {darkMode ? (
                                <FiSun className="h-5 w-5" />
                            ) : (
                                <FiMoon className="h-5 w-5" />
                            )}
                        </button>

                        {/* Notifications dropdown */}
                        <div className="ml-4 relative">
                            <NotificationsDropdown />
                        </div>

                        {/* Profile dropdown */}
                        <div className="ml-4 relative flex-shrink-0">
                            <div>
                                <button
                                    type="button"
                                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={toggleUserMenu}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                                        <FiUser className="h-5 w-5" />
                                    </div>
                                </button>
                            </div>

                            {userMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-600">
                                            <p className="text-sm font-medium text-secondary-900 dark:text-white">{user?.username || 'User'}</p>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{user?.email || 'user@example.com'}</p>
                                        </div>

                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-600"
                                            role="menuitem"
                                        >
                                            <FiSettings className="mr-3 h-4 w-4" />
                                            Settings
                                        </Link>

                                        <button
                                            type="button"
                                            className="w-full flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-600"
                                            role="menuitem"
                                            onClick={logout}
                                        >
                                            <FiLogOut className="mr-3 h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;