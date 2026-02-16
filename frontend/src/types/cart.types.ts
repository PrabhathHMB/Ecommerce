import { Product } from './product.types';
import { User } from './auth.types';

export interface CartItem {
    id: string;
    product: Product;
    size: string;
    color?: string;
    quantity: number;
    price: number;
    discountedPrice: number;
    userId: string;
}

export interface Cart {
    id: string;
    user: User;
    cartItems: CartItem[];
    totalPrice: number;
    totalItem: number;
    totalDiscountedPrice: number;
    discounte: number;
    deliveryCharges: number;
}

export interface AddItemRequest {
    productId: string;
    size: string;
    color?: string;
    quantity: number;
}
