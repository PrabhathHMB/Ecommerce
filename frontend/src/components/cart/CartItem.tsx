import React, { useState, useEffect } from 'react';
import { CartItem as CartItemType } from '../../types/cart.types';
import { cartApi } from '../../api/cartApi';
import debounce from 'lodash/debounce';
import { formatPrice } from '../../utils/currency';

interface CartItemProps {
    item: CartItemType;
    onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
    // Local state for optimistic updates
    const [quantity, setQuantity] = useState(item.quantity);

    // Sync local state when prop changes (in case of external updates)
    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    // Create a debounced update function
    const debouncedUpdate = React.useMemo(
        () => debounce(async (newQuantity: number, itemId: string) => {
            try {
                await cartApi.updateCartItem(itemId, { quantity: newQuantity });
                onUpdate();
            } catch (error) {
                console.error('Failed to update quantity:', error);
                // Revert to original quantity on error (handled by prop update usually, but good to be safe)
                // For now, we rely on the parent refresh to reset state if needed
            }
        }, 500),
        [onUpdate]
    );

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;

        // Optimistic update
        setQuantity(newQuantity);

        // Trigger API call
        debouncedUpdate(newQuantity, item.id);
    };

    const handleRemove = async () => {
        if (!confirm('Remove this item from cart?')) return;

        try {
            await cartApi.removeCartItem(item.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to remove item:', error);
            alert('Failed to remove item');
        }
    };

    return (
        <div className="cart-item">
            <img src={item.product.imageUrl || '/placeholder-dress.jpg'} alt={item.product.title} className="cart-item-image" />

            <div className="cart-item-details">
                <h3>{item.product.title}</h3>
                <p className="cart-item-brand">{item.product.brand}</p>
                <p className="cart-item-size">Size: {item.size}</p>
                {item.color && <p className="cart-item-color" style={{ fontSize: '0.9rem', color: '#666' }}>Color: {item.color}</p>}

                <div className="cart-item-price">
                    {/* Use product price directly for unit price */}
                    <span className="current-price">{formatPrice(item.product.discountedPrice)}</span>
                    {item.product.price !== item.product.discountedPrice && (
                        <span className="original-price">{formatPrice(item.product.price)}</span>
                    )}
                </div>
            </div>

            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                </div>

                <button onClick={handleRemove} className="btn-remove">Remove</button>
            </div>

            <div className="cart-item-total">
                {/* Calculate total based on unit price * quantity */}
                <p>{formatPrice(item.product.discountedPrice * quantity)}</p>
            </div>
        </div>
    );
};

export default CartItem;
