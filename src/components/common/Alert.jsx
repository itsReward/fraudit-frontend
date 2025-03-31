import React from 'react';

const Alert = ({
                   children,
                   title,
                   variant = 'info',
                   dismissible = false,
                   onDismiss,
                   className = '',
                   icon,
                   ...rest
               }) => {
    const variantClasses = {
        info: 'bg-primary-50 text-primary-800 border-primary-200',
        success: 'bg-success-50 text-success-800 border-success-200',
        warning: 'bg-warning-50 text-warning-800 border-warning-200',
        danger: 'bg-danger-50 text-danger-800 border-danger-200',
    };

    const variantIconColors = {
        info: 'text-primary-500',
        success: 'text-success-500',
        warning: 'text-warning-500',
        danger: 'text-danger-500',
    };

    const variantIcons = {
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        danger: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
    };

    const selectedIcon = icon || variantIcons[variant];

    return (
        <div
            className={`px-4 py-3 rounded-md border ${variantClasses[variant]} ${className}`}
            role="alert"
            {...rest}
        >
            <div className="flex">
                {selectedIcon && (
                    <div className={`shrink-0 mr-3 ${variantIconColors[variant]}`}>
                        {selectedIcon}
                    </div>
                )}

                <div className="flex-1">
                    {title && (
                        typeof title === 'string' ? (
                            <h3 className="text-sm font-medium">{title}</h3>
                        ) : title
                    )}

                    {children && (
                        <div className={title ? 'mt-2' : ''}>
                            {typeof children === 'string' ? (
                                <p className="text-sm">{children}</p>
                            ) : children}
                        </div>
                    )}
                </div>

                {dismissible && onDismiss && (
                    <button
                        type="button"
                        className={`ml-3 shrink-0 ${variantIconColors[variant]} hover:opacity-75 focus:outline-none`}
                        onClick={onDismiss}
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;