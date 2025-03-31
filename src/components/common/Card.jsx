import React from 'react';

const Card = ({
                  children,
                  title,
                  subtitle,
                  footer,
                  className = '',
                  headerClassName = '',
                  bodyClassName = '',
                  footerClassName = '',
                  ...rest
              }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}
            {...rest}
        >
            {(title || subtitle) && (
                <div className={`px-4 py-3 border-b border-secondary-200 ${headerClassName}`}>
                    {title && (
                        typeof title === 'string' ? (
                            <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
                        ) : title
                    )}

                    {subtitle && (
                        typeof subtitle === 'string' ? (
                            <p className="mt-1 text-sm text-secondary-500">{subtitle}</p>
                        ) : subtitle
                    )}
                </div>
            )}

            <div className={`p-4 ${bodyClassName}`}>
                {children}
            </div>

            {footer && (
                <div className={`px-4 py-3 border-t border-secondary-200 ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;