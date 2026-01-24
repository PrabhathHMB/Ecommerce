import api from './axiosConfig';
import { AuthResponse, LoginRequest, SignupRequest, User } from '../types/auth.types';

export const authApi = {
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    signin: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    },

    googleLogin: async (token: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/google', { token });
        return response.data;
    },

    getUserProfile: async (): Promise<User> => {
        const response = await api.get('/api/users/profile');
        return response.data;
    },

    forgotPassword: async (email: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    resetPassword: async (data: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },

    deleteUser: async (userId: string): Promise<string> => {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    },

    changeUserRole: async (userId: string, role: string): Promise<User> => {
        const response = await api.put(`/api/admin/users/${userId}/role`, {}, {
            headers: {
                'Role': role
            }
        });
        return response.data;
    }
};
