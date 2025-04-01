import { useState, useEffect, useCallback } from 'react';
import api from '../api';

/**
 * Custom hook for making API requests
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @param {boolean} immediate - Whether to fetch immediately on mount
 * @returns {Object} - { data, isLoading, error, fetch }
 */
export const useFetch = (url, options = {}, immediate = true) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create fetch function
    const fetchData = useCallback(async (overrideOptions = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const mergedOptions = { ...options, ...overrideOptions };
            const response = await api(url, mergedOptions);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [url, options]);

    // Fetch on mount if immediate is true
    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, fetchData]);

    // Return states and fetch function
    return { data, isLoading, error, fetch: fetchData };
};

/**
 * Custom hook for POST requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional request options
 * @returns {Object} - { data, isLoading, error, post }
 */
export const usePost = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const post = useCallback(async (body, overrideOptions = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const mergedOptions = {
                method: 'POST',
                data: body,
                ...options,
                ...overrideOptions
            };
            const response = await api(url, mergedOptions);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [url, options]);

    return { data, isLoading, error, post };
};

/**
 * Custom hook for PUT requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional request options
 * @returns {Object} - { data, isLoading, error, put }
 */
export const usePut = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const put = useCallback(async (body, overrideOptions = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const mergedOptions = {
                method: 'PUT',
                data: body,
                ...options,
                ...overrideOptions
            };
            const response = await api(url, mergedOptions);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [url, options]);

    return { data, isLoading, error, put };
};

/**
 * Custom hook for DELETE requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional request options
 * @returns {Object} - { data, isLoading, error, remove }
 */
export const useDelete = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = useCallback(async (overrideOptions = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const mergedOptions = {
                method: 'DELETE',
                ...options,
                ...overrideOptions
            };
            const response = await api(url, mergedOptions);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [url, options]);

    return { data, isLoading, error, remove };
};

export default useFetch;