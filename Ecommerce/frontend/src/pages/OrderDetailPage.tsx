import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { reviewApi } from '../api/reviewApi';
import { Order } from '../types/order.types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderTracker from '../components/order/OrderTracker';
import CancelOrderModal from '../components/order/CancelOrderModal';
import ReviewModal from '../components/product/ReviewModal';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const data = await orderApi.getOrderById(orderId!);
            setOrder(data);
        } catch (err) {
            console.error('Failed to fetch order:', err);
            error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (reason: string) => {
        setSubmitting(true);
        try {
            await orderApi.userCancelOrder(orderId!, reason);
            success('Order cancelled successfully');
            setShowCancelModal(false);
            fetchOrder(); // Refresh order details
        } catch (err) {
            console.error('Failed to cancel order:', err);
            error('Failed to cancel order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReturnOrder = async (reason: string) => {
        setSubmitting(true);
        try {
            await orderApi.returnOrder(orderId!, reason);
            success('Return request submitted successfully');
            setShowReturnModal(false);
            fetchOrder(); // Refresh order details
        } catch (err: any) {
            console.error('Failed to return order:', err);
            if (err.response && err.response.data && err.response.data.message) {
                error(err.response.data.message);
            } else {
                error('Failed to return order');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenReview = (product: { id: string; title: string }) => {
        setSelectedProductForReview(product);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (rating: number, review: string) => {
        if (!selectedProductForReview) return;

        try {
            // Submit Rating
            await reviewApi.createRating({
                productId: selectedProductForReview.id,
                rating: rating
            });

            // Submit Review
            await reviewApi.createReview({
                productId: selectedProductForReview.id,
                review: review
            });

            success('Review submitted successfully!');
            setShowReviewModal(false);
        } catch (err: any) {
            console.error('Failed to submit review:', err);
            // Check if backend returned a specific error message
            if (err.response && err.response.data && err.response.data.message) {
                error(err.response.data.message);
            } else {
                error('Failed to submit review. You may have already reviewed this.');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!order) {
        return <div className="error-page">Order not found</div>;
    }

    const canCancel = ['PENDING', 'PLACED', 'CONFIRMED', 'SHIPPED'].includes(order.orderStatus);
    const canReview = order.orderStatus === 'DELIVERED';
    const canReturn = order.orderStatus === 'DELIVERED';

    return (
        <div className="order-detail-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Order Details</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {canCancel && (
                        <button
                            className="btn-cancel"
                            onClick={() => setShowCancelModal(true)}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel Order
                        </button>
                    )}
                    {canReturn && (
                        <button
                            className="btn-return"
                            onClick={() => setShowReturnModal(true)}
                            style={{
                                backgroundColor: '#ff9800',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Return Order
                        </button>
                    )}
                </div>
            </div>

            <div className="order-detail-container">
                <div className="order-info-section">
                    <h2>Order #{order.orderId}</h2>
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p>Payment Status: <span className="payment-status">{order.paymentDetails?.status || 'Pending'}</span></p>
                    <p>Status: <span className="order-status">{order.orderStatus}</span></p>
                </div>

                <OrderTracker activeStatus={order.orderStatus} />

                <div className="shipping-info-section">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.streetAddress}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>Phone: {order.shippingAddress.mobile}</p>
                </div>

                <div className="order-items-section">
                    <h3>Order Items</h3>
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="order-item-detail">
                            <img src={item.product.imageUrl} alt={item.product.title} />
                            <div className="item-info">
                                <h4>{item.product.title}</h4>
                                <p>Size: {item.size}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: {formatPrice(item.discountedPrice)}</p>
                            </div>
                            <div className="item-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <div className="item-total">
                                    {formatPrice(item.discountedPrice * item.quantity)}
                                </div>
                                {canReview && (
                                    <button
                                        onClick={() => handleOpenReview({ id: item.product.id, title: item.product.title })}
                                        className="btn-review"
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6c5ce7',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-summary-section">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Discount</span>
                        <span>- {formatPrice(order.discount)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{formatPrice(order.totalDiscountedPrice)}</span>
                    </div>
                </div>
            </div>

            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
                isSubmitting={submitting}
            />

            <CancelOrderModal
                isOpen={showReturnModal}
                onClose={() => setShowReturnModal(false)}
                onConfirm={handleReturnOrder}
                isSubmitting={submitting}
                title="Return Order"
                message="Are you sure you want to return this order? Please provide a reason."
            />

            {selectedProductForReview && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    productId={selectedProductForReview.id}
                    productName={selectedProductForReview.title}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
};

export default OrderDetailPage;
