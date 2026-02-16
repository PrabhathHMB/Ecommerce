import React, { useEffect, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { Order } from '../types/order.types';
import OrderItem from '../components/order/OrderItem';
import LoadingSpinner from '../components/common/LoadingSpinner';

import Pagination from '../components/common/Pagination';
import '../components/common/Pagination.css';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderApi.getOrderHistory();
            // Sort by createdAt descending (newest first)
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.orderDate).getTime();
                const dateB = new Date(b.createdAt || b.orderDate).getTime();
                return dateB - dateA;
            });
            setOrders(sortedData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (orders.length === 0) {
        return (
            <div className="empty-orders">
                <h2>No orders yet</h2>
                <p>Start shopping to see your orders here</p>
            </div>
        );
    }

    // Pagination Logic
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="orders-page">
            <h1>Order History</h1>

            <div className="orders-list">
                {currentOrders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default OrderHistoryPage;
