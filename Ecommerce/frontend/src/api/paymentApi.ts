import api from './axiosConfig';
import { PayHereResponse } from '../types/order.types';

export const paymentApi = {
    createPaymentLink: async (orderId: string): Promise<PayHereResponse> => {
        const response = await api.post(`/api/payments/${orderId}`);
        return response.data;
    },

    confirmCodPayment: async (orderId: string): Promise<void> => {
        await api.post(`/api/payments/cod/${orderId}`);
    },

    submitPayHereForm: (paymentData: PayHereResponse) => {
        // Create a form dynamically and submit it to PayHere
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.url;

        const fields = {
            merchant_id: paymentData.merchantId,
            return_url: paymentData.returnUrl,
            cancel_url: paymentData.cancelUrl,
            notify_url: paymentData.notifyUrl,
            order_id: paymentData.orderId,
            items: paymentData.items,
            currency: paymentData.currency,
            amount: paymentData.amount.toFixed(2),
            first_name: paymentData.firstName,
            last_name: paymentData.lastName,
            email: paymentData.email,
            phone: paymentData.phone,
            address: paymentData.address,
            city: paymentData.city,
            country: paymentData.country,
            hash: paymentData.hash,
        };

        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    },
};
