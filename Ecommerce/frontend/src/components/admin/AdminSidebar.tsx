import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Package } from 'lucide-react';
import '../../styles/admin.css';

const AdminSidebar: React.FC = () => {
    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2>Admin Panel</h2>
            </div>

            <nav className="admin-nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <LayoutDashboard />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <ShoppingBag />
                    Products
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <Package />
                    Orders
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                    <Users />
                    Users
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminSidebar;
