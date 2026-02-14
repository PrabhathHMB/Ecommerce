import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types/order.types';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { Trash2, Truck, CheckCircle, XCircle, Package } from 'lucide-react';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { success, error: toastError } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderApi.getAllOrders();
            // Sort by createdAt descending (newest first)
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.orderDate).getTime();
                const dateB = new Date(b.createdAt || b.orderDate).getTime();
                return dateB - dateA;
            });
            setOrders(sortedData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toastError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async (orderId: string) => {
        try {
            await orderApi.placedOrder(orderId);
            success('Order marked as Placed');
            fetchOrders();
        } catch (error) {
            console.error('Failed to place order:', error);
            toastError('Failed to place order');
        }
    };

    const handleConfirmOrder = async (orderId: string) => {
        try {
            await orderApi.confirmOrder(orderId);
            success('Order confirmed successfully');
            fetchOrders();
        } catch (error) {
            console.error('Failed to confirm order:', error);
            toastError('Failed to confirm order');
        }
    };

    const handleShipOrder = async (orderId: string) => {
        try {
            await orderApi.shipOrder(orderId);
            success('Order marked as shipped');
            fetchOrders();
        } catch (error) {
            console.error('Failed to ship order:', error);
            toastError('Failed to ship order');
        }
    };

    const handleDeliverOrder = async (orderId: string) => {
        try {
            await orderApi.deliverOrder(orderId);
            success('Order marked as delivered');
            fetchOrders();
        } catch (error) {
            console.error('Failed to deliver order:', error);
            toastError('Failed to deliver order');
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            await orderApi.cancelOrder(orderId);
            success('Order cancelled');
            fetchOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toastError('Failed to cancel order');
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;

        try {
            await orderApi.deleteOrder(orderId);
            success('Order deleted');
            fetchOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
            toastError('Failed to delete order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED': return '#28a745'; // Green
            case 'CONFIRMED': return '#007bff'; // Blue
            case 'SHIPPED': return '#6f42c1'; // Purple
            case 'DELIVERED': return '#10b981'; // Teal
            case 'CANCELLED': return '#ef4444'; // Red
            case 'PENDING': return '#f59e0b'; // Amber
            default: return '#6b7280'; // Gray
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Order Management</h1>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="admin-card">
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Payment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                                                    #{order.id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>
                                                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown User'}
                                                </div>
                                            </td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>{order.totalItem} items</td>
                                            <td>{formatPrice(order.totalPrice)}</td>
                                            <td>
                                                <span
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge`} style={{ backgroundColor: order.paymentDetails?.status === 'COMPLETED' ? '#10b981' : '#f59e0b' }}>
                                                    {order.paymentDetails?.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {order.orderStatus === 'PENDING' && (
                                                        <button
                                                            onClick={() => handlePlaceOrder(order.id)}
                                                            className="btn-primary"
                                                            title="Mark Placed"
                                                            style={{ padding: '0.4rem', backgroundColor: '#28a745' }}
                                                        >
                                                            <CheckCircle size={16} /> Mark Placed
                                                        </button>
                                                    )}
                                                    {order.orderStatus === 'PLACED' && (
                                                        <button
                                                            onClick={() => handleConfirmOrder(order.id)}
                                                            className="btn-primary"
                                                            title="Confirm Order"
                                                            style={{ padding: '0.4rem' }}
                                                        >
                                                            <CheckCircle size={16} /> Confirm
                                                        </button>
                                                    )}
                                                    {order.orderStatus === 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => handleShipOrder(order.id)}
                                                            className="btn-primary"
                                                            title="Ship Order"
                                                            style={{ padding: '0.4rem', backgroundColor: '#6f42c1' }}
                                                        >
                                                            <Truck size={16} /> Ship
                                                        </button>
                                                    )}
                                                    {order.orderStatus === 'SHIPPED' && (
                                                        <button
                                                            onClick={() => handleDeliverOrder(order.id)}
                                                            className="btn-primary"
                                                            title="Deliver Order"
                                                            style={{ padding: '0.4rem', backgroundColor: '#10b981' }}
                                                        >
                                                            <Package size={16} /> Deliver
                                                        </button>
                                                    )}
                                                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="btn-secondary"
                                                            title="Cancel Order"
                                                            style={{ padding: '0.4rem', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                                        >
                                                            <XCircle size={16} /> Cancel
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        className="btn-danger"
                                                        title="Delete Order"
                                                        style={{ padding: '0.4rem' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminOrders;
