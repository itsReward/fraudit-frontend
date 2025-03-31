import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
                    children,
                    type = 'button',
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    className = '',
                    isLoading = false,
                    href,
                    to,
                    onClick,
                    ...rest
                }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-300',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
        success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
        outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses : ''}
    ${className}
  `;

    const loadingSpinner = (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

    // Render as a link if href is provided
    if (href) {
        return (
            <a
                href={href}
                className={classes}
                {...rest}
            >
                {isLoading && loadingSpinner}
                {children}
            </a>
        );
    }

    // Render as a Link if to is provided
    if (to) {
        return (
            <Link
                to={to}
                className={classes}
                {...rest}
            >
                {isLoading && loadingSpinner}
                {children}
            </Link>
        );
    }

    // Render as a button
    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...rest}
        >
            {isLoading && loadingSpinner}
            {children}
        </button>
    );
};

export default Button;