import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-secondary-800 shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            © {currentYear} Fraudit. All rights reserved.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            Fraud Detection System for Zimbabwe Stock Exchange
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;