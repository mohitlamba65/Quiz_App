import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

    // Set axios default headers
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/auth/me`);
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token, API_URL]);

    const signup = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, userData);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const guestLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/guest`);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Guest login failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        loading,
        signup,
        login,
        guestLogin,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        isGuest: user?.isGuest || user?.role === 'guest'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
