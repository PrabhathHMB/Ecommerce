import api from './axiosConfig';
import { Product, ProductPage, ProductFilterParams, CreateProductRequest } from '../types/product.types';

export const productApi = {
    getAllProducts: async (params: ProductFilterParams): Promise<ProductPage> => {
        // Backend requires all parameters, AND filters strictly if list is present.
        // Workaround: Send ALL possible values if filter is empty.
        const ALL_COLORS = ['BLACK', 'WHITE', 'RED', 'GREEN', 'BLUE', 'YELLOW', 'PINK', 'PURPLE', 'ORANGE', 'GREY', 'BROWN', 'GOLD', 'SILVER'];
        const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        const queryParams = {
            category: params.category || '',
            parentCategory: params.parentCategory || '',
            color: params.color && params.color.length > 0 ? params.color : ALL_COLORS,
            size: params.size && params.size.length > 0 ? params.size : ALL_SIZES,
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 10000000,
            minDiscount: params.minDiscount || 0,
            sort: params.sort || 'price_low',
            stock: params.stock || '',
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
        const response = await api.get('/api/products?color=&size=&minPrice=0&maxPrice=10000000&minDiscount=0&sort=price_high&stock=&pageNumber=0&pageSize=10&category=');
        return response.data.content;
    },

    getProductsByCategory: async (category: string): Promise<Product[]> => {
        const response = await api.get(`/api/products?color=&size=&minPrice=0&maxPrice=10000000&minDiscount=0&sort=price_high&stock=&pageNumber=0&pageSize=10&category=${category}`);
        return response.data.content;
    }
};
