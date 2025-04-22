// src/utils/dataUtils.js - Utilities for data formatting and validation

/**
 * Format a number as currency
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
    if (value === null || value === undefined) return 'N/A';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

/**
 * Format a number with thousands separators
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, decimals = 0, locale = 'en-US') => {
    if (value === null || value === undefined) return 'N/A';

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
};

/**
 * Format a percentage
 * @param {number} value - Value to format (e.g., 0.15)
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} - Formatted percentage string
 */
export const formatPercent = (value, decimals = 1, locale = 'en-US') => {
    if (value === null || value === undefined) return 'N/A';

    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
};

/**
 * Format a date
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}, locale = 'en-US') => {
    if (!date) return 'N/A';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
};

/**
 * Format a date and time
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (date, locale = 'en-US') => {
    if (!date) return 'N/A';

    return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }, locale);
};

/**
 * Get fiscal quarters based on a date range
 * @param {Date} startDate - Start date of fiscal year
 * @param {Date} endDate - End date of fiscal year
 * @returns {Array} - Array of fiscal quarter objects
 */
export const getFiscalQuarters = (startDate, endDate) => {
    const quarters = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate quarter duration in milliseconds
    const totalDuration = end.getTime() - start.getTime();
    const quarterDuration = totalDuration / 4;

    for (let i = 0; i < 4; i++) {
        const quarterStart = new Date(start.getTime() + (quarterDuration * i));
        const quarterEnd = new Date(start.getTime() + (quarterDuration * (i + 1)) - 1);

        quarters.push({
            quarter: `Q${i + 1}`,
            startDate: quarterStart,
            endDate: quarterEnd,
            label: `Q${i + 1} (${formatDate(quarterStart, { month: 'short' })} - ${formatDate(quarterEnd, { month: 'short' })})`
        });
    }

    return quarters;
};

/**
 * Calculate year-over-year growth rate
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Growth rate as a decimal
 */
export const calculateGrowthRate = (current, previous) => {
    if (!current || !previous || previous === 0) return null;

    return (current - previous) / Math.abs(previous);
};

/**
 * Get a color based on a value compared to thresholds
 * @param {number} value - Value to check
 * @param {Object} thresholds - Threshold values
 * @param {boolean} isHigherBetter - Whether higher values are better
 * @returns {string} - Color name
 */
export const getThresholdColor = (value, thresholds = {}, isHigherBetter = true) => {
    if (value === null || value === undefined) return 'secondary';

    const { good = 0, warning = 0 } = thresholds;

    if (isHigherBetter) {
        if (value >= good) return 'success';
        if (value >= warning) return 'warning';
        return 'danger';
    } else {
        if (value <= good) return 'success';
        if (value <= warning) return 'warning';
        return 'danger';
    }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 50) => {
    if (!text) return '';

    if (text.length <= length) return text;

    return `${text.substring(0, length)}...`;
};

/**
 * Convert camelCase to sentence case
 * @param {string} text - CamelCase text
 * @returns {string} - Sentence case text
 */
export const camelToSentence = (text) => {
    if (!text) return '';

    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Safely access nested object properties
 * @param {Object} obj - Object to access
 * @param {string} path - Property path (dot notation)
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} - Property value or default
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || !path) return defaultValue;

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === null || result === undefined || !Object.prototype.hasOwnProperty.call(result, key)) {
            return defaultValue;
        }
        result = result[key];
    }

    return result === undefined ? defaultValue : result;
};