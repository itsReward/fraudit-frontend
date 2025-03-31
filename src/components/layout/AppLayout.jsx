import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '../../hooks/useTheme';

const AppLayout = () => {
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar for mobile */}
            <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 z-40 flex">
                    <div
                        className="fixed inset-0 bg-secondary-900 bg-opacity-75 transition-opacity"
                        onClick={toggleSidebar}
                    ></div>
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <Sidebar mobile={true} closeMenu={toggleSidebar} />
                    </div>
                </div>
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex w-64 flex-col">
                    <Sidebar />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default AppLayout;