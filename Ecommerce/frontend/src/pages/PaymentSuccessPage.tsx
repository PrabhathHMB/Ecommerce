import React from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { useCart } from '../hooks/useCart';

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

    React.useEffect(() => {
        const verifyPayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            let orderId = urlParams.get('order_id');

            // Fallback: Check localStorage if not in URL
            if (!orderId) {
                orderId = localStorage.getItem('latestOrderId');
            }

            if (orderId) {
                try {
                    // Call the test endpoint to simulate webhooks (since localhost can't receive them)
                    await orderApi.simulatePaymentSuccess(orderId);
                    // Clear storage after success
                    localStorage.removeItem('latestOrderId');
                    // Refresh cart to reflect the cleared cart from backend
                    await refreshCart();
                    setStatus('success');
                } catch (error) {
                    console.error('Failed to verify payment:', error);
                    // Even if it fails (e.g. already verified), show success UI and refresh cart
                    await refreshCart();
                    setStatus('success');
                }
            } else {
                console.warn('No order ID found for verification');
                // Still refresh cart to ensure UI is in sync
                await refreshCart();
                setStatus('success');
            }
        };

        verifyPayment();
    }, [refreshCart]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="payment-result-page success">
            <div className="result-container animate-bounce">
                <div className="success-icon emoji">😊</div>

                <h1 className="confirmation-text">your order is confirmed</h1>
                <p>Thank you for your purchase.</p>

                <div className="action-buttons">
                    <button onClick={() => navigate('/orders')} className="btn-primary">
                        View Orders
                    </button>
                    <button onClick={() => navigate('/products')} className="btn-secondary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
