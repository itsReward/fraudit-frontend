import React, { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = forwardRef(({
                               label,
                               id,
                               name,
                               value,
                               onChange,
                               onBlur,
                               options = [],
                               placeholder = 'Select an option',
                               disabled = false,
                               required = false,
                               error = '',
                               className = '',
                               labelClassName = '',
                               selectClassName = '',
                               helpText,
                               icon,
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
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <select
                    ref={ref}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={`
                        block w-full rounded-md sm:text-sm appearance-none
                        ${icon ? 'pl-10' : 'pl-3'}
                        pr-10 py-2
                        ${hasError
                        ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                        : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                    }
                        ${disabled ? 'bg-secondary-100 cursor-not-allowed' : ''}
                        ${selectClassName}
                    `}
                    aria-invalid={hasError ? 'true' : 'false'}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...rest}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="h-4 w-4 text-secondary-400" aria-hidden="true" />
                </div>
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

Select.displayName = 'Select';

export default Select;