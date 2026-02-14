import api from './axiosConfig';
import { User } from '../types/auth.types';

export const userApi = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get('/api/admin/users');
        return response.data;
    },
};
