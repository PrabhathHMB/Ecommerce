import api from './axiosConfig';
import { Order, Address } from '../types/order.types';

export const orderApi = {
    createOrder: async (shippingAddress: Address): Promise<Order> => {
        const response = await api.post('/api/orders/', shippingAddress);
        return response.data;
    },

    getOrderHistory: async (): Promise<Order[]> => {
        const response = await api.get('/api/orders/user');
        return response.data;
    },

    getOrderById: async (orderId: string): Promise<Order> => {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    },

    userCancelOrder: async (orderId: string, reason: string): Promise<Order> => {
        const response = await api.put(`/api/orders/${orderId}/cancel`, reason, {
            headers: { 'Content-Type': 'text/plain' }
        });
        return response.data;
    },

    returnOrder: async (orderId: string, reason: string): Promise<Order> => {
        const response = await api.put(`/api/orders/${orderId}/return`, reason, {
            headers: { 'Content-Type': 'text/plain' }
        });
        return response.data;
    },

    // Admin endpoints
    getAllOrders: async (): Promise<Order[]> => {
        const response = await api.get('/api/admin/orders/');
        return response.data;
    },

    placedOrder: async (orderId: string): Promise<Order> => {
        const response = await api.put(`/api/admin/orders/${orderId}/placed`);
        return response.data;
    },

    confirmOrder: async (orderId: string): Promise<Order> => {
        const response = await api.put(`/api/admin/orders/${orderId}/confirmed`);
        return response.data;
    },

    shipOrder: async (orderId: string): Promise<Order> => {
        const response = await api.put(`/api/admin/orders/${orderId}/ship`);
        return response.data;
    },

    deliverOrder: async (orderId: string): Promise<Order> => {
        const response = await api.put(`/api/admin/orders/${orderId}/deliver`);
        return response.data;
    },

    cancelOrder: async (orderId: string): Promise<Order> => {
        const response = await api.put(`/api/admin/orders/${orderId}/cancel`);
        return response.data;
    },

    deleteOrder: async (orderId: string): Promise<void> => {
        await api.delete(`/api/admin/orders/${orderId}/delete`);
    },

    simulatePaymentSuccess: async (orderId: string): Promise<void> => {
        await api.post(`/api/payments/${orderId}/success-test`);
    },
};
