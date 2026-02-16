import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { Address } from '../types/order.types';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/currency';

import { useToast } from '../context/ToastContext';

const CheckoutPage: React.FC = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const { error } = useToast();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<Address>({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'PAYHERE' | 'COD'>('PAYHERE');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            const order = await orderApi.createOrder(address);

            if (paymentMethod === 'COD') {
                await paymentApi.confirmCodPayment(order.id);
                // Redirect to order history or success page
                navigate('/payment/success');
            } else {
                // Get PayHere payment details
                const paymentData = await paymentApi.createPaymentLink(order.id);
                // Save orderId to localStorage for success page retrieval (in case URL param is missing/stripped)
                localStorage.setItem('latestOrderId', order.id);
                // Submit PayHere form
                paymentApi.submitPayHereForm(paymentData);
            }

        } catch (err) {
            console.error('Checkout failed:', err);
            error('Failed to process checkout. Please try again.');
            setLoading(false);
        }
    };

    if (!cart || cart.cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-container">
                <div className="shipping-section">
                    <h2>Shipping Address</h2>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={address.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={address.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Street Address *</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={address.streetAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>State/Province *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Zip Code *</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={address.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mobile Number *</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={address.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="payment-method-section">
                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="PAYHERE"
                                        checked={paymentMethod === 'PAYHERE'}
                                        onChange={() => setPaymentMethod('PAYHERE')}
                                    />
                                    <span>Online Payment (PayHere)</span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn-checkout" disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary-section">
                    <h2>Order Summary</h2>

                    <div className="summary-items">
                        {cart.cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <img src={item.product.imageUrl} alt={item.product.title} />
                                <div>
                                    <p>{item.product.title}</p>
                                    <p>Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <span>{formatPrice(item.discountedPrice * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
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
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatPrice(cart.totalDiscountedPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
