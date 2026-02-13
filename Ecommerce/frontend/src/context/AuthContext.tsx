import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth.types';
import { storage } from '../utils/storage';
import { authApi } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = storage.getToken();
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = await authApi.getUserProfile();
            setUser(userData);
            storage.setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            storage.removeToken();
            storage.removeUser();
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string) => {
        storage.setToken(token);
        fetchUserProfile();
    };

    const logout = () => {
        setUser(null);
        storage.clear();
        window.location.href = '/login';
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'ROLE_ADMIN';

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
