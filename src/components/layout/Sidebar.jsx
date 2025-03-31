import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    FiHome,
    FiBarChart2,
    FiFileText,
    FiAlertTriangle,
    FiDatabase,
    FiUsers,
    FiSettings,
    FiX,
    FiPieChart,
    FiFolder,
    FiAward
} from 'react-icons/fi';

const Sidebar = ({ mobile = false, closeMenu }) => {
    const { user } = useAuth();

    const navigation = [
        { name: 'Dashboard', icon: FiHome, href: '/dashboard', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Companies', icon: FiDatabase, href: '/companies', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Financial Statements', icon: FiFileText, href: '/statements', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Risk Assessments', icon: FiBarChart2, href: '/risk', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Alerts', icon: FiAlertTriangle, href: '/risk/alerts', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Reports', icon: FiPieChart, href: '/reports', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'ML Models', icon: FiAward, href: '/ml/models', allowedRoles: ['ADMIN', 'ANALYST'] },
        { name: 'Documents', icon: FiFolder, href: '/documents', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
        { name: 'Users', icon: FiUsers, href: '/users', allowedRoles: ['ADMIN', 'REGULATOR'] },
        { name: 'Settings', icon: FiSettings, href: '/settings', allowedRoles: ['ADMIN', 'REGULATOR', 'AUDITOR', 'ANALYST'] },
    ];

    // Filter navigation items based on user role
    const filteredNavigation = navigation.filter(
        (item) => !item.allowedRoles || item.allowedRoles.includes(user?.role)
    );

    return (
        <div className="flex flex-col h-0 flex-1 bg-primary-800 dark:bg-secondary-900">
            <div className="flex items-center justify-between p-4 shadow-md">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-white">Fraudit</h1>
                </div>
                {mobile && (
                    <button
                        type="button"
                        className="text-white hover:text-primary-100 focus:outline-none"
                        onClick={closeMenu}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <FiX className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {filteredNavigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-primary-900 text-white'
                                        : 'text-primary-100 hover:text-white hover:bg-primary-700'
                                }`
                            }
                            onClick={mobile ? closeMenu : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                            isActive ? 'text-primary-300' : 'text-primary-400 group-hover:text-primary-300'
                                        }`}
                                    />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-primary-700 dark:border-secondary-700 p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'User'}
                        </p>
                        <p className="text-xs font-medium text-primary-200">
                            {user?.role || 'Analyst'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;