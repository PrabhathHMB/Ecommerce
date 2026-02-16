import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '../types/cart.types';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../hooks/useAuth';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    refreshCart: () => Promise<void>;
    cartItemCount: number;
}

export const CartContext = createContext<CartContextType>({
    cart: null,
    loading: true,
    refreshCart: async () => { },
    cartItemCount: 0,
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCart(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const refreshCart = async () => {
        try {
            setLoading(true);
            const cartData = await cartApi.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const cartItemCount = cart?.totalItem || 0;

    return (
        <CartContext.Provider value={{ cart, loading, refreshCart, cartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};
