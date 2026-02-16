import React, { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import { Product, CreateProductRequest } from '../../types/product.types';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductForm from '../../components/admin/ProductForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const { success, error: showError } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productApi.getAllProductsAdmin();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateProductRequest) => {
        try {
            await productApi.createProduct(data);
            success('Product created successfully!');
            setShowForm(false);
            fetchProducts();
        } catch (error: any) {
            console.error('Failed to create product:', error);
            showError(`Failed to create product: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleUpdate = async (data: Product) => {
        try {
            await productApi.updateProduct(data.id, data);
            success('Product updated successfully!');
            setEditingProduct(undefined);
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
            showError('Failed to update product');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productApi.deleteProduct(productId);
            success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            showError('Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProduct(undefined);
    };

    const handleFormSubmit = async (data: Product | CreateProductRequest) => {
        if (editingProduct) {
            // Type guard: if we're editing, data should be treated as Product
            await handleUpdate(data as Product);
        } else {
            // Type guard: if we're creating, data should be treated as CreateProductRequest
            await handleCreate(data as CreateProductRequest);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Product Management</h1>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            + Add New Product
                        </button>
                    )}
                </div>

                {showForm ? (
                    <ProductForm
                        product={editingProduct}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                ) : (
                    <>
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="admin-card">
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.title}
                                                            className="product-thumb"
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 500 }}>{product.title}</div>
                                                    </td>
                                                    <td>{product.brand}</td>
                                                    <td>{formatPrice(product.discountedPrice)}</td>
                                                    <td>
                                                        {product.sizes && product.sizes.length > 0 ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.85rem' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Total: {product.quantity}</span>
                                                                {product.sizes.map((size, index) => (
                                                                    <span key={index} style={{ color: size.quantity <= 0 ? 'red' : 'inherit' }}>
                                                                        {size.name}: {size.quantity} {size.quantity <= 0 ? '(Out of Stock)' : ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: product.quantity <= 0 ? 'red' : 'inherit' }}>
                                                                {product.quantity} {product.quantity <= 0 ? '(Out of Stock)' : ''}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="btn-secondary"
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="btn-danger"
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                            >
                                                                Delete
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
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
