import api from './axiosConfig';
import { Product, ProductPage, ProductFilterParams, CreateProductRequest } from '../types/product.types';

export const productApi = {
    getAllProducts: async (params: ProductFilterParams): Promise<ProductPage> => {
        const queryParams = {
            category: params.category || '',
            parentCategory: params.parentCategory || '',
            color: params.color,
            size: params.size,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            minDiscount: params.minDiscount,
            sort: params.sort || 'price_low',
            stock: params.stock,
            pageNumber: params.pageNumber || 0,
            pageSize: params.pageSize || 10
        };
        const response = await api.get('/api/products', { params: queryParams });
        return response.data;
    },

    getProductById: async (productId: string): Promise<Product> => {
        const response = await api.get(`/api/products/id/${productId}`);
        return response.data;
    },

    searchProducts: async (query: string): Promise<Product[]> => {
        const response = await api.get('/api/products/search', { params: { q: query } });
        return response.data;
    },

    // Admin endpoints
    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await api.post('/api/admin/products', data);
        return response.data;
    },

    updateProduct: async (productId: string, data: Product): Promise<Product> => {
        const response = await api.put(`/api/admin/products/${productId}/update`, data);
        return response.data;
    },

    deleteProduct: async (productId: string): Promise<void> => {
        await api.delete(`/api/admin/products/${productId}/delete`);
    },

    getAllProductsAdmin: async (): Promise<Product[]> => {
        const response = await api.get('/api/admin/products/all');
        return response.data;
    },

    getRecentProducts: async (): Promise<Product[]> => {
        const response = await api.get('/api/products?sort=price_high&pageNumber=0&pageSize=10');
        return response.data.content;
    },

    getProductsByCategory: async (category: string): Promise<Product[]> => {
        const response = await api.get(`/api/products?sort=price_high&pageNumber=0&pageSize=10&category=${category}`);
        return response.data.content;
    }
};
