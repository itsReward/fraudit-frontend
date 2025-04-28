// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
            onError: (error) => {
                // Log errors to console
                console.error('Query error:', error);

                // Show a toast notification for API errors
                if (error.response) {
                    const message = error.response.data?.message || 'An error occurred';
                    toast.error(message);
                } else if (error.request) {
                    // The request was made but no response was received
                    toast.error('Network error. Please check your connection.');
                } else {
                    // Something happened in setting up the request
                    toast.error('An error occurred. Please try again.');
                }
            }
        },
        mutations: {
            onError: (error) => {
                // Log errors to console
                console.error('Mutation error:', error);

                // Show a toast notification for API errors
                if (error.response) {
                    const message = error.response.data?.message || 'An error occurred';
                    toast.error(message);
                } else if (error.request) {
                    // The request was made but no response was received
                    toast.error('Network error. Please check your connection.');
                } else {
                    // Something happened in setting up the request
                    toast.error('An error occurred. Please try again.');
                }
            }
        }
    },
});

// Configure toast settings
const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <App />
                        <ToastContainer {...toastConfig} />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);