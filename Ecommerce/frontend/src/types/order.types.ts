import { Product } from './product.types';
import { User } from './auth.types';

export interface Address {
    id?: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    mobile: string;
}

export interface PaymentDetails {
    paymentId?: string;
    paymentMethod?: string;
    status?: string;
}

export interface OrderItem {
    id: string;
    product: Product;
    size: string;
    quantity: number;
    price: number;
    discountedPrice: number;
    userId: string;
}

export interface Order {
    id: string;
    orderId: string;
    user: User;
    orderItems: OrderItem[];
    orderDate: string;
    deliveryDate?: string;
    shippingAddress: Address;
    paymentDetails: PaymentDetails;
    totalPrice: number;
    totalDiscountedPrice: number;
    discount: number;
    orderStatus: string;
    totalItem: number;
    createdAt: string;
}

export interface PayHereResponse {
    merchantId: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    orderId: string;
    items: string;
    currency: string;
    amount: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hash: string;
    url: string;
}
