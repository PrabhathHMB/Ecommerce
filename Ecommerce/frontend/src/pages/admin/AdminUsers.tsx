import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import { User, SignupRequest } from '../../types/auth.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Trash2 } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { success, error: toastError } = useToast();

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userApi.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toastError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        const newAdmin: SignupRequest = {
            firstName,
            lastName,
            email,
            password,
            role: 'ROLE_ADMIN'
        };

        try {
            await authApi.signup(newAdmin);
            success('New Admin User Created Successfully!');
            setShowForm(false);
            resetForm();
            fetchUsers();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to create admin user.';
            setFormError(msg);
            toastError(msg);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setFormError('');
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>User Management</h1>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            + Add New Admin
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="admin-form-container">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Admin User</h2>
                        </div>

                        {formError && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleCreateAdmin}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {!showForm && (
                    <>
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="admin-card">
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                                                            {user.id.substring(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 500 }}>
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`role-badge ${user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-danger"
                                                            title="Delete User"
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                            onClick={async () => {
                                                                if (window.confirm('Are you sure you want to delete this user?')) {
                                                                    try {
                                                                        await authApi.deleteUser(user.id);
                                                                        success('User deleted successfully');
                                                                        fetchUsers();
                                                                    } catch (err) {
                                                                        console.error('Failed to delete user', err);
                                                                        toastError('Failed to delete user');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default AdminUsers;
