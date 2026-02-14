import api from './axiosConfig';
import { Category } from '../types/product.types';

export const categoryApi = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories');
        return response.data;
    }
};
