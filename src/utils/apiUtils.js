// src/utils/apiUtils.js - Utilities for API handling
import { toast } from 'react-toastify'; // You'll need to install this package

/**
 * Handle API response with standard success/error handling
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Options for response handling
 * @param {boolean} options.showSuccessToast - Whether to show success toast
 * @param {boolean} options.showErrorToast - Whether to show error toast
 * @param {string} options.successMessage - Custom success message
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * @returns {Promise<Object>} - Response data
 */
export const handleApiResponse = async (apiCall, options = {}) => {
    const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = 'Operation completed successfully',
        onSuccess,
        onError,
    } = options;

    try {
        const response = await apiCall();

        // For most API calls, the response is in response.data.data
        // For file downloads, the response might be a Blob
        const isBlob = response.data instanceof Blob;
        const data = isBlob ? response.data : (response.data?.data || response.data);
        const message = !isBlob && response.data?.message ? response.data.message : successMessage;

        if (showSuccessToast) {
            toast.success(message);
        }

        if (onSuccess) {
            onSuccess(data, response);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An error occurred';

        if (showErrorToast) {
            toast.error(errorMessage);
        }

        if (onError) {
            onError(error);
        }

        throw error;
    }
};

/**
 * Handle API pagination with standard approach
 * @param {Function} apiCall - The API function to call
 * @param {Object} params - Query parameters
 * @param {Function} setData - State setter for data
 * @param {Function} setLoading - State setter for loading state
 * @param {Function} setError - State setter for error state
 * @param {Function} setTotalPages - State setter for total pages
 */
export const handleApiPagination = async (
    apiCall,
    params,
    setData,
    setLoading,
    setError,
    setTotalPages
) => {
    setLoading(true);
    try {
        const response = await apiCall(params);
        const responseData = response.data?.data;

        if (responseData?.content) {
            // Paginated response
            setData(responseData.content);
            if (setTotalPages) {
                setTotalPages(responseData.totalPages);
            }
        } else {
            // Non-paginated response
            setData(responseData);
        }

        setError(null);
    } catch (error) {
        console.error('API Pagination Error:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch data');
        setData([]);
    } finally {
        setLoading(false);
    }
};

/**
 * Format parameters for API query
 * @param {Object} params - Parameters to format
 * @returns {Object} - Formatted parameters
 */
export const formatQueryParams = (params) => {
    const formattedParams = {};

    // Remove null, undefined, or empty string values
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            formattedParams[key] = value;
        }
    });

    return formattedParams;
};

/**
 * Helper to download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename
 */
export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
};