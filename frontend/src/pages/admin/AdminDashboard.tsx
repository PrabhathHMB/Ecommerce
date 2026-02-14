import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardChart from '../../components/admin/DashboardChart';
import DashboardPieChart from '../../components/admin/DashboardPieChart';
import _ from 'lodash';
import { formatPrice } from '../../utils/currency';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [orders, products] = await Promise.all([
                orderApi.getAllOrders(),
                productApi.getAllProductsAdmin()
            ]);

            // Calculate stats
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalDiscountedPrice || 0), 0);
            const pendingOrders = orders.filter(order => order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED').length;

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                pendingOrders,
                totalRevenue
            });

            // Prepare chart data (Group orders by date)
            const ordersByDate = _.groupBy(orders, (order) => {
                const date = new Date(order.createdAt || order.orderDate);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });

            const chartData = Object.keys(ordersByDate).map(date => ({
                date,
                value: ordersByDate[date].reduce((sum, order) => sum + (order.totalDiscountedPrice || 0), 0)
            })).slice(-7); // Last 7 days/entries

            setChartData(chartData);

            // Prepare pie chart data (Group orders by status)
            const ordersByStatus = _.countBy(orders, 'orderStatus');
            const statusData = Object.keys(ordersByStatus).map(status => ({
                name: status,
                value: ordersByStatus[status]
            }));
            setPieData(statusData);

        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p className="stat-number">{stats.totalProducts}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats.totalOrders}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Pending Orders</h3>
                        <p className="stat-number">{stats.pendingOrders}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">{formatPrice(stats.totalRevenue)}</p>
                    </div>
                </div>

                <div className="charts-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="admin-card" style={{ flex: '1 1 500px', padding: '1.5rem' }}>
                        <DashboardChart data={chartData} title="Revenue Overview" />
                    </div>
                    <div className="admin-card" style={{ flex: '1 1 400px', padding: '1.5rem' }}>
                        <DashboardPieChart data={pieData} title="Orders by Status" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
