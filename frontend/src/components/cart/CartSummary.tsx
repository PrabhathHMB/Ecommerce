import React from 'react';
import { Cart } from '../../types/cart.types';
import { formatPrice } from '../../utils/currency';

interface CartSummaryProps {
    cart: Cart;
    onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout }) => {
    return (
        <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
                <span>Items ({cart.totalItem})</span>
                <span>{formatPrice(cart.totalPrice)}</span>
            </div>

            <div className="summary-row">
                <span>Discount</span>
                <span className="discount-amount">- {formatPrice(cart.discounte)}</span>
            </div>

            <div className="summary-row">
                <span>Delivery Charges</span>
                <span className={cart.deliveryCharges === 0 ? "free-delivery" : ""}>
                    {cart.deliveryCharges === 0 ? "Free" : formatPrice(cart.deliveryCharges)}
                </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(cart.totalDiscountedPrice)}</span>
            </div>

            <button onClick={onCheckout} className="btn-checkout">
                Proceed to Checkout
            </button>
        </div>
    );
};

export default CartSummary;
