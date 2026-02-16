import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types/order.types';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import AdminOrderTable from '../../components/admin/AdminOrderTable';

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
                        <AdminOrderTable
                            orders={orders}
                            onPlace={handlePlaceOrder}
                            onConfirm={handleConfirmOrder}
                            onShip={handleShipOrder}
                            onDeliver={handleDeliverOrder}
                            onCancel={handleCancelOrder}
                            onDelete={handleDeleteOrder}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminOrders;
