import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api';

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
    const [loading, setLoading] = useState(true);

 
    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await api.get('/auth/current-user');
                setUser(response.data.data); 
            } catch (error) {
                console.log('No active session');
                setUser(null);
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            setUser(response.data.data); 
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
            const response = await api.post('/auth/login', credentials);
            // Cookies are set automatically by the browser
            // We just set the user state
            setUser(response.data.data.user);
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
            const response = await api.post('/auth/guest');
            setUser(response.data.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Guest login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        guestLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        isGuest: user?.isGuest || user?.role === 'guest'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
