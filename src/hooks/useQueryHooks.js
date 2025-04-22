// src/hooks/useQueryHooks.js - Custom hooks for React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { formatQueryParams } from '../utils/apiUtils';

/**
 * Custom hook for data fetching with React Query
 * @param {string} queryKey - Query key for caching
 * @param {Function} fetchFunction - API function to call
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional options
 * @returns {Object} - Query result
 */
export const useApiQuery = (queryKey, fetchFunction, params = {}, options = {}) => {
    const formattedParams = formatQueryParams(params);

    return useQuery({
        queryKey: [queryKey, formattedParams],
        queryFn: () => fetchFunction(formattedParams).then(res => res.data.data),
        ...options
    });
};

/**
 * Custom hook for data fetching by ID with React Query
 * @param {string} queryKey - Query key for caching
 * @param {Function} fetchFunction - API function to call
 * @param {string|number} id - ID to fetch
 * @param {Object} options - Additional options
 * @returns {Object} - Query result
 */
export const useApiQueryById = (queryKey, fetchFunction, id, options = {}) => {
    return useQuery({
        queryKey: [queryKey, id],
        queryFn: () => id ? fetchFunction(id).then(res => res.data.data) : null,
        enabled: !!id,
        ...options
    });
};

/**
 * Custom hook for mutations with React Query
 * @param {string} mutationKey - Mutation key
 * @param {Function} mutationFunction - API function to call
 * @param {Object} options - Additional options
 * @returns {Object} - Mutation result
 */
export const useApiMutation = (mutationKey, mutationFunction, options = {}) => {
    const queryClient = useQueryClient();
    const {
        onSuccess,
        onError,
        invalidateQueries,
        successMessage,
        errorMessage,
        showSuccessToast = true,
        showErrorToast = true
    } = options;

    return useMutation({
        mutationKey: [mutationKey],
        mutationFn: mutationFunction,
        onSuccess: (data, variables, context) => {
            if (showSuccessToast) {
                toast.success(successMessage || 'Operation completed successfully');
            }

            if (invalidateQueries) {
                // Invalidate queries to refetch data
                if (Array.isArray(invalidateQueries)) {
                    invalidateQueries.forEach(query => queryClient.invalidateQueries({ queryKey: [query] }));
                } else {
                    queryClient.invalidateQueries({ queryKey: [invalidateQueries] });
                }
            }

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                errorMessage ||
                'An error occurred';

            if (showErrorToast) {
                toast.error(errorMsg);
            }

            if (onError) {
                onError(error, variables, context);
            }
        },
        ...options
    });
};

/**
 * Custom hook for paginated data fetching
 * @param {string} queryKey - Query key for caching
 * @param {Function} fetchFunction - API function to call
 * @param {Object} params - Query parameters including pagination
 * @param {Object} options - Additional options
 * @returns {Object} - Query result with pagination helpers
 */
export const usePaginatedQuery = (queryKey, fetchFunction, params = {}, options = {}) => {
    const formattedParams = formatQueryParams({
        page: 0,
        size: 10,
        ...params
    });

    const query = useQuery({
        queryKey: [queryKey, formattedParams],
        queryFn: () => fetchFunction(formattedParams).then(res => res.data.data),
        ...options
    });

    // Extract pagination data
    const { data } = query;
    const paginationData = {
        pageIndex: data?.page || 0,
        pageSize: data?.size || 10,
        pageCount: data?.totalPages || 0,
        totalItems: data?.totalElements || 0,
        hasNextPage: data?.last === false,
        hasPreviousPage: data?.first === false,
    };

    const content = data?.content || [];

    // Helper functions for pagination
    const setPage = (newPage) => {
        return fetchFunction({
            ...formattedParams,
            page: newPage
        });
    };

    const setPageSize = (newPageSize) => {
        return fetchFunction({
            ...formattedParams,
            size: newPageSize,
            page: 0
        });
    };

    return {
        ...query,
        data: content,
        pagination: paginationData,
        setPage,
        setPageSize,
    };
};