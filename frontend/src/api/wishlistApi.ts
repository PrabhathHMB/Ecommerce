import api from './axiosConfig';
import { Product } from '../types/product.types';

export interface Wishlist {
    id: string;
    user: any;
    products: Product[];
}

export const getWishlist = async (): Promise<Wishlist> => {
    const response = await api.get('/api/wishlist/');
    return response.data;
};

export const addItemToWishlist = async (productId: string): Promise<Wishlist> => {
    const response = await api.put(`/api/wishlist/add/${productId}`, {});
    console.log("addItemToWishlist response", response.data);
    return response.data;
};

export const removeItemFromWishlist = async (productId: string): Promise<Wishlist> => {
    const response = await api.delete(`/api/wishlist/remove/${productId}`);
    return response.data;
};
