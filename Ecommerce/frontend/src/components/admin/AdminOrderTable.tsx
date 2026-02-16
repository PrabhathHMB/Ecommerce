import React, { useState } from 'react';
import { Order } from '../../types/order.types';
import { formatPrice } from '../../utils/currency';
import { Trash2, XCircle } from 'lucide-react';
import './AdminTable.css';

interface AdminOrderTableProps {
    orders: Order[];
    onPlace: (orderId: string) => void;
    onConfirm: (orderId: string) => void;
    onShip: (orderId: string) => void;
    onDeliver: (orderId: string) => void;
    onCancel: (orderId: string) => void;
    onDelete: (orderId: string) => void;
}

const AdminOrderTable: React.FC<AdminOrderTableProps> = ({
    orders, onPlace, onConfirm, onShip, onDeliver, onCancel, onDelete
}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    // Get current orders
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
        <div className="admin-table-container">
            <table className="admin-sheet-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Details</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <span style={{ fontFamily: 'monospace', color: '#666', fontSize: '0.85rem' }}>
                                    #{order.id.substring(0, 8)}
                                </span>
                            </td>
                            <td>
                                {new Date(order.orderDate).toLocaleDateString()}
                                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </td>
                            <td>
                                <div style={{ fontWeight: 500 }}>
                                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown'}
                                </div>
                            </td>
                            <td>
                                <div style={{ fontSize: '0.85rem' }}>
                                    {order.user?.email || '-'}
                                </div>
                            </td>
                            <td>
                                <div style={{ fontSize: '0.9rem' }}>
                                    {order.totalItem} Items
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                    See details &rarr;
                                </div>
                            </td>
                            <td style={{ fontWeight: 600 }}>
                                {formatPrice(order.totalPrice)}
                            </td>
                            <td>
                                <span
                                    style={{
                                        backgroundColor: getStatusColor(order.orderStatus),
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td>
                                <span
                                    style={{
                                        color: order.paymentDetails?.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                                        fontWeight: 500,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {order.paymentDetails?.status || 'Pending'}
                                </span>
                                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                    {order.paymentDetails?.paymentMethod || 'N/A'}
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {order.orderStatus === 'PENDING' && (
                                        <button
                                            onClick={() => onPlace(order.id)}
                                            className="action-btn"
                                            style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', width: 'auto', borderRadius: '4px' }}
                                            title="Mark Placed"
                                        >
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>PLACE</span>
                                        </button>
                                    )}
                                    {order.orderStatus === 'PLACED' && (
                                        <button
                                            onClick={() => onConfirm(order.id)}
                                            className="action-btn"
                                            style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', width: 'auto', borderRadius: '4px' }}
                                            title="Confirm"
                                        >
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>CONFIRM</span>
                                        </button>
                                    )}
                                    {order.orderStatus === 'CONFIRMED' && (
                                        <button
                                            onClick={() => onShip(order.id)}
                                            className="action-btn"
                                            style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '4px 8px', width: 'auto', borderRadius: '4px' }}
                                            title="Ship"
                                        >
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>SHIP</span>
                                        </button>
                                    )}
                                    {order.orderStatus === 'SHIPPED' && (
                                        <button
                                            onClick={() => onDeliver(order.id)}
                                            className="action-btn"
                                            style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', width: 'auto', borderRadius: '4px' }}
                                            title="Deliver"
                                        >
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>DELIVER</span>
                                        </button>
                                    )}
                                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'RETURNED' && (
                                        <button onClick={() => onCancel(order.id)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }} title="Cancel">
                                            <XCircle size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => onDelete(order.id)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }} title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {
                totalPages > 1 && (
                    <div className="pagination-container">
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt; Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                Sheet {page}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default AdminOrderTable;
