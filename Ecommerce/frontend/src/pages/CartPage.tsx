import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CartPage: React.FC = () => {
    const { cart, loading, refreshCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some items to get started</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            <div className="cart-container">
                <div className="cart-items-section">
                    <div className="cart-header">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>

                    {cart.cartItems.map((item) => (
                        <CartItem key={item.id} item={item} onUpdate={refreshCart} />
                    ))}
                </div>

                <CartSummary cart={cart} onCheckout={handleCheckout} />
            </div>
        </div>
    );
};

export default CartPage;
