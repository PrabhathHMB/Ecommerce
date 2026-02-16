import api from './axiosConfig';
import { Cart, AddItemRequest } from '../types/cart.types';

export const cartApi = {
    getCart: async (): Promise<Cart> => {
        const response = await api.get('/api/cart/');
        return response.data;
    },

    addItemToCart: async (data: AddItemRequest): Promise<void> => {
        await api.put('/api/cart/add', data);
    },

    updateCartItem: async (cartItemId: string, data: any): Promise<void> => {
        await api.put(`/api/cart_items/${cartItemId}`, data);
    },

    removeCartItem: async (cartItemId: string): Promise<void> => {
        await api.delete(`/api/cart_items/${cartItemId}`);
    },
};
