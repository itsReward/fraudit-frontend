// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { login, register, refreshToken } from '../api/auth';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Initialize auth state from local storage
    useEffect(() => {
        const initializeAuth = async () => {
            // Check for demo mode
            const demoMode = config.api.demoMode;
            const token = demoMode ? localStorage.getItem('demo_token') : localStorage.getItem('token');
            const refreshTokenValue = demoMode ? null : localStorage.getItem('refreshToken');

            if (token) {
                try {
                    if (demoMode) {
                        // In demo mode, get user from localStorage
                        const demoUser = JSON.parse(localStorage.getItem('demo_user') || 'null');
                        if (demoUser) {
                            setUser(demoUser);
                            setIsAuthenticated(true);
                        }
                    } else {
                        // Production mode - validate token
                        const decodedToken = jwt_decode(token);
                        const currentTime = Date.now() / 1000;

                        if (decodedToken.exp < currentTime) {
                            // Token is expired, try to refresh
                            if (refreshTokenValue) {
                                try {
                                    const response = await refreshToken(refreshTokenValue);
                                    handleAuthSuccess(response.data);
                                } catch (error) {
                                    // Refresh token is invalid, logout
                                    handleLogout();
                                }
                            } else {
                                // No refresh token, logout
                                handleLogout();
                            }
                        } else {
                            // Token is valid
                            setUser(decodedToken);
                            setIsAuthenticated(true);
                        }
                    }
                } catch (error) {
                    // Token is invalid, logout
                    handleLogout();
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const handleAuthSuccess = (data) => {
        if (config.api.demoMode) {
            // In demo mode, store in demo-specific localStorage
            localStorage.setItem('demo_token', data.token);
            localStorage.setItem('demo_user', JSON.stringify(data));
            setUser(data);
        } else {
            // Production mode
            localStorage.setItem('token', data.token);

            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            setUser(jwt_decode(data.token));
        }

        setIsAuthenticated(true);
        setError(null);
    };

    const handleLogin = async (credentials) => {
        try {
            setLoading(true);

            // Use demo credentials if in demo mode and credentials are empty
            if (config.api.demoMode && (!credentials.username || !credentials.password)) {
                credentials = {
                    username: config.api.demo.defaultUsername,
                    password: config.api.demo.defaultPassword,
                    rememberMe: true
                };
            }

            const response = await login(credentials);
            handleAuthSuccess(response.data.data);
            navigate('/dashboard');
            return response;
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during login');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        try {
            setLoading(true);
            const response = await register(userData);
            return response;
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during registration');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (config.api.demoMode) {
            localStorage.removeItem('demo_token');
            localStorage.removeItem('demo_user');
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }

        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;