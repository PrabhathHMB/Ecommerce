import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-result-page cancel">
            <div className="result-container">
                <div className="cancel-icon">✕</div>
                <h1>Payment Cancelled</h1>
                <p>Your payment was cancelled or failed to process.</p>
                <p>No charges have been made to your account.</p>

                <div className="action-buttons">
                    <button onClick={() => navigate('/cart')} className="btn-primary">
                        Return to Cart
                    </button>
                    <button onClick={() => navigate('/products')} className="btn-secondary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
