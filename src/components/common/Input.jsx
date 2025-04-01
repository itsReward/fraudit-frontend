import React, { forwardRef } from 'react';

const Input = forwardRef(({
                              label,
                              id,
                              name,
                              type = 'text',
                              value,
                              onChange,
                              onBlur,
                              placeholder = '',
                              disabled = false,
                              readOnly = false,
                              required = false,
                              error = '',
                              className = '',
                              labelClassName = '',
                              inputClassName = '',
                              helpText,
                              leftIcon,
                              rightIcon,
                              ...rest
                          }, ref) => {
    const hasError = !!error;

    return (
        <div className={`${className}`}>
            {label && (
                <label
                    htmlFor={id || name}
                    className={`block text-sm font-medium text-secondary-700 mb-1 ${labelClassName}`}
                >
                    {label} {required && <span className="text-danger-500">*</span>}
                </label>
            )}
            <div className="relative rounded-md shadow-sm">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={id || name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    className={`
                        block w-full rounded-md sm:text-sm
                        ${leftIcon ? 'pl-10' : 'pl-3'}
                        ${rightIcon ? 'pr-10' : 'pr-3'}
                        py-2
                        ${hasError
                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                    }
                        ${disabled ? 'bg-secondary-100 cursor-not-allowed' : ''}
                        ${inputClassName}
                    `}
                    aria-invalid={hasError ? 'true' : 'false'}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...rest}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>
            {helpText && !hasError && (
                <p className="mt-1 text-xs text-secondary-500">{helpText}</p>
            )}
            {hasError && (
                <p className="mt-1 text-xs text-danger-600" id={`${name}-error`}>{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;