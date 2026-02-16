import React from 'react';
import { Order } from '../../types/order.types';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency';

interface OrderItemProps {
    order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED': return 'green';
            case 'CONFIRMED': return 'blue';
            case 'SHIPPED': return 'purple';
            case 'DELIVERED': return 'teal';
            case 'CANCELLED': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Link to={`/orders/${order.id}`} className="order-item">
            <div className="order-header">
                <div>
                    <h4>Order #{order.orderId}</h4>
                    <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                    {order.orderStatus}
                </span>
            </div>

            <div className="order-details">
                <p>{order.totalItem} item(s)</p>
                <p className="order-total">{formatPrice(order.totalPrice)}</p>
            </div>

            <div className="order-payment">
                <span className="payment-status">Payment: {order.paymentDetails?.status || 'Pending'}</span>
            </div>
        </Link>
    );
};

export default OrderItem;
